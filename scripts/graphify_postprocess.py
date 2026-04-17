#!/usr/bin/env python3
"""Post-extraction cleanup for the graphify knowledge graph.

Run after `graphify build` or `/graphify` to fix fragmentation from
subagent extraction. Idempotent — safe to re-run.

What it does:
  1. Merge duplicate nodes (same concept, different IDs across chunks)
  2. Fix hyperedges (dead refs, normalize members->nodes)
  3. Normalize edge confidence format
  4. Normalize edge relation types (collapse synonyms)
  5. Infer missing file_type and source_file
  6. Add bridge edges for disconnected clusters and leaf nodes
  7. Remap file_types to graphify's valid set

Usage:
  python scripts/graphify_postprocess.py [--dry-run]
"""

import argparse
import glob
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

GRAPH_PATH = Path("graphify-out/graph.json")

# ---------------------------------------------------------------------------
# 1. MERGE MAP — known duplicate node IDs from subagent extraction
#
# Each key is the surviving node ID. Values are IDs to merge into it.
# Extend this as new extractions introduce new dupes.
# ---------------------------------------------------------------------------
MERGE_MAP = {
    # BFF
    "concept:bff": ["concept:bff-framework", "concept_build_friction_fix"],
    # MEB
    "concept:mental-experimentation-budget": [
        "concept_mental_experimentation_budget",
        "concept:mental-experimentation-budgets",
    ],
    # Citations
    "citation:kahneman-thinking-fast-slow": [
        "cite_kahneman_thinking_fast_slow",
        "citation:thinking-fast-and-slow",
    ],
    "citation:meadows-thinking-in-systems": [
        "cite_meadows_thinking_systems",
        "citation:thinking-in-systems",
    ],
    "citation:mollick-co-intelligence": [
        "cite_mollick_co_intelligence",
        "citation:co-intelligence-book",
    ],
    "citation:golf-beneath-the-surface": ["cite_prior_golf_beneath_surface"],
    # People (entity: vs person: dupes)
    "person:steve-yegge": ["entity:steve-yegge", "entity:yegge"],
    "person:charity-majors": ["entity:charity-majors"],
    "person:lara-hogan": ["entity:lara-hogan"],
    "person:mitchell-hashimoto": ["entity:mitchell-hashimoto"],
    "person:simon-willison": ["entity:simon-willison"],
    "entity:hunter-s-thompson": ["person_hunter_thompson"],
    "person:kent-beck": ["entity:kent-beck"],
    "entity:michael-lopp": ["entity:rands"],
    "entity:sturgill-simpson": ["person_johnny_blue_skies"],
    # Concepts
    "concept:own-your-understanding": ["kernel:own-your-understanding"],
    "idea:quit-conditions": ["kernel:quit-conditions"],
    "concept:vibe-thinking": ["kernel:vibe-thinking"],
    "concept:authenticity": ["concept:authenticity-as-resistance", "kernel:authenticity"],
    "concept:therapy": ["kernel:therapy"],
    "concept:site-branding": ["concept:branding"],
    "concept:adult-adhd-diagnosis": ["idea:adult-adhd-diagnosis"],
    "concept:wispr-flow": ["tool_wispr_flow", "entity:wispr-flow", "tool:wispr-flow"],
    "concept:fitfo": ["kernel:fitfo"],
    "concept:lowerchaos": ["rationale_wtf_domain"],
    "concept:action-brings-clarity": ["concept:action-over-paralysis"],
    "concept:cosmic-farmland": ["concept_cosmic_farmland", "kernel:cosmic-farmland"],
    "concept:co-intelligence": ["concept_co_intelligence"],
    # Ideas
    "idea:ai-is-a-how": ["kernel:ai-is-a-how"],
    "idea:engineering-excellence": ["kernel:engineering-excellence"],
    "idea:ai-engineering-grief": ["kernel:ai-engineering-grief"],
    "idea:push-pull-communication": ["kernel:push-pull-communication"],
}

