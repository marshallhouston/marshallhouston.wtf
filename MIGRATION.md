# Astro Spike — Migration Notes

Branch: `astro-spike`. Worktree: `~/code/marshallhouston.wtf-astro-spike`.

## Locked decisions
1. Theme: port minimal-mistakes dark vars to plain CSS. Theme survey post-migration.
2. Permalinks: `slug` field on posts collection. Existing URLs preserved.
3. Tag slug: `github-slugger`. Audit during spike.
4. Branch: this worktree. Main untouched.
5. Scope: 8-item spike + URL diff gate + visual diff playwright.

## Phase 1 inventory (done)

### Live URLs (`/tmp/jekyll-urls.txt`, 21 entries)
```
/
/about/ /books/ /influences/ /kernels/ /moments/ /tags/
/feed.xml /sitemap.xml
/slides/cambrian-fractals/
/build-friction-fix/ /co-intelligence-ai-augmented-writing-system/
/boosting-builders/ /fart-smell-detection/ /hiyaaa-world/
/lowerchaos/ /mental-experimentation-budgets/
/probabilistically-perfect-piggies/ /telemetry-then-systematize/
/three-little-workflows/ /unpromptable/
```

### Tags (`/tmp/jekyll-tags-raw.txt`, 16 unique)
ai-augmented-engineering, ai-culture, claude-code, cosmic-farmland,
creative-expression, experimentation, mental-models, process, ptvm,
pushback, ruminating, satire, sensemaking, unhinged, workflow, writing

All ASCII + hyphenated. github-slugger will produce identical output.
Audit expected: zero diff.

### Dark skin tokens (extracted from `_site/assets/css/main.css`)

```
--bg:           rgb(31.45, 35.7, 44.2)   # ~#1f2330 (body)
--surface:      #252a34                   # masthead, code blocks
--text:         #eaeaea
--text-muted:   #ccc
--text-soft:    #bdbdbd
--text-strong:  #f3f3f3 / #fff
--link:         rgb(105.3, 157.2, 159.6)  # ~#699d9f
--link-hover:   rgb(169.05, 220.95, 223.35) # ~#a9dcdf
--link-visited: rgb(140.4, 209.6, 212.8)  # ~#8cd1d4
--font-sans:    -apple-system, BlinkMacSystemFont, "Roboto",
                "Segoe UI", "Helvetica Neue", sans-serif
--type-base:    16px (mobile) / 18px–22px (breakpoints)
--scale:        1.25rem, 1.5rem, 1.75rem, 1.953em, 2.441em
--line-height:  1.5 body, 1.2 headings
```

## Phase 2 — scaffold (done)
- `npm create astro@latest -- astro --template minimal` → `astro/` subdir
- Installed: astro 6.1.9, @astrojs/rss 4.0.18, @astrojs/sitemap 3.7.2, github-slugger 2.0.0
- `astro.config.mjs`: `site: https://marshallhouston.wtf`, `trailingSlash: 'always'`, `format: 'directory'`, sitemap integration
- `src/content.config.ts`: `posts` (slug, title, date, tags, updated_at, custom_cap_toggle), `kernels` (idea, date, sprouted, post_title, post_url)
- Static assets → `astro/public/` (favicon.svg, apple-touch-icon.png, robots.txt, llms.txt)

## Phase 3 — port (done)
- `src/styles/global.css` — minimal-mistakes dark vars, body/masthead/footer/typography
- `src/layouts/Layout.astro` — html shell, masthead nav, footer, RSS link
- `src/content/posts/unpromptable.md` — slug: unpromptable
- `src/content/kernels/{bff,ai-is-a-how,about-me,adhd,ai-engineering-grief}.md` — copied as-is
- `src/pages/index.astro` — post list + top-5 tag cloud
- `src/pages/[slug].astro` — dynamic post route from slug field
- `src/pages/about.astro` — about content
- `src/pages/kernels.astro` — grouped by month, lowercase month label
- `src/pages/feed.xml.js` — RSS via @astrojs/rss
- `src/pages/tags.astro` — tag index with anchor sections (matches Jekyll `/tags/#anchor` pattern)

## Phase 4 — verify (done)

### URL parity (spiked routes only)
```
JEKYLL_SPIKED          ASTRO            DIFF
/                      /                ✅
/about/                /about/          ✅
/feed.xml              /feed.xml        ✅
/kernels/              /kernels/        ✅
/tags/                 /tags/           ✅
/unpromptable/         /unpromptable/   ✅
```
Empty diff for spiked URLs. ✅

