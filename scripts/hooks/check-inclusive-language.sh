#!/bin/sh
# Block "whitelist"/"blacklist" in staged content. Use "allowlist"/"blocklist".

PATHS_RE='^(_posts/|_drafts/|_includes/|_layouts/|_data/|index\.|README|.*\.md$)'
STAGED=$(git diff --cached --name-only --diff-filter=ACM | grep -E "$PATHS_RE")

[ -z "$STAGED" ] && exit 0

# Allow lines that also reference the preferred term (rule mentions, e.g. "use allowlist not whitelist").
HITS=$(git diff --cached -U0 -- $STAGED \
  | grep -E '^\+[^+]' \
  | grep -i -E 'whitelist|blacklist' \
  | grep -i -v -E 'allowlist|blocklist')

if [ -n "$HITS" ]; then
  echo "✗ inclusive-language: 'whitelist'/'blacklist' found in staged changes"
  echo "  use 'allowlist' / 'blocklist' instead"
  echo ""
  echo "$HITS"
  exit 1
fi

exit 0