# ---------------------------------------------------------------------------
# 2. RELATION NORMALIZATION — collapse synonym relation types
# ---------------------------------------------------------------------------
RELATION_MAP = {
    # -> references
    "referenced_in": "references", "mentioned_in": "references", "quotes": "references",
    # -> related_to
    "connected_to": "related_to", "conceptually_related_to": "related_to",
    "thematically_linked": "related_to", "thematically_related": "related_to",
    "potentially_connected_to": "related_to", "associated_with": "related_to",
    "paired_with": "related_to", "RELATES_TO": "related_to",
    # -> influences
    "influenced_by": "influences", "influenced": "influences",
    "draws_on": "influences", "grounded_in": "influences",
    "contextualized_by": "influences", "motivated_by": "influences",
    # -> inspires
    "inspired_format_for": "inspires",
    # -> expresses
    "embodies": "expresses", "represents": "expresses", "declares": "expresses",
    "depicts": "expresses", "reflects": "expresses", "reflected_back": "expresses",
    "EXHIBITS": "expresses",
    # -> implements
    "implemented_by": "implements", "ENABLED_BY": "implements", "enabled_by": "implements",
    # -> produces
    "produced": "produces", "PRODUCES": "produces", "creates_tension": "produces",
    "spawned": "produces", "feeds_into": "produces",
    # -> part_of
    "HAS_PHASE": "part_of", "HAS_FORM": "part_of",
    "incorporates": "part_of", "structured_by": "part_of",
    # -> extends
    "precedes": "extends", "sprouted_into": "extends",
    # -> supports
    "sustains": "supports", "contributes_to": "supports",
    "serves_as": "supports", "ADVOCATES": "supports",
    # -> constrains
    "COSTS": "constrains", "RISK": "constrains",
    # -> applies
    "applies_to": "applies", "maps_to": "applies", "measures_via": "applies",
    # -> explores
    "diagnoses": "explores", "identifies": "explores", "identifies_friction_in": "explores",
    # -> critiques
    "potentially_critiques": "critiques", "opposes": "critiques",
    "challenges": "critiques", "complicates": "critiques",
    # -> creates
    "created": "creates", "created_by": "creates", "CREATED": "creates",
    # -> categorizes
    "groups": "categorizes", "instance_of": "categorizes",
    "INSTANCE": "categorizes", "METAPHOR": "categorizes",
}

