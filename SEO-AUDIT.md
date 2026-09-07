# SEO audit: GSC indexing exclusions, 2026-09-06

Google Search Console raised two alerts for marshallhouston.wtf: one site-wide, one
scoped to URLs in the submitted sitemap. The sitemap one is the real bug, because a
sitemap asserts that every URL in it is canonical, 200 and indexable.

- In sitemap: `Alternate page with proper canonical tag`
- Site-wide: that, plus `Page with redirect`, `Not found (404)`, `Duplicate, Google chose different canonical than user`

## What was broken

Ground truth came from the live site, not from framework conventions: fetch
`/sitemap-0.xml`, then per URL record pre-redirect status, final status, canonical,
`<meta name="robots">` and `X-Robots-Tag`, then crawl every internal link.

**1. Every canonical pointed at the `.html` twin. 22 of 22 sitemap URLs.**

`astro.config.mjs` sets `build.format: 'file'`, so Astro writes `dist/about.html`
and `Astro.url.pathname` is `/about.html` at build time. `Layout.astro` built the
canonical straight from that pathname, so `/about` declared
`<link rel="canonical" href="https://marshallhouston.wtf/about.html">`.

The Caddyfile's `try_files {path} {path}.html` also serves the same page at
`/about.html` with a 200. Two live URLs for one page, and the one Google was told
to prefer was the one *not* in the sitemap. That is precisely
`Alternate page with proper canonical tag` on every sitemap entry, and it is the
most likely source of `Duplicate, Google chose different canonical than user` too.

**2. Every internal post link carried a trailing slash. 15 URLs, referenced from
almost every page.**

`trailingSlash: 'never'` in the Astro config and a 308 in the Caddyfile, but the
link generation emitted `` `/${p.data.slug}/` ``. So every link from the homepage,
the tag index, and post-to-post navigation cost a 308 before landing. That is
`Page with redirect`. The RSS feed had the same problem from a different source:
`@astrojs/rss` appends a trailing slash unless told not to.

**3. `robots.txt` advertised a sitemap that 404s.**

It pointed at `/sitemap.xml`. `@astrojs/sitemap` emits `/sitemap-index.xml` and
`/sitemap-0.xml`; `/sitemap.xml` returns 404 on the live site.

**4. Two internal links pointed at `/talks/<name>/index.html`, and the kernel
frontmatter `post_url` values all carried trailing slashes.**

**5. The 404 page was a soft 404.** `dist/404.html` is a real file, so `try_files`
served it at `/404` and `/404.html` with a 200.

## Violation counts

Measured over the 22 sitemap URLs, plus a link crawl of the rendered site.

| | Before (live site) | After (local build behind the real Caddyfile) |
|---|---|---|
| Sitemap URLs not self-canonical | 22 | 0 |
| Sitemap URLs non-200 or redirecting | 0 | 0 |
| Sitemap URLs noindexed | 0 | 0 |
| Internal links that redirect | 15 | 0 |
| Internal links that 404 | 0 | 0 |
| `robots.txt` sitemap URL reachable | no (404) | yes |
| Soft 404s | 2 (`/404`, `/404.html`) | 0 |

## What changed

Generation logic, not symptoms.

- `src/layouts/Layout.astro` — strip the `.html` (and `/index`) that
  `build.format: 'file'` puts in `Astro.url.pathname` before building the canonical.
  This one change clears all 22 sitemap violations.
- `src/pages/index.astro`, `tags.astro`, `[slug].astro`, `feed.xml.js` — drop the
  trailing slash from generated post links, and from the `BlogPosting` JSON-LD `url`.
- `src/pages/feed.xml.js` — `trailingSlash: false` on the `rss()` call.
- `src/content/kernels/*.md` — five `post_url` values lost their trailing slash.
- `src/pages/talks.astro`, `src/content/posts/{cambrian-fractals,forwards-backwards-paradox}-talk.md`
  — link `/talks/<name>` rather than `/talks/<name>/index.html`.
- `Caddyfile` — 301 the `.html` twin onto the canonical shape (`/about.html` →
  `/about`, `/index.html` → `/`, `/x/index.html` → `/x`), so one page has one live
  URL. Plus `error 404` on `/404` and `/404.html` so the built error page returns the
  status it claims; `handle_errors` still renders it.
- `robots.txt` — point at `/sitemap-index.xml`.
- `scripts/check-sitemap.mjs` (new, wired into `bun run build`) — fails the build if
  any sitemap URL lacks a built page, carries a trailing slash or `.html` suffix,
  is not self-canonical, or is noindexed; and if any internal link or `feed.xml`
  entry points at a redirecting shape.