### Tag slug audit
github-slugger vs Jekyll: 16 tags, 0 diffs. ✅

### Build
- 6 pages built in 928ms (vs Jekyll multi-second w/ remote-theme fetch)
- Output `dist/` 1:1 with expected URL paths
- Sitemap: `dist/sitemap-index.xml` + `dist/sitemap-0.xml` (parses)
- Feed: valid RSS 2.0, item shape matches expectations

## Spike-found friction (fix during full migration)
- **Sitemap path break**: Jekyll → `/sitemap.xml`, `@astrojs/sitemap` → `/sitemap-index.xml`. Either (a) custom `src/pages/sitemap.xml.js` rebuilds same content, or (b) caddy redirect, or (c) update robots.txt + resubmit to search consoles.
- **Docker swap**: spike skipped Dockerfile rewrite. Full migration: replace ruby build stage with `node:20-alpine`, swap `_site` → `dist` in COPY, otherwise Caddyfile unchanged.
- **`custom_cap_toggle`**: schema has the field, no rendering yet. Port `_includes/cap-toggles/` logic during full migration.
- **Visual diff playwright**: not run in spike. Eyeball check only.

## Phase 5 — full migration (done)

### Content ported
- 11 posts → `src/content/posts/` (port script: `astro/scripts/port-posts.mjs`, derives slug from `permalink:` field or filename, synthesizes `date:` from filename when missing)
- 79 kernels → `src/content/kernels/` (verbatim cp)
- pages: about, books, influences, moments, kernels, tags (all in `src/pages/`)
- slides + assets → `astro/public/slides/` + `astro/public/assets/`

### Sitemap path fixed
- Dropped `@astrojs/sitemap` integration (emits `/sitemap-index.xml`, breaks parity)
- Custom `src/pages/sitemap.xml.js` writes valid `/sitemap.xml` listing static pages + post slugs
- URL diff: jekyll vs astro = 0 both directions

### Dockerfile
- `astro/Dockerfile`: node:20-alpine build → caddy:2-alpine serve, copies `dist`
- `astro/Caddyfile`: copied from root, unchanged
- `astro/.dockerignore`: excludes node_modules, dist, .astro, tests

### Build
- 18 routes generated in 1.05s
- `npm run preview` smoke test: home, unpromptable, about, feed, sitemap, slides → all 200

### URL parity (final)
- jekyll-urls.txt vs astro-urls.txt: 0 diff bidirectional ✅
- All 21 jekyll URLs reproduced

## Cutover plan (when ready)
1. Move `astro/*` to worktree root (overwriting `_config.yml`, `Gemfile`, jekyll Dockerfile etc).
2. Archive jekyll bits: `_layouts/`, `_includes/`, `_pages/`, `_posts/`, `_data/`, `_config.yml`, `Gemfile*`, `assets/` → some `_archive-jekyll/` dir (or just delete since git history retains them).
3. Update `.gitignore` for astro: `dist/`, `.astro/`.
4. PR `astro-spike` → main.
5. Railway auto-deploys → verify production. Watch Caddy logs for unexpected 404s.
6. Rollback path: redeploy previous Docker image.

## Outstanding (do during/after cutover)
- `custom_cap_toggle` linkedin rendering (only 1 post uses it: unpromptable)
- masthead/footer polish
- og-default image, social meta, twitter cards
- search (currently `search: true` in jekyll, drops if unused; reintegrate via pagefind/fuse.js if wanted)
- `_data/navigation.yml` consumption (currently hardcoded in Layout.astro nav)
- Theme survey for cosmic-farmland vibe (separate move)

## Spike verdict: ✅ engine swap viable
- Astro builds clean, content collections work, slug field preserves URLs, github-slugger matches Jekyll, RSS + sitemap functional, dark theme tokens port cleanly.
- Greenlight full migration.

## Skipped from spike (planned for full migration)
- Remaining 9 posts, 75 kernels
- moments, books, influences pages
- cap-toggles include
- Search
- masthead/footer fidelity polish
- og-default image, social meta
- `_data/navigation.yml` consumption
- Dockerfile node swap + container smoke test
- Playwright visual diff Jekyll vs Astro
- Sitemap path parity fix
- Theme survey for cosmic-farmland vibe
