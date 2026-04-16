#!/usr/bin/env python3
"""Deduplicate graphify knowledge graph nodes.

Merges nodes that represent the same concept but got different IDs
across extraction chunks. Repoints all edges and hyperedge references
to the surviving node ID.
"""

import json
import re
from collections import defaultdict
from pathlib import Path

GRAPH_PATH = Path("graphify-out/graph.json")

# === MERGE MAP ===
# Each key is the surviving node ID. Values are node IDs to merge into it.
# Built from the duplication analysis.

MERGE_MAP = {
    # --- BFF ---
    "concept:bff": [
        "concept:bff-framework",       # exact label dupe
        "concept_build_friction_fix",   # underscore-style dupe from chunk 1
    ],
    # kernel:bff and draft_bff are distinct (kernel = one-liner, draft = full draft)

    # --- Mental Experimentation Budget ---
    "concept:mental-experimentation-budget": [
        "concept_mental_experimentation_budget",       # underscore-style dupe
        "concept:mental-experimentation-budgets",      # plural variant
    ],
    # keep post:mental-experimentation-budgets (published post), kernel:experimentation-budgets (kernel),
    # concept:experimentation-budget (broader concept), draft_* (draft versions) as distinct

    # --- Kahneman ---
    "citation:kahneman-thinking-fast-slow": [
        "cite_kahneman_thinking_fast_slow",   # underscore-style dupe
        "citation:thinking-fast-and-slow",    # alternate label
    ],

    # --- Meadows ---
    "citation:meadows-thinking-in-systems": [
        "cite_meadows_thinking_systems",      # underscore-style dupe
        "citation:thinking-in-systems",       # alternate label
    ],

    # --- Mollick / Co-Intelligence ---
    "citation:mollick-co-intelligence": [
        "cite_mollick_co_intelligence",       # underscore-style dupe
        "citation:co-intelligence-book",      # alternate label
    ],

    # --- People (entity: vs person: dupes) ---
    "person:steve-yegge": [
        "entity:steve-yegge",
        "entity:yegge",
    ],
    "person:charity-majors": [
        "entity:charity-majors",
    ],
    "person:lara-hogan": [
        "entity:lara-hogan",
    ],
    "person:mitchell-hashimoto": [
        "entity:mitchell-hashimoto",
    ],
    "person:simon-willison": [
        "entity:simon-willison",
    ],
    "entity:hunter-s-thompson": [
        "person_hunter_thompson",             # underscore-style dupe
    ],

    # --- Concept dupes ---
    "concept:own-your-understanding": [
        "kernel:own-your-understanding",      # same idea, concept is richer node
    ],
    "idea:quit-conditions": [
        "kernel:quit-conditions",             # same idea
    ],
    "concept:vibe-thinking": [
        "kernel:vibe-thinking",               # same concept
    ],
    "concept:authenticity": [
        "concept:authenticity-as-resistance", # same core idea
        "kernel:authenticity",                # same concept
    ],
    "concept:therapy": [
        "kernel:therapy",                     # same concept
    ],
    "concept:site-branding": [
        "concept:branding",                   # same label
    ],
    "concept:adult-adhd-diagnosis": [
        "idea:adult-adhd-diagnosis",          # same concept
    ],

    # --- Wispr Flow ---
    "concept:wispr-flow": [
        "tool_wispr_flow",                    # underscore-style dupe
        "entity:wispr-flow",                  # entity dupe
        "tool:wispr-flow",                    # tool dupe
    ],

    # --- FITFO ---
    "concept:fitfo": [
        "kernel:fitfo",                       # same concept
    ],

    # --- Prior/Golf ---
    "citation:golf-beneath-the-surface": [
        "cite_prior_golf_beneath_surface",    # underscore-style dupe
    ],

    # --- Lowerchaos ---
    "concept:lowerchaos": [
        "rationale_wtf_domain",               # closely related, merge into concept
    ],

    # --- Action concepts ---
    "concept:action-brings-clarity": [
        "concept:action-over-paralysis",      # same underlying idea
    ],

    # --- Cosmic Farmland ---
    "concept:cosmic-farmland": [
        "concept_cosmic_farmland",            # underscore-style dupe
        "kernel:cosmic-farmland",             # same concept
    ],

    # --- AI is a how ---
    "idea:ai-is-a-how": [
        "kernel:ai-is-a-how",                # same concept
    ],

    # --- Engineering excellence ---
    "idea:engineering-excellence": [
        "kernel:engineering-excellence",      # same concept
    ],

    # --- AI engineering grief ---
    "idea:ai-engineering-grief": [
        "kernel:ai-engineering-grief",        # same concept
    ],

    # --- Push/pull communication ---
    "idea:push-pull-communication": [
        "kernel:push-pull-communication",     # same concept
    ],
}

