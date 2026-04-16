#!/usr/bin/env python3
"""Graph fix pass 3: merge remaining dupes, normalize relations, add edges for leaf nodes."""

import json
import re
from collections import defaultdict, Counter
from pathlib import Path

GRAPH_PATH = Path("graphify-out/graph.json")

# === REMAINING MERGES ===
MERGE_MAP = {
    "person:kent-beck": ["entity:kent-beck"],
    "entity:michael-lopp": ["entity:rands"],  # same person
    "entity:sturgill-simpson": ["person_johnny_blue_skies"],
    "concept:co-intelligence": ["concept_co_intelligence"],  # underscore dupe
}

# === RELATION NORMALIZATION ===
# Collapse 81 relation types to ~20 canonical ones
RELATION_MAP = {
    # -> references
    "referenced_in": "references",
    "mentioned_in": "references",
    "quotes": "references",
    # -> related_to
    "connected_to": "related_to",
    "conceptually_related_to": "related_to",
    "thematically_linked": "related_to",
    "thematically_related": "related_to",
    "potentially_connected_to": "related_to",
    "associated_with": "related_to",
    "paired_with": "related_to",
    "RELATES_TO": "related_to",
    # -> influences
    "influenced_by": "influences",
    "influenced": "influences",
    "draws_on": "influences",
    "grounded_in": "influences",
    "contextualized_by": "influences",
    "motivated_by": "influences",
    # -> inspires
    "inspired_format_for": "inspires",
    # -> expresses
    "embodies": "expresses",
    "represents": "expresses",
    "declares": "expresses",
    "depicts": "expresses",
    "reflects": "expresses",
    "reflected_back": "expresses",
    # -> implements
    "implemented_by": "implements",
    "ENABLED_BY": "implements",
    "enabled_by": "implements",
    # -> produces
    "produced": "produces",
    "PRODUCES": "produces",
    "creates_tension": "produces",
    "spawned": "produces",
    "feeds_into": "produces",
    # -> part_of
    "HAS_PHASE": "part_of",
    "HAS_FORM": "part_of",
    "incorporates": "part_of",
    "structured_by": "part_of",
    # -> extends
    "extends": "extends",
    "precedes": "extends",
    "sprouted_into": "extends",
    # -> supports
    "sustains": "supports",
    "contributes_to": "supports",
    "serves_as": "supports",
    # -> constrains
    "constrains": "constrains",
    "COSTS": "constrains",
    "RISK": "constrains",
    # -> applies
    "applies_to": "applies",
    "maps_to": "applies",
    "measures_via": "applies",
    # -> explores
    "diagnoses": "explores",
    "identifies": "explores",
    "identifies_friction_in": "explores",
    # -> critiques
    "potentially_critiques": "critiques",
    "opposes": "critiques",
    "challenges": "critiques",
    "complicates": "critiques",
    # -> creates
    "created": "creates",
    "created_by": "creates",
    "CREATED": "creates",
    # -> categorizes
    "groups": "categorizes",
    "instance_of": "categorizes",
    "INSTANCE": "categorizes",
    "METAPHOR": "categorizes",
    # Normalize case
    "ADVOCATES": "supports",
    "EXHIBITS": "expresses",
}

# === BRIDGE EDGES FOR HIGH-VALUE LEAF NODES ===
# Connect important 1-edge nodes to natural neighbors
EXTRA_EDGES = [
    # Draft evolution chain
    ("draft_experimentation_budget_v0", "draft_experimentation_budget_v1", "precedes"),
    ("draft_experimentation_budget_v1", "draft_meb_v2", "precedes"),
    ("draft_meb_v2", "draft_meb_v3", "precedes"),
    ("draft_meb_v3", "draft_meb_v4", "precedes"),

    # BFF draft -> phases
    ("draft_bff", "concept:build-phase", "describes"),
    ("draft_bff", "concept:friction-phase", "describes"),
    ("draft_bff", "concept:fix-phase", "describes"),

    # Citations -> concepts they inform
    ("citation:range", "concept:experimentation-budget", "informs"),
    ("citation:think-again", "concept:experimentation-budget", "informs"),
    ("citation:thinking-in-bets", "concept:portfolio-thinking", "informs"),
    ("citation:freire-praxis", "concept:agapic-energy", "informs"),
    ("citation:stevenson-proximity", "concept:agapic-energy", "informs"),
    ("citation:yeats-widening-gyre", "concept:widening-gyre", "informs"),

    # People -> what they inspire
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
    ("entity:chip-cooper", "concept:alabama-identity", "connected_to"),
    ("entity:diane-nash", "concept:agapic-energy", "inspires"),
    ("entity:uncle-val-mcgee", "concept:memory-as-inheritance", "connected_to"),
    ("entity:harper-lee", "concept:alabama-identity", "connected_to"),

    # Concepts -> parent concepts
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

    # Kernels -> parent concepts
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

    # Ideas -> concepts
    ("idea:pain-cycle", "concept:bff", "related_to"),
    ("idea:durable-learning", "concept:own-your-understanding", "supports"),
    ("idea:sports-analytics-systems", "concept:systems-thinking", "applies"),
    ("idea:push-pull-communication", "idea:engineering-excellence", "related_to"),
    ("idea:lowerchaos-linkedin-draft", "concept:lowerchaos", "expresses"),
    ("idea:influences-catalog", "idea:hobbies-evolution", "related_to"),

    # Tools
    ("tool:claude-code", "concept:co-intelligence", "implements"),
    ("tool:pup", "concept:cosmic-farmland", "supports"),
    ("tool:ddsearch", "concept:cosmic-farmland", "supports"),
    ("tool:feedback-review-app", "concept:structured-feedback", "implements"),

    # Site pages
    ("page:kernels", "concept:cosmic-farmland", "part_of"),

    # Remaining leaf connections
    ("entity:lazar-jovanovic", "citation:lazar-lennys-newsletter", "authored"),
    ("entity:zach-lamb", "concept:bff", "inspires"),
    ("entity:china-cat-sunflower", "entity:grateful-dead", "part_of"),
    ("concept:ai-adoption-levels", "concept:co-intelligence", "describes"),
    ("concept:old-brain-young-brain", "concept:mental-experimentation-budget", "informs"),
    ("concept:outcome_shock", "concept:mental-experimentation-budget", "part_of"),
    ("app:justpreach", "concept:bff", "applies"),
    ("concept:agapic-energy", "concept:alabama-identity", "related_to"),

    # Rationales
    ("rationale:style-vs-accessibility", "concept:lowerchaos", "informs"),
    ("rationale:failure-as-information", "concept:experimentation-budget", "informs"),
    ("rationale:econ-english-combination", "concept:systems-thinking", "informs"),
    ("rationale:self-knowledge-cluster", "concept:adult-adhd-diagnosis", "describes"),

    # Site infra
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
]


