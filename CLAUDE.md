# CLAUDE.md

## Build & Development

```bash
bun install        # install dependencies
bun run dev        # local dev server at localhost:4321
bun run build      # static build to ./dist
bun run preview    # serve ./dist locally
```

Engine: Astro (migrated from Jekyll on 2026-04-27). Content collections in
`src/content/{posts,kernels}`. Pages in `src/pages/`. Layouts in `src/layouts/`.
Static assets in `public/`. Build output `dist/` served by Caddy in container.

## Voice & Style

marshall's voice is a spectrum, not a template. Each post has its own register/energy. **Read the target post's energy before drafting.** When unsure, ask.

### Constants
- Exploratory, not conclusive. Ship the thinking.
- Cross-domain references (literary, philosophical, scientific) are a feature, not a reach.
- Don't prescribe tools to the reader.
- Direct quotes (block quotes with attribution) preserve original capitalization. Marshall's voice is lowercase; other people's words stay as they wrote them.
- Proper nouns keep canonical casing even in lowercase prose: **Ibotta**, **CultureCon**, **Turing School of Software & Design**.
- Inclusive language. See section below.

### Drafting
- Fragments over complete sentences. Periods doing structural work.
- First person ("i", "me"), not second person ("you") for marshall's experience.
- Cut connective tissue. Trust the reader to follow without hand-holding.
- Name the feeling directly rather than writing around it. Use marshall's actual reaction, not a polished version of it.
- Show the thing (directory trees, code blocks, actual commands) rather than describing it.
- Don't overthink first drafts. Get something down fast for marshall to react to.
- If it could have been written by any AI, it's wrong.
- If it sounds like a LinkedIn post, burn it down.
- Don't hedge on things marshall is direct about, or add false confidence to things he's exploring.

### Inclusive language

