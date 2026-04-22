---
name: lowercase-content
enabled: true
event: file
tool_matcher: Edit|Write|MultiEdit
conditions:
  - field: file_path
    operator: regex_match
    pattern: _posts/.*\.md$|_drafts/.*\.md$|_pages/.*\.md$|_includes/.*\.html$
  - field: file_path
    operator: not_contains
    pattern: unpromptable-linkedin-flip
  - field: content
    operator: regex_match
    pattern: ^#{1,6}\s+.*(?-i:[A-Z][a-z])|^title:\s+"?.*(?-i:[A-Z][a-z])
action: block
---

**Normal capitalization detected in headings or title. marshall's site is lowercase-intentional.**

Check what you just wrote for:
- **Frontmatter `title:`** must be all lowercase (except proper nouns like names, places, acronyms)
- **Markdown headings** (`#`, `##`, etc.) must be all lowercase (same proper noun exception)
- **Navigation text** or UI labels in includes must be lowercase

**ALL CAPS is fine.** "YOU ARE GETTING ENGAGEMENT" is voice/energy, not polish. The rule is about normal Title Case or Sentence case creeping into headings and titles.

Proper nouns are also fine: "GitHub", "Jekyll", "BFF", "ADHD", "LinkedIn", "Hunter S. Thompson", "Fear and Loathing".

Generic words like "Previous", "Comments", "About Me", "The Drowning" should be "previous", "comments", "about me", "the drowning".

Fix the content to be lowercase, then retry.
