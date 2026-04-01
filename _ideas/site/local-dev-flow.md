---
title: local dev flow is great, make it easier to start
updated_at: 2026-04-01 06:07 MDT
---

the local development loop — run jekyll, see changes live, tweak in real time — is really effective. keep this as the primary authoring workflow.

## what works
- `bundle exec jekyll serve --livereload` gives instant feedback
- edit post, save, see it rendered immediately
- can check layout, images, links before pushing

## make it easier to get going
- add a claude.md to the repo so claude knows how to spin up the local server, project conventions, and what's where
- capture the setup steps: ruby, bundler, `bundle install`, serve command
- goal: open a new session, claude reads claude.md, and we're immediately productive without re-explaining the project