Verified by rebuilding, serving `dist/` behind the actual `Caddyfile` under `caddy`,
and re-running the step-1 checks against it. The existing Playwright suite passes
(157 passed, 1 skipped).

## Deliberately excluded from the sitemap

- `/slides/*` — filtered in `astro.config.mjs`. Presentation scaffolding, not content.
- Draft posts (`draft: true`) — never built, so never listed.
- `/talks/<name>/` slide decks — static `public/` assets, no canonical or layout.
  Linked from `/talks`, not listed for indexing.

Nothing carries a `noindex` on this site, so nothing was removed to silence an
alert, and no `noindex` was removed to make one disappear.

## Flagged for editorial work, not fixed here

- **`Duplicate, Google chose different canonical than user`.** With the canonical
  now pointing at the shape that is actually in the sitemap, most of this should
  resolve on recrawl. Any page still reported after that is a content signal, not a
  code one: Google reads it as thin or near-duplicate. Check the affected list in
  GSC after the next crawl and rewrite rather than re-patching the tags.
- **`/search` is in the sitemap.** It is a thin utility page: the Pagefind UI and
  nothing else without JS. Left indexable because it was not flagged and removing it
  is an editorial call, not a bug fix. If it ever gets flagged, `noindex` it and let
  `check-sitemap.mjs` push it out of the sitemap.
- **`src/content/posts/my-writing-process-v2.md` and `ptvm.md`** still contain
  unmigrated Jekyll liquid (`{% post_url ... %}`) that would render as literal text.
  Both are `draft: true`, so nothing is published broken, but they cannot ship as-is.

## Do in the GSC dashboard

Copy-paste checklist. Nothing here can be done from the repo.

1. **Sitemaps → remove the stale entry.** If `https://marshallhouston.wtf/sitemap.xml`
   is listed as a submitted sitemap, delete it. It 404s.
2. **Sitemaps → confirm the live one.** `https://marshallhouston.wtf/sitemap-index.xml`
   should be the only submitted sitemap, status Success.
3. **URL Inspection → Request Indexing**, after this PR is merged and deployed, for:

   ```
   https://marshallhouston.wtf/
   https://marshallhouston.wtf/about
   https://marshallhouston.wtf/boosting-builders
   https://marshallhouston.wtf/build-friction-fix
   https://marshallhouston.wtf/builders-vs-naysayers-ten-dimensions
   https://marshallhouston.wtf/cambrian-fractals
   https://marshallhouston.wtf/co-intelligence-ai-augmented-writing-system
   https://marshallhouston.wtf/fart-smell-detection
   https://marshallhouston.wtf/forwards-backwards-paradox
   https://marshallhouston.wtf/hiyaaa-world
   https://marshallhouston.wtf/influences
   https://marshallhouston.wtf/kernels
   https://marshallhouston.wtf/lowerchaos
   https://marshallhouston.wtf/mental-experimentation-budgets
   https://marshallhouston.wtf/probabilistically-perfect-piggies
   https://marshallhouston.wtf/search
   https://marshallhouston.wtf/tags
   https://marshallhouston.wtf/talks
   https://marshallhouston.wtf/telemetry-then-systematize
   https://marshallhouston.wtf/three-little-workflows
   https://marshallhouston.wtf/tools/builders-vs-naysayers
   https://marshallhouston.wtf/unpromptable
   ```

   GSC rate-limits manual requests. The homepage, `/about` and the three or four
   posts you care most about are the ones worth spending the quota on; the rest will
   be picked up from the sitemap.

4. **Clears on its own after recrawl, no action needed:**
   - `Alternate page with proper canonical tag` — the `.html` twins now 301 onto the
     canonical shape, so the alternates stop existing.
   - `Page with redirect` — the redirecting internal links are gone.
   - `Not found (404)` — `/404` and `/404.html` now return a real 404 instead of a
     200, so they drop out of the indexed set rather than being reported.
5. **Check after the next crawl:** `Duplicate, Google chose different canonical than
   user`. Whatever is still listed there is the editorial item above.
6. **Nothing to do on origin variants.** Checked: `http://marshallhouston.wtf/about`
   301s to `https://`, and `www.marshallhouston.wtf` has no certificate and does not
   resolve to the site, so there is no www duplicate to consolidate. If a `www` or
   `http` property is still listed in GSC, it can be removed.
