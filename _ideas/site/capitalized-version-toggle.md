# capitalized version toggle

offer a toggle or alternate view that renders the site with standard capitalization instead of all lowercase. accessibility/readability option for readers who find lowercase harder to parse.

likely won't implement — just an interesting idea that came up.

---

## direction (2026-04-04)

**decided to build it.** the concern: people spend more mental energy on "why is this all lowercase" instead of engaging with the actual content. give readers the choice.

### approach: runtime JS with config-driven proper nouns (approach 1)

- every page starts lowercase (as-is)
- toggle in header nav area transforms text to standard capitalization
- JS walks text nodes and applies: sentence-case (capitalize after . ? ! and paragraph starts), `i` → `I`, title case for headings
- proper nouns list in `_config.yml` handles names, tools, acronyms that heuristics can't detect
- `localStorage` remembers the reader's preference across pages
- skip direct quotes in blockquotes (they already preserve original capitalization)
- skip code blocks

### proper nouns maintenance

folded into the "make it a post" flow: when publishing, scan the post for lowercase words that need capitalization rules, surface them for q&a, update `_config.yml`.

### why not build-time dual content (approach 2/3)

adds real complexity (doubles HTML or needs a build pipeline for JSON maps) for marginal accuracy gain. the config-driven proper nouns list closes most of the gap. not worth it unless heuristic errors become a real problem.

### open questions
- floating button as alternative/addition to header nav placement if people get annoyed
- perfection isn't a hard requirement but close is interesting