# Remove empty merge lists
MERGE_MAP = {k: v for k, v in MERGE_MAP.items() if v}


def build_redirect(merge_map):
    """Build a flat redirect dict: old_id -> surviving_id."""
    redirect = {}
    for survivor, dupes in merge_map.items():
        for dupe in dupes:
            if dupe in redirect:
                print(f"  WARNING: {dupe} already redirects to {redirect[dupe]}, now also to {survivor}")
            redirect[dupe] = survivor
    return redirect


def apply_redirect(node_id, redirect):
    return redirect.get(node_id, node_id)


def merge_node_properties(survivor_node, dupe_node):
    """Merge properties from dupe into survivor, preferring survivor's values."""
    for key, val in dupe_node.items():
        if key in ("id", "label"):
            continue  # survivor's ID and label are always canonical
        if key not in survivor_node or survivor_node[key] is None:
            survivor_node[key] = val


def dedup_graph(graph, redirect):
    """Apply deduplication to graph in-place."""
    # Index nodes by ID
    node_index = {n["id"]: n for n in graph["nodes"]}
    removed_ids = set()

    # Merge node properties before removing dupes
    for old_id, new_id in redirect.items():
        if old_id in node_index and new_id in node_index:
            merge_node_properties(node_index[new_id], node_index[old_id])
            removed_ids.add(old_id)
        elif old_id in node_index:
            # Survivor doesn't exist yet — rename the dupe
            node_index[old_id]["id"] = new_id
            node_index[new_id] = node_index.pop(old_id)
        # else: dupe doesn't exist, skip

    # Remove merged nodes
    graph["nodes"] = [n for n in graph["nodes"] if n["id"] not in removed_ids]

    # Redirect edges
    seen_edges = set()
    deduped_edges = []
    for edge in graph["links"]:
        edge["source"] = apply_redirect(edge["source"], redirect)
        edge["target"] = apply_redirect(edge["target"], redirect)
        if "_src" in edge:
            edge["_src"] = apply_redirect(edge["_src"], redirect)
        if "_tgt" in edge:
            edge["_tgt"] = apply_redirect(edge["_tgt"], redirect)

        # Skip self-loops created by merge
        if edge["source"] == edge["target"]:
            continue

        # Deduplicate parallel edges (keep first)
        edge_key = tuple(sorted([edge["source"], edge["target"]]))
        if edge_key not in seen_edges:
            seen_edges.add(edge_key)
            deduped_edges.append(edge)

    graph["links"] = deduped_edges

    # Redirect hyperedge references
    for hyper in graph.get("graph", {}).get("hyperedges", []):
        if "nodes" in hyper:
            hyper["nodes"] = list(dict.fromkeys(
                apply_redirect(n, redirect) for n in hyper["nodes"]
            ))
        if "members" in hyper:
            hyper["members"] = list(dict.fromkeys(
                apply_redirect(n, redirect) for n in hyper["members"]
            ))

    return graph


def count_components(graph):
    adj = defaultdict(set)
    all_ids = {n["id"] for n in graph["nodes"]}
    for e in graph["links"]:
        adj[e["source"]].add(e["target"])
        adj[e["target"]].add(e["source"])

    visited = set()
    components = []
    for nid in all_ids:
        if nid not in visited:
            stack = [nid]
            comp = set()
            while stack:
                cur = stack.pop()
                if cur in visited:
                    continue
                visited.add(cur)
                comp.add(cur)
                for nb in adj.get(cur, []):
                    if nb not in visited:
                        stack.append(nb)
            components.append(comp)
    return sorted(components, key=len, reverse=True)


def get_component_of(node_id, graph):
    """Find which component a node belongs to."""
    adj = defaultdict(set)
    for e in graph["links"]:
        adj[e["source"]].add(e["target"])
        adj[e["target"]].add(e["source"])
    visited = set()
    stack = [node_id]
    while stack:
        cur = stack.pop()
        if cur in visited:
            continue
        visited.add(cur)
        for nb in adj.get(cur, []):
            if nb not in visited:
                stack.append(nb)
    return visited


