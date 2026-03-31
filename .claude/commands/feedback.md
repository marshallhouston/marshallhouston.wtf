---
description: Generate a section-by-section feedback page for any content file, then apply the feedback
argument-hint: <file-path>
---

Generate a feedback review page for `$ARGUMENTS` and apply feedback once provided.

## Steps

1. Run the generator:
   ```
   bundle exec ruby _scripts/generate-feedback-html "$ARGUMENTS"
   ```

2. Open the feedback page:
   ```
   open feedback.html
   ```

3. Tell the user:
   > feedback.html is open. fill in the sections, hit "copy all feedback as markdown", then paste it here.

4. Wait for the user to paste the feedback markdown.

5. Apply feedback to `$ARGUMENTS`:
   - Work through each `## section-name` block in the feedback
   - Find the corresponding section in the file
   - Apply the requested changes, preserving Marshall's voice (see CLAUDE.md)
   - Do not smooth out rawness, remove literary references, or add polish

6. After applying all section feedback, summarize what changed.
