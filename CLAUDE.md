# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development

```bash
bundle install                              # install dependencies
bundle exec jekyll serve --livereload       # local dev server at localhost:4000
```

GitHub Pages builds automatically on push to main — no CI config needed. The site uses `future: true` so posts dated today won't be hidden by UTC timezone differences.

## Architecture

Jekyll site using the Minimal Mistakes remote theme (`mmistakes/minimal-mistakes`). No local layout or include overrides — all theming comes from the remote theme plus light CSS tweaks in `assets/css/main.scss`.

- `_posts/` — published articles
- `_drafts/` — work in progress (not published)
- `_ideas/site/` and `_ideas/writing/` — backlog of ideas, not rendered
- `_pages/` — standalone pages (about, influences)
- `_data/navigation.yml` — top nav structure

Permalink pattern: `/:categories/:title/` (no date in URLs, no categories currently used).

## Writing Conventions

- All content uses lowercase titles and an informal, conversational tone
- Posts use YAML frontmatter: `title`, `tags`, `classes: wide` (for full-width layout)
- Tags in use: `ai-augmented-engineering`, `workflow`, `getting-started`

## Voice & Style

This is Marshall's personal blog. The voice is intentionally different from his professional writing at Ibotta.

### The register
- **Exploratory, not conclusive.** Posts are kernels of ideas, not finished arguments. Connections don't need to be fully scaffolded to be shared. Ship the thinking, see what resonates, iterate later.
- **Stream-of-consciousness with structure.** Loose and personal, but with named frameworks and sticky phrases (BFF, cosmic farmland, fitfo). The rawness is the point — these aren't polished essays.
- **Lowercase-intentional.** Titles, tone, energy — all lowercase. Not casual-by-accident but informal-by-choice.
- **Wide-ranging connections.** Marshall is an English and economics double major. Far-flung literary, philosophical, and cross-domain references (Yeats, fractals, slow food movement) are a feature, not a reach. They don't need full argumentative setup — the resonance is enough.

### What it shares with his professional voice
- "Action brings clarity" — lead with doing, not theorizing
- Named frameworks that compress complex ideas into sticky phrases
- Warmth, directness, closing with momentum
- Honest about difficulty without dwelling — moves to what's next
- Generous credit when referencing others' ideas

### What's different from professional writing
- **Rawer.** Ideas can be half-formed. Friction is shown, not hidden. Brain dumps are part of the content, not editing artifacts.
- **Personal.** Topics span coffee, golf, parenting, music, tattoos, neurodivergence — the full person, not just the engineering leader.
- **Self-referential.** Posts can apply their own framework to the writing itself (BFF post uses BFF while describing BFF). Meta-application is a feature.
- **Tool-agnostic.** When discussing AI/engineering, the blog is about mindset and patterns, not specific products. Don't name-drop tools with authority — frame them as "whatever you're using."
- **Repetition for rhythm.** Where professional writing says it once and trusts it to land, blog Marshall repeats core ideas in different forms for emphasis and rhythm. This is intentional, not redundant. (But watch for tipping from emphasis into preaching — three variations is emphasis, five is a TED talk. Marshall is aware of this tendency and it's a conscious choice.)

### Anti-patterns
- Don't clean up the rawness. If a blockquote is a brain dump, leave it as a brain dump.
- Don't remove literary/cross-domain references because they seem tangential. They're core to the voice.
- Don't add polish that makes it sound corporate or committee-written.
- Don't pre-load emojis — Marshall places them intentionally.
- Don't hedge on things Marshall is direct about, and don't add false confidence to things he's genuinely exploring.

## Git Workflow

This is a solo personal site. Commit directly to main — no branches or PRs needed.