# ---------------------------------------------------------------------------
# 3. BRIDGE EDGES — connect disconnected clusters and leaf nodes
#
# Format: (source, target, relation)
# Edges are only added if both nodes exist and the edge doesn't already exist.
# ---------------------------------------------------------------------------
BRIDGE_EDGES = [
    # Cluster bridges (connect island components to main graph)
    ("kernel:experimentation-budgets", "concept:experimentation-budget", "related_to"),
    ("kernel:behavioral-economics", "concept:mental-experimentation-budget", "informs"),
    ("concept:portfolio-thinking", "concept:mental-experimentation-budget", "informs"),
    ("kernel:throw-it-all-away", "concept:bff", "expresses"),
    ("kernel:cambrian-explosion", "concept:experimentation-budget", "expresses"),
    ("concept:mh-branding", "concept:cosmic-farmland", "defines"),
    ("person:marshall-houston", "concept:cosmic-farmland", "creates"),
    ("idea_giscus_comments", "concept:cosmic-farmland", "enhances"),
    ("concept:combinatorial-creativity", "concept:authenticity", "supports"),
    ("kernel:divergent-thinking", "concept:authenticity", "supports"),
    ("kernel:knowing-yourself", "concept:adult-adhd-diagnosis", "expresses"),
    ("idea:ai-engineering-grief", "concept:co-intelligence", "tensions_with"),
    ("idea:ai-is-a-how", "concept:co-intelligence", "expresses"),
    ("idea:engineering-excellence", "concept:bff", "expresses"),
    ("idea:push-pull-communication", "idea:engineering-excellence", "related_to"),
    ("concept:cosmic-farmland", "concept:lowerchaos", "expresses"),
    ("tool:feedback-review-app", "concept:co-intelligence", "implements"),
    ("tool:tools-repo", "concept:cosmic-farmland", "supports"),
    ("entity:grateful-dead", "concept:authenticity", "inspires"),
    ("entity:talking-heads", "concept:authenticity", "inspires"),
    ("concept::site-avatar", "concept:cosmic-farmland", "defines"),
    ("idea:hobbies-evolution", "concept:adult-adhd-diagnosis", "expresses"),
    ("assets_js_capitalize_toggle_js", "concept:lowerchaos", "implements"),
    ("tests_capitalize_toggle_spec_js", "assets_js_capitalize_toggle_js", "tests"),
    ("tests_site_properties_spec_js", "concept:cosmic-farmland", "tests"),
    ("playwright_config_js", "tests_capitalize_toggle_spec_js", "configures"),

    # Leaf node connections
    ("draft_experimentation_budget_v0", "draft_experimentation_budget_v1", "extends"),
    ("draft_experimentation_budget_v1", "draft_meb_v2", "extends"),
    ("draft_meb_v2", "draft_meb_v3", "extends"),
    ("draft_meb_v3", "draft_meb_v4", "extends"),
    ("draft_bff", "concept:build-phase", "describes"),
    ("draft_bff", "concept:friction-phase", "describes"),
    ("draft_bff", "concept:fix-phase", "describes"),
    ("citation:range", "concept:experimentation-budget", "informs"),
    ("citation:think-again", "concept:experimentation-budget", "informs"),
    ("citation:thinking-in-bets", "concept:portfolio-thinking", "informs"),
    ("citation:freire-praxis", "concept:agapic-energy", "informs"),
    ("citation:stevenson-proximity", "concept:agapic-energy", "informs"),
    ("citation:yeats-widening-gyre", "concept:widening-gyre", "informs"),
    ("entity:grady-booch", "idea:engineering-excellence", "inspires"),
    ("entity:boris-cherney", "idea:engineering-excellence", "inspires"),
    ("person:chelsea-troy", "concept:debugging-as-love-language", "inspires"),
    ("person:will-larson", "idea:engineering-excellence", "inspires"),
    ("person:gergely-orosz", "idea:engineering-excellence", "inspires"),
    ("person:lenny-rachitsky", "idea:engineering-excellence", "inspires"),
    ("entity:sahaj-garg", "concept:co-intelligence", "inspires"),
    ("person:geoffrey-huntley", "idea:engineering-excellence", "inspires"),
    ("person:jesse-spevack", "idea:engineering-excellence", "inspires"),
    ("entity:william-faulkner", "concept:authenticity", "inspires"),
    ("entity:chip-cooper", "concept:alabama-identity", "related_to"),
    ("entity:diane-nash", "concept:agapic-energy", "inspires"),
    ("entity:uncle-val-mcgee", "concept:memory-as-inheritance", "related_to"),
    ("entity:harper-lee", "concept:alabama-identity", "related_to"),
    ("concept:waterline-principle", "concept:decision-velocity", "informs"),
    ("concept:decision-velocity", "concept:bff", "applies"),
    ("concept:no-tracking", "concept:cosmic-farmland", "defines"),
    ("concept:transparency", "concept:cosmic-farmland", "defines"),
    ("concept:sacred-geometry", "kernel:tattoos", "related_to"),
    ("concept:rabbit-holes", "concept:experimentation-budget", "tensions_with"),
    ("concept:compounding-systems", "concept:compounding", "related_to"),
    ("concept:learning-from-nature", "kernel:cambrian-explosion", "related_to"),
    ("concept:seasons-of-intensity", "concept:intensity", "related_to"),
    ("concept:constraints-as-creative-force", "concept:authenticity", "supports"),
    ("concept:depth-over-breadth", "concept:own-your-understanding", "supports"),
    ("concept:two-week-sprint", "concept:experimentation-budget", "critiques"),
    ("concept:fractal-pattern", "concept:compounding-systems", "related_to"),
    ("concept:you-can-always-change-it-later", "concept:bff", "expresses"),
    ("concept:interested-and-interesting", "concept:depth-over-breadth", "related_to"),
    ("concept:finding-voice", "concept:authenticity", "part_of"),
    ("concept:notes-to-words", "concept:finding-voice", "related_to"),
    ("concept:capitalize-toggle", "concept:lowerchaos", "implements"),
    ("concept:first-domain-registration", "concept:cosmic-farmland", "part_of"),
    ("concept:content-pipeline", "concept:cosmic-farmland", "part_of"),
    ("concept:open-graph", "concept:site-branding", "part_of"),
    ("concept:coaching-middle-school", "concept:systems-thinking", "applies"),
    ("concept:daughter-family", "concept:compounding", "expresses"),
    ("concept:bids-for-connection", "concept:authenticity", "supports"),
    ("concept:neurodivergence-adhd", "concept:adult-adhd-diagnosis", "related_to"),
    ("concept:debugging-as-love-language", "concept:debugging-as-lens", "related_to"),
    ("concept:structured-feedback", "concept:co-intelligence", "part_of"),
    ("concept:handoff-skill", "concept:co-intelligence", "part_of"),
    ("concept:build-everything-possible", "concept:experimentation-budget", "tensions_with"),
    ("concept:therapy", "concept:adult-adhd-diagnosis", "related_to"),
    ("concept:transformative-travel", "idea:travel-special-places", "related_to"),
    ("concept:widening-gyre", "concept:authenticity", "inspires"),
    ("kernel:writing-process", "concept:co-intelligence", "part_of"),
    ("kernel:ai-guide", "concept:co-intelligence", "supports"),
    ("kernel:tattoos", "concept:identity-questions", "expresses"),
    ("kernel:daughter", "concept:daughter-family", "related_to"),
    ("kernel:expect-friction", "concept:bff", "expresses"),
    ("kernel:influences", "idea:influences-catalog", "related_to"),
    ("kernel:people-who-know-me", "concept:identity-questions", "expresses"),
    ("kernel:intensity", "concept:intensity", "expresses"),
    ("kernel:mullet-domains", "concept:lowerchaos", "expresses"),
    ("kernel:freedom-through-constraints", "concept:constraints-as-creative-force", "related_to"),
    ("kernel:were-all-builders", "concept:bff", "expresses"),
    ("kernel:creativity", "concept:authenticity", "supports"),
    ("kernel:build-boosters-not-naysayers", "concept:bff", "supports"),
    ("kernel:moonshots", "concept:experimentation-budget", "related_to"),
    ("kernel:hobbies", "idea:hobbies-evolution", "related_to"),
    ("kernel:ten-ninety", "concept:experimentation-budget", "applies"),
    ("kernel:remixer", "concept:combinatorial-creativity", "expresses"),
    ("kernel:judgement-framework", "concept:decision-velocity", "related_to"),
    ("kernel:tech-debt-arguments", "idea:tech-debt-arguments", "related_to"),
    ("idea:pain-cycle", "concept:bff", "related_to"),
    ("idea:durable-learning", "concept:own-your-understanding", "supports"),
    ("idea:sports-analytics-systems", "concept:systems-thinking", "applies"),
    ("idea:lowerchaos-linkedin-draft", "concept:lowerchaos", "expresses"),
    ("idea:influences-catalog", "idea:hobbies-evolution", "related_to"),
    ("tool:claude-code", "concept:co-intelligence", "implements"),
    ("tool:pup", "concept:cosmic-farmland", "supports"),
    ("tool:ddsearch", "concept:cosmic-farmland", "supports"),
    ("tool:feedback-review-app", "concept:structured-feedback", "implements"),
    ("page:kernels", "concept:cosmic-farmland", "part_of"),
    ("entity:lazar-jovanovic", "citation:lazar-lennys-newsletter", "references"),
    ("entity:zach-lamb", "concept:bff", "inspires"),
    ("entity:china-cat-sunflower", "entity:grateful-dead", "part_of"),
    ("concept:ai-adoption-levels", "concept:co-intelligence", "describes"),
    ("concept:old-brain-young-brain", "concept:mental-experimentation-budget", "informs"),
    ("concept:outcome_shock", "concept:mental-experimentation-budget", "part_of"),
    ("app:justpreach", "concept:bff", "applies"),
    ("concept:agapic-energy", "concept:alabama-identity", "related_to"),
    ("rationale:style-vs-accessibility", "concept:lowerchaos", "informs"),
    ("rationale:failure-as-information", "concept:experimentation-budget", "informs"),
    ("rationale:econ-english-combination", "concept:systems-thinking", "informs"),
    ("rationale:self-knowledge-cluster", "concept:adult-adhd-diagnosis", "describes"),
    ("rationale_railway_migration", "concept:cosmic-farmland", "informs"),
    ("rationale_drop_github_pages_gem", "concept:cosmic-farmland", "informs"),
    ("rationale_voice_lowercase", "concept:lowerchaos", "defines"),
    ("rationale_giscus_over_alternatives", "concept:cosmic-farmland", "informs"),
    ("idea_rich_metadata", "concept:cosmic-farmland", "enhances"),
    ("idea_footer_rework", "concept:cosmic-farmland", "enhances"),
    ("idea_make_following_easy", "concept:cosmic-farmland", "enhances"),
    ("idea_local_dev_flow", "concept:cosmic-farmland", "enhances"),
    ("idea_tags_capitalization_bug", "concept:lowerchaos", "related_to"),
    ("post:hiyaaa-world", "concept:cosmic-farmland", "part_of"),

    # Singletons
    ("draft_bff", "concept:bff", "describes"),
    ("concept:freedom-rides", "concept:cosmic-farmland", "inspires"),
    ("idea:enneagram-7w8", "concept:adult-adhd-diagnosis", "related_to"),
    ("concept:waterline-principle", "concept:bff", "related_to"),
    ("rationale:visceral-first-draft-reaction", "concept:co-intelligence", "informs"),
    ("rationale:systems-thinking-thread", "concept:mental-experimentation-budget", "informs"),
    ("rationale:self-knowledge-cluster", "concept:adult-adhd-diagnosis", "categorizes"),
    ("kernel:people-who-know-me", "concept:adult-adhd-diagnosis", "expresses"),
    ("entity:kent-beck", "idea:engineering-excellence", "inspires"),
    ("entity:rands", "idea:engineering-excellence", "inspires"),
    ("entity:bryce-young", "concept:mental-experimentation-budget", "related_to"),
    ("citation:yeats-widening-gyre", "concept:authenticity", "inspires"),
    ("citation:lazar-lennys-newsletter", "idea:engineering-excellence", "informs"),
    ("readme_cosmic_farmland_site", "concept:cosmic-farmland", "describes"),
    ("llms_marshallhouston_site", "concept:cosmic-farmland", "describes"),
    ("page:tags", "concept:cosmic-farmland", "part_of"),
    ("page:books", "concept:cosmic-farmland", "part_of"),
    ("page:moments", "concept:cosmic-farmland", "part_of"),
]