# Bridge edges connect island clusters to the main component through
# shared conceptual relationships that extraction missed because they
# were in different chunks.
BRIDGE_EDGES = [
    # Decision frameworks cluster -> main via experimentation-budget concept
    ("kernel:experimentation-budgets", "concept:experimentation-budget", "variant_of", "experimentation budgets kernel relates to the broader concept"),
    ("kernel:behavioral-economics", "concept:mental-experimentation-budget", "informs", "behavioral economics informs MEB model"),
    ("concept:portfolio-thinking", "concept:mental-experimentation-budget", "informs", "portfolio thinking frames experimentation budgets"),

    # Renewal/nature cluster -> main via BFF and action philosophy
    ("kernel:throw-it-all-away", "concept:bff", "expresses", "throw it all away expresses BFF's willingness to restart"),
    ("kernel:cambrian-explosion", "concept:experimentation-budget", "expresses", "cambrian explosion is about expanding experimentation budget"),

    # Branding cluster -> main via cosmic-farmland and site concepts
    ("concept:mh-branding", "concept:cosmic-farmland", "defines", "mh branding is part of cosmic farmland identity"),
    ("person:marshall-houston", "concept:cosmic-farmland", "created", "marshall created cosmic farmland"),

    # Community/comments cluster -> main via site
    ("idea_giscus_comments", "concept:cosmic-farmland", "enhances", "giscus comments enhance the site"),

    # Creative cognition cluster -> main via authenticity
    ("concept:combinatorial-creativity", "concept:authenticity", "supports", "combinatorial creativity supports authentic expression"),
    ("kernel:divergent-thinking", "concept:authenticity", "supports", "divergent thinking supports authentic voice"),

    # Therapy/self-knowledge cluster -> main
    ("kernel:knowing-yourself", "concept:adult-adhd-diagnosis", "expresses", "knowing yourself includes ADHD diagnosis journey"),

    # AI grief/how cluster -> main via co-intelligence
    ("idea:ai-engineering-grief", "concept:co-intelligence", "tensions_with", "grief about AI change vs embracing co-intelligence"),
    ("idea:ai-is-a-how", "concept:co-intelligence", "expresses", "AI as a how aligns with co-intelligence framing"),

    # Engineering excellence cluster -> main
    ("idea:engineering-excellence", "concept:bff", "expresses", "engineering excellence expresses BFF philosophy"),

    # Push-pull -> main
    ("idea:push-pull-communication", "idea:engineering-excellence", "informs", "push-pull communication is part of engineering excellence"),

    # Cosmic farmland singleton -> main
    ("concept:cosmic-farmland", "concept:lowerchaos", "expresses", "cosmic farmland expresses lowerchaos brand"),

    # Tools cluster -> main
    ("tool:feedback-review-app", "concept:co-intelligence", "implements", "feedback app implements co-intelligence workflow"),
    ("tool:tools-repo", "concept:cosmic-farmland", "supports", "tools repo supports the site"),

    # Grateful Dead -> main (cultural reference in authenticity)
    ("entity:grateful-dead", "concept:authenticity", "inspires", "grateful dead inspires authentic expression"),

    # Talking heads -> main
    ("entity:talking-heads", "concept:authenticity", "inspires", "talking heads inspire authentic expression"),

    # Site avatar cluster -> main via branding
    ("concept::site-avatar", "concept:cosmic-farmland", "defines", "site avatar is part of cosmic farmland identity"),

    # Hobbies/influences -> main via self-knowledge
    ("idea:hobbies-evolution", "concept:adult-adhd-diagnosis", "expresses", "hobbies evolution is part of self-knowledge"),

    # Singletons -> main
    ("draft_bff", "concept:bff", "drafts", "BFF draft implements BFF concept"),
    ("concept:freedom-rides", "concept:cosmic-farmland", "inspires", "freedom rides inform identity"),
    ("idea:enneagram-7w8", "concept:adult-adhd-diagnosis", "complements", "enneagram and ADHD both map personal operating system"),
    ("concept:waterline-principle", "concept:bff", "complements", "waterline principle informs when to apply BFF"),
    ("idea:pain-cycle", "concept:bff", "complements", "PAIN cycle is related to BFF framework"),
    ("rationale:visceral-first-draft-reaction", "concept:co-intelligence", "informs", "visceral reaction to drafts is part of writing process"),
    ("rationale:systems-thinking-thread", "concept:mental-experimentation-budget", "frames", "systems thinking threads through MEB"),
    ("rationale:self-knowledge-cluster", "concept:adult-adhd-diagnosis", "groups", "self-knowledge cluster includes ADHD journey"),
    ("kernel:people-who-know-me", "concept:adult-adhd-diagnosis", "expresses", "self-knowledge kernel"),
    ("entity:kent-beck", "idea:engineering-excellence", "inspires", "Kent Beck inspires engineering excellence"),
    ("entity:rands", "idea:engineering-excellence", "inspires", "Rands inspires engineering leadership thinking"),
    ("entity:bryce-young", "concept:mental-experimentation-budget", "illustrates", "Bryce Young illustrates MEB concepts"),
    ("citation:yeats-widening-gyre", "concept:authenticity", "inspires", "Yeats inspires authentic expression"),
    ("citation:lazar-lennys-newsletter", "idea:engineering-excellence", "informs", "Lazar on engineering culture"),

    # Site infrastructure singletons -> cosmic-farmland
    ("idea_footer_rework", "concept:cosmic-farmland", "enhances", "footer rework is site improvement"),
    ("readme_cosmic_farmland_site", "concept:cosmic-farmland", "documents", "README documents the site"),
    ("llms_marshallhouston_site", "concept:cosmic-farmland", "documents", "llms.txt documents the site"),
    ("page:tags", "concept:cosmic-farmland", "part_of", "tags page is part of the site"),
    ("page:books", "concept:cosmic-farmland", "part_of", "books page is part of the site"),
    ("page:moments", "concept:cosmic-farmland", "part_of", "moments page is part of the site"),

    # Code/test singletons -> capitalize-toggle cluster
    ("tests_capitalize_toggle_spec_js", "assets_js_capitalize_toggle_js", "tests", "spec tests the toggle"),
    ("tests_site_properties_spec_js", "concept:cosmic-farmland", "tests", "site properties spec tests the site"),
    ("playwright_config_js", "tests_capitalize_toggle_spec_js", "configures", "playwright config for tests"),

    # Capitalize-toggle code cluster -> main via lowerchaos concept
    ("assets_js_capitalize_toggle_js", "concept:lowerchaos", "implements", "capitalize toggle implements the lowerchaos aesthetic"),
]


