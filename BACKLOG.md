# Backlog

Things noted during the Astro migration that we deferred. No order beyond
"post-merge" — pick by impact when ready.

## Post-merge (after astro-spike → main)

- **Bun migration.** Astro supports `bun` (runtime + package manager). Swap
  `npm` for `bun` in scripts, hooks, CI, and the Playwright `webServer`
  command. Validate `npm test` / pre-commit / preview all still work.

## Search

Pagefind is wired (`/search/`, default UI bundle, indexed at build via
`pagefind --site dist`). Works but has gaps:

- Switch from the legacy default UI to Pagefind 1.5 Component UI (modal,
  better a11y, customisation). Pagefind already prints a notice nudging
  this on every build.
- Scope the index. Add `data-pagefind-body` to `article.post` (and maybe
  the kernels list) so search returns posts/kernels, not nav chrome and
  empty placeholder pages.
- Dev-mode search fallback. Pagefind index only exists after `npm run
  build`; dev shows a "not built" notice. Either prebuild a stub at dev
  start, or wire an in-memory fuse.js index for dev.

## Other

(Add as found.)