# ---------------------------------------------------------------------------
# 4. FILE_TYPE REMAPPING — graphify only accepts a fixed set
# ---------------------------------------------------------------------------
GRAPHIFY_VALID_FILE_TYPES = {"code", "document", "image", "paper", "rationale"}

FILE_TYPE_REMAP = {
    "concept": "document", "kernel": "document", "idea": "document",
    "post": "document", "draft": "document", "citation": "paper",
    "person": "document", "tool": "document", "page": "document",
    "asset": "image", "metadata": "document", "config": "document",
    "unknown": "document",
}


# ===========================================================================
# Processing functions
# ===========================================================================

def merge_nodes(graph):
    """Merge duplicate nodes, repoint edges and hyperedges."""
    merge_map = {k: v for k, v in MERGE_MAP.items() if v}
    redirect = {}
    for survivor, dupes in merge_map.items():
        for dupe in dupes:
            redirect[dupe] = survivor

    if not redirect:
        return 0

    node_index = {n["id"]: n for n in graph["nodes"]}
    removed = set()

    for old_id, new_id in redirect.items():
        if old_id in node_index and new_id in node_index:
            for k, v in node_index[old_id].items():
                if k in ("id", "label"):
                    continue
                if k not in node_index[new_id] or node_index[new_id][k] is None:
                    node_index[new_id][k] = v
            removed.add(old_id)
        elif old_id in node_index:
            node_index[old_id]["id"] = new_id
            node_index[new_id] = node_index.pop(old_id)

    graph["nodes"] = [n for n in graph["nodes"] if n["id"] not in removed]

    # Redirect edges, remove self-loops and parallel edges
    seen = set()
    deduped = []
    for e in graph["links"]:
        for key in ("source", "target", "_src", "_tgt"):
            if key in e:
                e[key] = redirect.get(e[key], e[key])
        if e["source"] == e["target"]:
            continue
        edge_key = tuple(sorted([e["source"], e["target"]]))
        if edge_key not in seen:
            seen.add(edge_key)
            deduped.append(e)
    graph["links"] = deduped

    # Redirect hyperedge refs
    for location in (graph.get("graph", {}), graph):
        for h in location.get("hyperedges", []):
            for key in ("nodes", "members"):
                if key in h:
                    h[key] = list(dict.fromkeys(redirect.get(n, n) for n in h[key]))

    return len(removed)


