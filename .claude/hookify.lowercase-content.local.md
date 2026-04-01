---
name: lowercase-content
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: _posts/.*\.md$|_drafts/.*\.md$|_pages/.*\.md$|_includes/.*\.html$
action: block
---

**Uppercase detected in content. Marshall's site is lowercase-intentional.**

Check what you just wrote for:
- **Frontmatter `title:`** must be all lowercase (except proper nouns like names, places, acronyms)
- **Markdown headings** (`#`, `##`, etc.) must be all lowercase (same proper noun exception)
- **Navigation text** or UI labels in includes must be lowercase

Proper nouns are fine: "Marshall", "GitHub", "Jekyll", "BFF", "ADHD". But generic words like "Previous", "Comments", "About Me" should be "previous", "comments", "about me".

Fix the content to be lowercase, then retry.