References: [ASWF guide](https://www.aswf.io/blog/inclusive-language/), [Google dev style](https://developers.google.com/style/inclusive-documentation).

**Mechanically blocked at pre-commit** (`scripts/hooks/check-inclusive-language.sh`): whitelist, blacklist, master/slave, manpower, man-hours, mankind, middleman, cripple(s/d), dummy variable, handi-capable, STONITH. Replace with: allowlist, blocklist, primary/replica, labor/workforce, person-hours, humanity, mediator, slow down/degrade, placeholder, (omit), "fence failed nodes".

**Judgment-required.** Replace when context is technical / formal / could read as default-male or otherized. Keep when it's marshall's figurative register and replacement would flatten the voice.

- Socially-charged: master alone (use main, lead), native feature (use core, built-in), culture fit (use values fit), first-class citizen (rephrase).
- Gendered: guys for mixed groups (use folks, people), girl(s) for adult women (use women), default he/she pronouns (use they).
- Ableist as casual descriptors: crazy/insane describing a person or group (use unpredictable, baffling), sanity-check (use final check), blind to / blind eye (use unaware, ignored).
- Ageist: grandfather/grandfathered as a verb (use carry over, exempt).
- Violent in technical/formal docs: abort (use cancel, stop), hit (use reach, request).

**Don't police figurative voice.** Phrases like "off normal", "kill the branch", "crushing it" (sincere or satirical), "hang out" are part of marshall's register. Leave them. The hook only blocks the unambiguous slate above.

When a non-inclusive term is an established API/keyword (SQL `SLAVE`, k8s field names), keep it in code font and rewrite surrounding prose to use the inclusive term. Don't invent new keywords.

When in doubt, ask.

## Content Pipeline

Ideas move through three stages. Never skip ahead.

1. **`_ideas/writing/`** - kernels and brainstorming. Filesystem only, not rendered.
2. **`src/content/posts/*.md` with `draft: true`** - working drafts. Visible in `bun run dev`, excluded from `bun run build`.
3. **`src/content/posts/*.md` (no `draft:` flag, or `draft: false`)** - published. Flip the flag when marshall says it's ready.

Other idea buckets (separate from writing pipeline, filesystem only):
- **`_ideas/tools/`** - apps and tools to build.
- **`_ideas/site/`** - improvements to the site itself.

### Drafting gate

Writing a new post (file with `draft: true`) is gated on two preconditions:

1. A kernel exists in `_ideas/writing/` (or `src/content/kernels/`) for this post.
2. The `brainstorm-post` skill has been invoked this session, starting with the register/energy question.

Prescriptive prompts do NOT override these. Detailed structure, section breakdowns, voice bullets, or output paths from marshall are input to the brainstorm, not a replacement for it. The more structure he pre-specifies, the more important register becomes, because register is the one thing structure cannot encode.

Skip only if marshall explicitly says "skip the brainstorm" or "just draft it." Otherwise, plant the kernel and run brainstorm-post first.

## Kernel Capture

Inline `kernel: "one-liner"` (or "new kernel", "plant this", "seed this") means capture it now via `.claude/skills/add-kernels/SKILL.md`: dedupe by vibe, bump or create, report. Skip the skill's "ask what's bouncing" and "show the list" steps for an inline one-liner.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

## Deps sweep

Workflow lives in the cosmic-farmland plugin (`/deps-sweep`). Repo-specific inputs:

- **Verify:** `bunx astro check` (informational only, see below), `bun run build`, `bun run test`.
  `bun run test` is playwright against `astro preview` **plus** `scripts/check-negotiation.sh`,
  which boots the real Caddyfile over `dist/` and asserts the Accept negotiation
  (markdown, `Vary: Accept`, `406`, `q=0`) and the 404. Preview knows nothing about
  Accept headers, so the Caddyfile can only regress there. Needs `caddy` on PATH.
- **Prod check:** a 200 only proves *something* is up, not that your build shipped. Astro stamps its version into the HTML, so check that instead:
  ```
  curl -s https://marshallhouston.wtf | grep -o '<meta name="generator"[^>]*>'
  ```
  Then confirm the live commit. Deploys are **Railway**, not GitHub Actions: the `marshallhouston.wtf` service in the `marshallhouston.wtf site` project auto-deploys every push to `main`. `gh run list` shows only stale GitHub Pages runs from April 2026 and will make a healthy deploy look invisible. Check the Railway dashboard, or list deployments and match the top `SUCCESS` row's `commitHash` against `git rev-parse origin/main`.
- **Keep `@astrojs/language-server` current** even though nothing depends on it directly. It is a transitive dep of `@astrojs/check` under `^2.16.7`, and the lockfile will happily sit on an old one. 2.16.15 replaced a bare `Cannot read properties of undefined (reading 'fileExists')` crash on TS 7 with a sentence explaining the actual cause.
- **`astro check` has ~42 pre-existing ts errors** in inline component scripts (mostly `RateYourself.astro`: unguarded `ctx`, `e.target`, `querySelector` nulls). Not a bump regression. Build is the real gate.
- **Astro is the whole dependency tree.** `@astrojs/mdx`, `rss`, `sitemap`, `check` are peers of `astro`. Bump `astro` first, then the integrations, or peer resolution fights you. Nearly every `bun audit` advisory here is transitive under astro (vite, sharp, svgo, yaml, esbuild) and clears on an astro bump.
- **Playwright bumps need `bunx playwright install`** after the version change, or tests fail on a missing browser.
- **`astro preview` is unreliable to script on Astro 7.** It sometimes daemonizes and returns immediately, sometimes stays in the foreground; `astro preview stop` hangs indefinitely. Playwright's `webServer` reads the first case as `Process from config.webServer exited early`, and a bare `astro preview && playwright test` never reaches playwright in the second. Either way an orphaned server outlives teardown and fails the *next* run. `bun run test` now shells out to `scripts/preview-test.sh`, which starts the server in the background, polls the port until it answers, runs playwright, then stops it **by port** (astro processes only, so a `bun run dev` on 4321 is safe). Do not put `astro preview stop` back; it is the thing that hangs.
- **Parked deps live in `.deps-held`**, not here, because `deps-audit.sh` reads that file and keeps those deps out of SAFE BATCH. A note here alone gets honored by humans and ignored by the script. Currently parked: `typescript`, because TS 7's native Go compiler ships no programmatic API and `astro check` refuses to run on it. Not an astro bug and not a peer-range technicality; upstream is waiting on TypeScript itself, tracked at withastro/roadmap discussion 1321 with withastro/astro issue 17268 as the umbrella issue. `astro check` is the only consumer of typescript here, so TS 7 buys nothing until that lands. Re-probe: install TS 7, run `bunx astro check`, revert.