def fix_hyperedges(graph):
    """Normalize members->nodes, remove dead refs, drop empty hyperedges."""
    node_ids = {n["id"] for n in graph["nodes"]}
    fixed = 0

    for location in (graph.get("graph", {}), graph):
        hyperedges = location.get("hyperedges", [])
        cleaned = []
        for h in hyperedges:
            if "members" in h:
                h["nodes"] = list(dict.fromkeys(h.get("nodes", []) + h.pop("members")))
            if "nodes" in h:
                before = len(h["nodes"])
                h["nodes"] = [n for n in h["nodes"] if n in node_ids]
                if len(h["nodes"]) < before:
                    fixed += 1
                if len(h["nodes"]) >= 2:
                    cleaned.append(h)
            else:
                cleaned.append(h)
            # Normalize confidence fields
            for old_key in ("basis", "provenance"):
                if old_key in h and "confidence_type" not in h:
                    h["confidence_type"] = h.pop(old_key)
                elif old_key in h:
                    del h[old_key]
        location["hyperedges"] = cleaned

    return fixed


def normalize_confidence(graph):
    """Normalize edge confidence to consistent string type + float score."""
    for edge in graph["links"]:
        conf = edge.get("confidence")
        score = edge.get("confidence_score")

        if isinstance(conf, (int, float)):
            if score is None:
                edge["confidence_score"] = float(conf)
            edge["confidence"] = "EXTRACTED" if conf >= 0.9 else "INFERRED"
        elif conf in ("unknown", None):
            edge["confidence"] = "INFERRED"
            if score is None:
                edge["confidence_score"] = 0.7

        if edge.get("confidence_score") is None:
            edge["confidence_score"] = 1.0 if edge.get("confidence") == "EXTRACTED" else 0.8


