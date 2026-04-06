#!/bin/bash
# Pre-commit check: flags potential proper nouns in new posts that aren't in _config.yml
# Only runs when _posts/*.md files are staged. Warns but does not block.

STAGED_POSTS=$(git diff --cached --name-only --diff-filter=ACM | grep "^_posts/.*\.md$")

if [ -z "$STAGED_POSTS" ]; then
  exit 0
fi

# Extract known proper nouns from _config.yml via ruby (pyyaml not always available)
KNOWN_NOUNS=$(ruby -ryaml -e "
  nouns = YAML.load_file('_config.yml').dig('capitalize', 'proper_nouns') || []
  nouns.each { |n| puts n['name'].downcase }
" 2>/dev/null)

if [ -z "$KNOWN_NOUNS" ]; then
  exit 0
fi

WARNINGS=""

for POST in $STAGED_POSTS; do
  CANDIDATES=$(python3 << PYEOF
import re

with open("$POST") as f:
    content = f.read()

# strip frontmatter
content = re.sub(r'^---.*?---\s*', '', content, count=1, flags=re.DOTALL)

# strip fenced code blocks
content = re.sub(r'\x60\x60\x60.*?\x60\x60\x60', '', content, flags=re.DOTALL)

# strip inline code
content = re.sub(r'\x60[^\x60]+\x60', '', content)

# strip blockquotes (lines starting with >)
lines = [l for l in content.split('\n') if not l.strip().startswith('>')]
content = '\n'.join(lines)

# Names after attribution dashes
attributions = re.findall(r'\u2014\s*\[?([A-Z][a-z]+(?: [A-Z][a-z]+)*)', content)

# Multi-word capitalized phrases (First Last)
names = re.findall(r'\b([A-Z][a-z]+(?: [A-Z][a-z]+)+)\b', content)

# Uppercase acronyms (3+ chars to reduce noise from emphasis words)
acronyms = re.findall(r'\b([A-Z]{3,})\b', content)

# common english words that appear as emphasis, not proper nouns
skip_words = {
    'ALL', 'AND', 'ARE', 'BACK', 'BAD', 'BIG', 'BUT', 'CAN', 'CLEAR',
    'DID', 'END', 'EOF', 'EST', 'CST', 'FOR', 'GET', 'GOT', 'HAS',
    'HER', 'HIS', 'HOW', 'ITS', 'JUST', 'KEEP', 'KERNEL', 'LET',
    'MAY', 'MDT', 'MST', 'NEW', 'NOT', 'NOW', 'OFF', 'OLD', 'ONE',
    'OUR', 'OUT', 'PST', 'PUT', 'RUN', 'SAY', 'SEE', 'SET', 'SHE',
    'THE', 'TODO', 'TOO', 'TRY', 'USE', 'UTC', 'WAY', 'WHO', 'WHY',
    'YES', 'YET', 'YOU', 'VERY', 'STOP', 'DONE', 'GOOD', 'HARD',
    'HERE', 'IDEA', 'INTO', 'KNOW', 'LAST', 'LEFT', 'LIKE', 'LONG',
    'LOOK', 'MAKE', 'MORE', 'MOST', 'MUCH', 'MUST', 'NEXT', 'ONLY',
    'OVER', 'PART', 'PICK', 'PULL', 'PUSH', 'READ', 'REAL', 'REST',
    'SAME', 'SHOW', 'SIDE', 'SOME', 'SUCH', 'SURE', 'TAKE', 'TELL',
    'THAN', 'THAT', 'THEM', 'THEN', 'THEY', 'THIS', 'TIME', 'TURN',
    'WANT', 'WELL', 'WENT', 'WERE', 'WHAT', 'WHEN', 'WILL', 'WITH',
    'WORK', 'YOUR',
}

candidates = set()
for name in attributions + names:
    candidates.add(name.strip())
for acr in acronyms:
    if acr not in skip_words:
        candidates.add(acr)

for c in sorted(candidates):
    print(c)
PYEOF
)

  if [ -z "$CANDIDATES" ]; then
    continue
  fi

  # Check each candidate against known nouns
  while IFS= read -r candidate; do
    LOWER=$(echo "$candidate" | tr '[:upper:]' '[:lower:]')
    if ! echo "$KNOWN_NOUNS" | grep -qx "$LOWER"; then
      WARNINGS="${WARNINGS}\n  ⚠ \"${candidate}\" in ${POST} — not in capitalize config"
    fi
  done <<< "$CANDIDATES"
done

if [ -n "$WARNINGS" ]; then
  echo ""
  echo "━━━ capitalize config check ━━━"
  echo -e "$WARNINGS"
  echo ""
  echo "  these names/terms may not capitalize correctly with the toggle."
  echo "  add them to capitalize.proper_nouns in _config.yml if needed."
  echo "  (this is a warning, not blocking the commit)"
  echo ""
fi

exit 0
