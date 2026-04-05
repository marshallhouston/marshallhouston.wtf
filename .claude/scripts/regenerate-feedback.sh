#!/bin/bash
# PostToolUse hook: regenerates feedback.html when a draft file is edited
# Only runs if feedback.html already exists (i.e., a feedback session is active)

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null)

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# Only act on markdown files in _drafts/
if [[ ! "$FILE_PATH" =~ _drafts/.*\.md$ ]]; then
  exit 0
fi

# Only regenerate if feedback.html already exists
if [[ ! -f "feedback.html" ]]; then
  exit 0
fi

# Regenerate feedback.html for the edited draft
bundle exec ruby _scripts/generate-feedback-html "$FILE_PATH" 2>/dev/null