def normalize_relations(graph):
    """Collapse synonym relation types."""
    changed = 0
    for e in graph["links"]:
        rel = e.get("relation", "")
        if rel in RELATION_MAP:
            e["relation"] = RELATION_MAP[rel]
            changed += 1
    return changed


def infer_file_type(graph):
    """Fill missing file_type from node ID prefix, source_file, and label."""
    prefix_map = {
        "concept:": "concept", "concept::": "concept", "kernel:": "kernel",
        "idea:": "idea", "post:": "post", "draft_": "draft",
        "citation:": "citation", "cite_": "citation",
        "person:": "person", "entity:": "person",
        "tool:": "tool", "tool_": "tool",
        "rationale:": "rationale", "rationale_": "rationale",
        "value:": "metadata", "file:": "asset", "file::": "asset",
        "asset:": "asset", "page:": "page",
    }
    ext_map = {
        ".js": "code", ".py": "code", ".rb": "code", ".ts": "code",
        ".md": "document", ".html": "document",
        ".yml": "config", ".yaml": "config", ".json": "config",
        ".svg": "asset", ".png": "asset",
    }

    filled = 0
    for node in graph["nodes"]:
        if node.get("file_type") and node["file_type"] not in ("unknown", ""):
            continue
        nid = node["id"]
        inferred = None
        for prefix, ftype in prefix_map.items():
            if nid.startswith(prefix):
                inferred = ftype
                break
        if not inferred and node.get("source_file"):
            inferred = ext_map.get(Path(node["source_file"]).suffix.lower())
        if not inferred:
            label = node.get("label", "").lower()
            if label.endswith(".js") or label.endswith("()"):
                inferred = "code"
        if inferred:
            node["file_type"] = inferred
            filled += 1
    return filled


