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

## Git Workflow

This is a solo personal site. Commit directly to main — no branches or PRs needed.