def apply_merges(graph, merge_map):
    """Merge duplicate nodes."""
    redirect = {}
    for survivor, dupes in merge_map.items():
        for dupe in dupes:
            redirect[dupe] = survivor

    node_index = {n["id"]: n for n in graph["nodes"]}
    removed = set()

    for old_id, new_id in redirect.items():
        if old_id in node_index and new_id in node_index:
            # Merge non-label properties
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

    # Redirect edges
    seen = set()
    deduped = []
    for e in graph["links"]:
        e["source"] = redirect.get(e["source"], e["source"])
        e["target"] = redirect.get(e["target"], e["target"])
        if "_src" in e:
            e["_src"] = redirect.get(e["_src"], e["_src"])
        if "_tgt" in e:
            e["_tgt"] = redirect.get(e["_tgt"], e["_tgt"])
        if e["source"] == e["target"]:
            continue
        key = tuple(sorted([e["source"], e["target"]]))
        if key not in seen:
            seen.add(key)
            deduped.append(e)
    graph["links"] = deduped

    # Redirect hyperedges
    for h in graph.get("hyperedges", []):
        if "nodes" in h:
            h["nodes"] = list(dict.fromkeys(redirect.get(n, n) for n in h["nodes"]))

    return len(redirect)


def normalize_relations(graph, relation_map):
    """Normalize edge relation types."""
    changed = 0
    for e in graph["links"]:
        rel = e.get("relation", "")
        if rel in relation_map:
            e["relation"] = relation_map[rel]
            changed += 1
    return changed


def add_edges(graph, extra_edges):
    """Add new edges, skipping dupes and missing nodes."""
    node_ids = {n["id"] for n in graph["nodes"]}
    existing = {(e["source"], e["target"]) for e in graph["links"]}
    existing.update({(e["target"], e["source"]) for e in graph["links"]})

    added = 0
    skipped = 0
    for src, tgt, relation in extra_edges:
        if src not in node_ids or tgt not in node_ids:
            skipped += 1
            continue
        if (src, tgt) in existing:
            continue
        graph["links"].append({
            "source": src,
            "target": tgt,
            "relation": relation,
            "confidence": "INFERRED",
            "confidence_score": 0.75,
            "weight": 0.75,
            "source_file": "graph_fix",
            "_src": src,
            "_tgt": tgt,
        })
        existing.add((src, tgt))
        existing.add((tgt, src))
        added += 1

    return added, skipped


def main():
    with open(GRAPH_PATH) as f:
        graph = json.load(f)

    print(f"Before: {len(graph['nodes'])} nodes, {len(graph['links'])} edges")

    # Count leaf nodes before
    adj_before = Counter()
    for e in graph["links"]:
        adj_before[e["source"]] += 1
        adj_before[e["target"]] += 1
    leaves_before = sum(1 for n in graph["nodes"] if adj_before.get(n["id"], 0) <= 1)

    print(f"\n1. Merging remaining dupes...")
    merged = apply_merges(graph, MERGE_MAP)
    print(f"   Merged {merged} nodes")

    print(f"\n2. Normalizing relations...")
    changed = normalize_relations(graph, RELATION_MAP)
    rel_count = len(set(e.get("relation") for e in graph["links"]))
    print(f"   Remapped {changed} edges, {rel_count} unique relations remaining")

    print(f"\n3. Adding edges for leaf nodes...")
    added, skipped = add_edges(graph, EXTRA_EDGES)
    print(f"   Added {added} edges, skipped {skipped} (missing nodes)")

    # Count leaf nodes after
    adj_after = Counter()
    for e in graph["links"]:
        adj_after[e["source"]] += 1
        adj_after[e["target"]] += 1
    leaves_after = sum(1 for n in graph["nodes"] if adj_after.get(n["id"], 0) <= 1)

    print(f"\nAfter: {len(graph['nodes'])} nodes, {len(graph['links'])} edges")
    print(f"Leaf nodes (<=1 edge): {leaves_before} -> {leaves_after}")

    with open(GRAPH_PATH, "w") as f:
        json.dump(graph, f, indent=2, ensure_ascii=False)
    print(f"Wrote to {GRAPH_PATH}")


if __name__ == "__main__":
    main()