def remap_file_types(graph):
    """Remap custom file_types to graphify's valid set."""
    remapped = 0
    for n in graph["nodes"]:
        ft = n.get("file_type", "")
        if ft and ft not in GRAPHIFY_VALID_FILE_TYPES:
            n["file_type"] = FILE_TYPE_REMAP.get(ft, "document")
            remapped += 1
        elif not ft:
            n["file_type"] = "document"
            remapped += 1
    return remapped


def infer_source_files(graph):
    """Fill missing source_file from edges, filesystem, and conventions."""
    node_index = {n["id"]: n for n in graph["nodes"]}

    # From edges: if A->B and B has source_file, A can inherit it
    inferred = {}
    for e in graph["links"]:
        score = e.get("confidence_score", 0.5)
        for src_id, tgt_id in [(e["source"], e["target"]), (e["target"], e["source"])]:
            src = node_index.get(src_id)
            tgt = node_index.get(tgt_id)
            if src and tgt and not src.get("source_file") and tgt.get("source_file"):
                if src_id not in inferred or score > inferred[src_id][1]:
                    inferred[src_id] = (tgt["source_file"], score)

    filled = 0
    for nid, (sf, _) in inferred.items():
        node_index[nid]["source_file"] = sf
        filled += 1

    # From filesystem: kernels, ideas, posts
    for n in graph["nodes"]:
        if n.get("source_file"):
            continue
        nid = n["id"]
        if nid.startswith("kernel:"):
            kpath = f"_kernels/{nid.replace('kernel:', '')}.md"
            if Path(kpath).exists():
                n["source_file"] = kpath
                filled += 1
        elif nid.startswith("idea:"):
            slug = nid.replace("idea:", "")
            for subdir in ("writing", "tools", "site"):
                ipath = f"_ideas/{subdir}/{slug}.md"
                if Path(ipath).exists():
                    n["source_file"] = ipath
                    filled += 1
                    break
        elif nid.startswith("post:"):
            slug = nid.replace("post:", "")
            matches = glob.glob(f"_posts/*-{slug}.md")
            if matches:
                n["source_file"] = matches[0]
                filled += 1

    return filled