def add_bridge_edges(graph, bridges):
    """Add bridge edges between disconnected clusters."""
    node_ids = {n["id"] for n in graph["nodes"]}
    added = 0
    existing = {(e["source"], e["target"]) for e in graph["links"]}
    existing.update({(e["target"], e["source"]) for e in graph["links"]})

    for src, tgt, relation, description in bridges:
        if src not in node_ids:
            print(f"  SKIP bridge: {src} not in graph")
            continue
        if tgt not in node_ids:
            print(f"  SKIP bridge: {tgt} not in graph")
            continue
        if (src, tgt) in existing:
            continue

        graph["links"].append({
            "source": src,
            "target": tgt,
            "relation": relation,
            "confidence": "INFERRED",
            "confidence_score": 0.8,
            "weight": 0.8,
            "source_file": "dedup_bridge",
            "_src": src,
            "_tgt": tgt,
        })
        existing.add((src, tgt))
        existing.add((tgt, src))
        added += 1

    return added


def main():
    with open(GRAPH_PATH) as f:
        graph = json.load(f)

    print(f"Before: {len(graph['nodes'])} nodes, {len(graph['links'])} edges")
    components_before = count_components(graph)
    print(f"Before: {len(components_before)} connected components")
    print(f"  Largest: {len(components_before[0])} nodes ({len(components_before[0])*100//len(graph['nodes'])}%)")

    redirect = build_redirect(MERGE_MAP)
    print(f"\nMerging {len(redirect)} duplicate nodes into {len(MERGE_MAP)} survivors...")

    graph = dedup_graph(graph, redirect)

    print(f"\nAdding bridge edges...")
    added = add_bridge_edges(graph, BRIDGE_EDGES)
    print(f"  Added {added} bridge edges")

    print(f"\nAfter: {len(graph['nodes'])} nodes, {len(graph['links'])} edges")
    components_after = count_components(graph)
    print(f"After: {len(components_after)} connected components")
    print(f"  Largest: {len(components_after[0])} nodes ({len(components_after[0])*100//len(graph['nodes'])}%)")

    # Show component sizes
    print("\nComponent sizes:")
    for i, c in enumerate(components_after):
        if len(c) >= 2:
            print(f"  {i}: {len(c)} nodes")
        else:
            break
    singleton_count = sum(1 for c in components_after if len(c) == 1)
    print(f"  + {singleton_count} singletons")

    with open(GRAPH_PATH, "w") as f:
        json.dump(graph, f, indent=2, ensure_ascii=False)
    print(f"\nWrote deduped graph to {GRAPH_PATH}")


if __name__ == "__main__":
    main()
