#!/usr/bin/env python3
"""Post-dedup graph cleanup: fix hyperedges, normalize confidence, infer file_type, label communities."""

import json
import re
from collections import defaultdict, Counter
from pathlib import Path

GRAPH_PATH = Path("graphify-out/graph.json")


def fix_hyperedges(graph, node_ids):
    """Remove dead references from hyperedges. Drop empty hyperedges."""
    hyperedges = graph.get("graph", {}).get("hyperedges", [])
    cleaned = []
    fixed = 0
    dropped = 0

    for h in hyperedges:
        for key in ("nodes", "members"):
            if key in h:
                before = len(h[key])
                h[key] = [n for n in h[key] if n in node_ids]
                if len(h[key]) < before:
                    fixed += 1

        # Keep hyperedge if it still has >= 2 members
        members = h.get("nodes", h.get("members", []))
        if len(members) >= 2:
            cleaned.append(h)
        else:
            dropped += 1

    graph["graph"]["hyperedges"] = cleaned
    print(f"  Hyperedges: fixed {fixed} dead refs, dropped {dropped} empty")


def normalize_confidence(graph):
    """Normalize edge confidence to consistent format: string type + float score."""
    for edge in graph["links"]:
        conf = edge.get("confidence")
        score = edge.get("confidence_score")

        # If confidence is a float, move it to score and set type
        if isinstance(conf, (int, float)):
            if score is None:
                edge["confidence_score"] = float(conf)
            edge["confidence"] = "EXTRACTED" if conf >= 0.9 else "INFERRED"
        elif conf == "unknown" or conf is None:
            edge["confidence"] = "INFERRED"
            if score is None:
                edge["confidence_score"] = 0.7

        # Ensure score exists
        if edge.get("confidence_score") is None:
            if edge["confidence"] == "EXTRACTED":
                edge["confidence_score"] = 1.0
            else:
                edge["confidence_score"] = 0.8


def infer_file_type(graph):
    """Fill missing file_type based on node ID prefix and source_file."""
    prefix_to_type = {
        "concept:": "concept",
        "concept::": "concept",
        "kernel:": "kernel",
        "idea:": "idea",
        "post:": "post",
        "draft_": "draft",
        "citation:": "citation",
        "cite_": "citation",
        "person:": "person",
        "entity:": "person",
        "tool:": "tool",
        "tool_": "tool",
        "rationale:": "rationale",
        "rationale_": "rationale",
        "value:": "metadata",
        "file:": "asset",
        "file::": "asset",
        "asset:": "asset",
        "page:": "page",
    }

    ext_to_type = {
        ".js": "code",
        ".py": "code",
        ".rb": "code",
        ".ts": "code",
        ".md": "document",
        ".html": "document",
        ".yml": "config",
        ".yaml": "config",
        ".json": "config",
        ".svg": "asset",
        ".png": "asset",
    }

    filled = 0
    for node in graph["nodes"]:
        if node.get("file_type") and node["file_type"] != "unknown":
            continue

        nid = node["id"]
        inferred = None

        # Try prefix
        for prefix, ftype in prefix_to_type.items():
            if nid.startswith(prefix):
                inferred = ftype
                break

        # Try source_file extension
        if not inferred and node.get("source_file"):
            ext = Path(node["source_file"]).suffix.lower()
            inferred = ext_to_type.get(ext)

        # Try label heuristics
        if not inferred:
            label = node.get("label", "").lower()
            if any(w in label for w in ["draft", "v0", "v1", "v2", "v3", "v4"]):
                inferred = "draft"
            elif label.endswith(".js") or label.endswith("()"):
                inferred = "code"

        if inferred:
            node["file_type"] = inferred
            filled += 1

    print(f"  file_type: filled {filled} nodes")


# Community labels based on inspecting the actual members
# These map community ID -> human-readable label
COMMUNITY_LABELS = {
    0: "BFF Framework & Personal Growth",
    1: "Mental Experimentation Budgets",
    2: "AI Tools & Metacognition",
    3: "Site Infrastructure & Testing",
    4: "Authenticity & Creative Identity",
    5: "Influences & Intellectual Sources",
    6: "Capitalization Toggle (Code)",
    7: "Co-Intelligence & Writing System",
    8: "Self-Knowledge & Operating System",
    9: "Site Migration & Domain",
    10: "Engineering Philosophy",
    11: "Action Philosophy & FITFO",
    12: "Creative Roots & Identity",
    13: "Systems Thinking Patterns",
    14: "Depth & Understanding",
    15: "Content Pipeline & Config",
}


def label_communities(graph):
    """Apply human-readable community labels to the report."""
    # Store labels in graph metadata for report generation
    if "graph" not in graph:
        graph["graph"] = {}
    graph["graph"]["community_labels"] = COMMUNITY_LABELS

    # Also update node norm_label if community field exists
    updated = 0
    for node in graph["nodes"]:
        cid = node.get("community")
        if cid is not None and cid in COMMUNITY_LABELS:
            node["community_label"] = COMMUNITY_LABELS[cid]
            updated += 1

    print(f"  Communities: labeled {len(COMMUNITY_LABELS)} communities, tagged {updated} nodes")


def prune_orphan_singletons(graph):
    """Remove truly disconnected nodes with no edges and no useful content."""
    node_ids_in_edges = set()
    for e in graph["links"]:
        node_ids_in_edges.add(e["source"])
        node_ids_in_edges.add(e["target"])

    # Also check hyperedge membership
    for h in graph.get("graph", {}).get("hyperedges", []):
        for key in ("nodes", "members"):
            if key in h:
                node_ids_in_edges.update(h[key])

    before = len(graph["nodes"])
    # Keep nodes that have edges OR are high-value types
    keep_types = {"post", "draft", "document", "code"}
    graph["nodes"] = [
        n for n in graph["nodes"]
        if n["id"] in node_ids_in_edges
        or n.get("file_type") in keep_types
    ]
    pruned = before - len(graph["nodes"])
    if pruned:
        print(f"  Pruned {pruned} orphan singletons")


def main():
    with open(GRAPH_PATH) as f:
        graph = json.load(f)

    node_ids = {n["id"] for n in graph["nodes"]}
    print(f"Graph: {len(graph['nodes'])} nodes, {len(graph['links'])} edges")
    print()

    print("Fixing hyperedges...")
    fix_hyperedges(graph, node_ids)

    print("Normalizing edge confidence...")
    normalize_confidence(graph)

    print("Inferring file_type...")
    infer_file_type(graph)

    print("Labeling communities...")
    label_communities(graph)

    print("Checking for orphans...")
    prune_orphan_singletons(graph)

    print(f"\nFinal: {len(graph['nodes'])} nodes, {len(graph['links'])} edges")

    with open(GRAPH_PATH, "w") as f:
        json.dump(graph, f, indent=2, ensure_ascii=False)
    print(f"Wrote cleaned graph to {GRAPH_PATH}")


if __name__ == "__main__":
    main()