def add_bridge_edges(graph):
    """Add bridge edges for disconnected clusters and leaf nodes."""
    node_ids = {n["id"] for n in graph["nodes"]}
    existing = {(e["source"], e["target"]) for e in graph["links"]}
    existing.update({(e["target"], e["source"]) for e in graph["links"]})

    added = 0
    for src, tgt, relation in BRIDGE_EDGES:
        if src not in node_ids or tgt not in node_ids:
            continue
        if (src, tgt) in existing:
            continue
        graph["links"].append({
            "source": src, "target": tgt,
            "relation": relation,
            "confidence": "INFERRED", "confidence_score": 0.75,
            "weight": 0.75, "source_file": "postprocess",
            "_src": src, "_tgt": tgt,
        })
        existing.add((src, tgt))
        existing.add((tgt, src))
        added += 1
    return added


def count_components(graph):
    """Count connected components."""
    adj = defaultdict(set)
    all_ids = {n["id"] for n in graph["nodes"]}
    for e in graph["links"]:
        adj[e["source"]].add(e["target"])
        adj[e["target"]].add(e["source"])
    visited = set()
    count = 0
    for nid in all_ids:
        if nid not in visited:
            count += 1
            stack = [nid]
            while stack:
                cur = stack.pop()
                if cur in visited:
                    continue
                visited.add(cur)
                stack.extend(adj.get(cur, set()) - visited)
    return count


def count_leaves(graph):
    """Count nodes with <=1 edge."""
    deg = Counter()
    for e in graph["links"]:
        deg[e["source"]] += 1
        deg[e["target"]] += 1
    return sum(1 for n in graph["nodes"] if deg.get(n["id"], 0) <= 1)


# ===========================================================================
# Main
# ===========================================================================

def main():
    parser = argparse.ArgumentParser(description="Post-process graphify knowledge graph")
    parser.add_argument("--dry-run", action="store_true", help="Report changes without writing")
    args = parser.parse_args()

    if not GRAPH_PATH.exists():
        print(f"No graph at {GRAPH_PATH} — run graphify first.")
        return

    with open(GRAPH_PATH) as f:
        graph = json.load(f)

    nodes_before = len(graph["nodes"])
    edges_before = len(graph["links"])
    comps_before = count_components(graph)
    leaves_before = count_leaves(graph)

    print(f"Before: {nodes_before} nodes, {edges_before} edges, "
          f"{comps_before} components, {leaves_before} leaves")
    print()

    merged = merge_nodes(graph)
    print(f"  Merged {merged} duplicate nodes")

    hyper_fixed = fix_hyperedges(graph)
    print(f"  Fixed {hyper_fixed} hyperedge dead refs")

    normalize_confidence(graph)
    print(f"  Normalized edge confidence")

    rel_changed = normalize_relations(graph)
    print(f"  Normalized {rel_changed} edge relations")

    ft_filled = infer_file_type(graph)
    print(f"  Inferred file_type for {ft_filled} nodes")

    ft_remapped = remap_file_types(graph)
    print(f"  Remapped {ft_remapped} file_types to valid set")

    sf_filled = infer_source_files(graph)
    print(f"  Inferred source_file for {sf_filled} nodes")

    bridges = add_bridge_edges(graph)
    print(f"  Added {bridges} bridge edges")

    comps_after = count_components(graph)
    leaves_after = count_leaves(graph)
    rels = len(set(e.get("relation") for e in graph["links"]))

    print()
    print(f"After:  {len(graph['nodes'])} nodes, {len(graph['links'])} edges, "
          f"{comps_after} components, {leaves_after} leaves, {rels} relation types")

    if args.dry_run:
        print("\n(dry run — no changes written)")
    else:
        with open(GRAPH_PATH, "w") as f:
            json.dump(graph, f, indent=2, ensure_ascii=False)
        print(f"\nWrote to {GRAPH_PATH}")


if __name__ == "__main__":
    main()
