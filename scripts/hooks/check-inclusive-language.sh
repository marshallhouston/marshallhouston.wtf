#!/bin/sh
# Block non-inclusive language in staged site content.
# Mechanical block-list (low false-positive). Judgment-call terms live in CLAUDE.md.
#
# Refs:
#   https://www.aswf.io/blog/inclusive-language/
#   https://developers.google.com/style/inclusive-documentation

PATHS_RE='^(_posts/|_drafts/|_includes/|_layouts/|_data/|index\.|README|.*\.md$)'
STAGED=$(git diff --cached --name-only --diff-filter=ACM | grep -E "$PATHS_RE")

[ -z "$STAGED" ] && exit 0

# Bad terms (case-insensitive). Each entry: regex|suggested replacement.
# Only mechanical, unambiguous terms here. Judgment cases (normal, crazy, kill, hang,
# master alone, legacy, guys) belong in CLAUDE.md, not this hook.
BAD_RE='whitelist|blacklist|manpower|mankind|man-hours?|manhours?|middleman|handi-capable|stonith|cripple[sd]?|crippling|dummy variable|master/slave|slave/master'

# Allow lines that also reference an accepted replacement (rule mentions like
# "use allowlist not whitelist", or "primary/replica (formerly master/slave)").
GOOD_RE='allowlist|blocklist|deny ?list|allow ?list|block ?list|primary/replica|replica/primary|labor[ -]hours?|workforce|humanity|mediator|liaison|fence failed|parent node|nondisabled|person without disabilit'

HITS=$(git diff --cached -U0 -- $STAGED \
  | grep -E '^\+[^+]' \
  | grep -i -E "$BAD_RE" \
  | grep -i -v -E "$GOOD_RE")

if [ -n "$HITS" ]; then
  echo "✗ inclusive-language: non-inclusive term in staged changes"
  echo ""
  echo "$HITS"
  echo ""
  echo "  suggested replacements:"
  echo "    whitelist        → allowlist"
  echo "    blacklist        → blocklist / denylist"
  echo "    master/slave     → primary/replica, leader/follower"
  echo "    manpower         → labor, workforce"
  echo "    man-hours        → person-hours, labor-hours"
  echo "    mankind          → humanity, humankind"
  echo "    middleman        → mediator, liaison"
  echo "    cripple(s/d)     → slow down, degrade, hinder"
  echo "    dummy variable   → placeholder"
  echo "    handi-capable    → (drop, use neutral language)"
  echo "    STONITH          → fence failed nodes"
  echo ""
  echo "  see CLAUDE.md → Voice & Style → Inclusive language"
  exit 1
fi

exit 0
