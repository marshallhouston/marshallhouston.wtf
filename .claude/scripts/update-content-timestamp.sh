#!/bin/bash
# PostToolUse hook: updates updated_at in frontmatter for content pipeline files
# Triggered after Edit, Write, or MultiEdit on _ideas/, _drafts/, _posts/ markdown files
# Receives JSON on stdin from Claude Code hooks system

# Read stdin JSON
INPUT=$(cat)

# Extract file_path from the tool input JSON (handles both Edit and Write payloads)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null)

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# Only act on markdown files in the content pipeline
if [[ ! "$FILE_PATH" =~ (_ideas|_drafts|_posts)/.*\.md$ ]]; then
  exit 0
fi

# Only act if the file exists
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Check if file has frontmatter (starts with ---)
if ! head -1 "$FILE_PATH" | grep -q "^---$"; then
  exit 0
fi

TIMESTAMP=$(date +"%Y-%m-%d %H:%M %Z")

# Check if updated_at already exists in frontmatter
if grep -q "^updated_at:" "$FILE_PATH"; then
  # Replace existing updated_at
  sed -i '' "s/^updated_at:.*$/updated_at: $TIMESTAMP/" "$FILE_PATH"
else
  # Add updated_at before the closing --- of frontmatter
  CLOSING_LINE=$(awk '/^---$/{n++; if(n==2){print NR; exit}}' "$FILE_PATH")
  if [[ -n "$CLOSING_LINE" ]]; then
    sed -i '' "${CLOSING_LINE}i\\
updated_at: ${TIMESTAMP}
" "$FILE_PATH"
  fi
fi
