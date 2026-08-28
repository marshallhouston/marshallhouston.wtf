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

Marshall usually plants kernels by typing or speaking `kernel: "one-liner"` inline, not by invoking the `add-kernels` skill. Whenever you see that pattern (or any mention of "new kernel", "plant this", "seed this"), follow the capture flow below. This also applies when the `add-kernels` skill runs.

### Flow

1. **Read existing kernels.** Glob `_kernels/*.md` and scan the `idea` field (plus `variants` if present) in each.
2. **Match on vibe, not phrasing.** Judge loosely: is this new idea the same underlying thought as an existing kernel? "quit conditions" and "knowing when to stop a project" are the same vibe. "vibe thinking" and "outsourcing cognition to the model" are the same vibe. When uncertain, ask marshall: "this feels like it could be the same as X, bump or new?"
3. **If match found, BUMP (don't create).** Update the existing kernel file in place:
   - Do NOT change the canonical `idea` field. That's the original phrasing.
   - Do NOT change `date`. That's the original capture date.
   - Add or increment `count` (starts at 1, so first revisit = 2).
   - Add or append to `revisits:` list. On first revisit, seed it with the original `date` AND today's date. On subsequent revisits, append today's date.
   - Add or append the new phrasing to `variants:` list.
4. **If no match, CREATE.** New `_kernels/<slug>.md` with base format. No count/revisits/variants on a fresh kernel.
5. **Report what happened.** Tell marshall which were new and which got bumped ("bumped vibe-thinking to 3, planted 2 new").

### Kernel File Format

**Fresh kernel:**
```yaml
---
idea: "the one-sentence idea, in marshall's voice."
date: YYYY-MM-DD
sprouted: false
---
```

**After one or more revisits:**
```yaml
---
idea: "the original canonical phrasing, never overwrite this."
date: 2026-03-15
sprouted: false
count: 3
revisits:
  - 2026-03-15
  - 2026-04-08
  - 2026-05-02
variants:
  - "phrasing from the first revisit"
  - "phrasing from the second revisit"
---
```

### Rules

- `count`, `revisits`, `variants` are **private tracking fields**. They are not rendered on the site (the `/kernels/` page only uses `idea`, `date`, `sprouted`). Do not build site UI for them.
- Loose matching, not strict. Prefer bumping over proliferation. Duplicates are a signal marshall is coming back to something, and we want that signal captured.
- The canonical `idea` field is sacred. Never overwrite it on a bump.
- Do not editorialize, expand, or "improve" kernel phrasing. Capture marshall's voice exactly.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

## Deps sweep

Workflow lives in the cosmic-farmland plugin (`/deps-sweep`). Repo-specific inputs:

- **Verify:** `bunx astro check` (informational only, see below), `bun run build`, `bun run test`.
- **Prod check:** `curl -s -o /dev/null -w "%{http_code}\n" https://marshallhouston.wtf` expects 200, plus spot-check a post page renders.
- **Keep `@astrojs/language-server` current** even though nothing depends on it directly. It is a transitive dep of `@astrojs/check` under `^2.16.7`, and the lockfile will happily sit on an old one. 2.16.15 replaced a bare `Cannot read properties of undefined (reading 'fileExists')` crash on TS 7 with a sentence explaining the actual cause.
- **`astro check` has ~42 pre-existing ts errors** in inline component scripts (mostly `RateYourself.astro`: unguarded `ctx`, `e.target`, `querySelector` nulls). Not a bump regression. Build is the real gate.
- **Astro is the whole dependency tree.** `@astrojs/mdx`, `rss`, `sitemap`, `check` are peers of `astro`. Bump `astro` first, then the integrations, or peer resolution fights you. Nearly every `bun audit` advisory here is transitive under astro (vite, sharp, svgo, yaml, esbuild) and clears on an astro bump.
- **Playwright bumps need `bunx playwright install`** after the version change, or tests fail on a missing browser.
- **`astro preview` always daemonizes on Astro 7**, even without `--background`, so it returns immediately. Playwright's `webServer` reads that as `Process from config.webServer exited early`, and the orphaned daemon then outlives teardown and fails the *next* run too. The `test` script works around it by starting the daemon itself (playwright's `reuseExistingServer` picks it up) and stopping it after. If a test run fails on that error, check `astro preview status` before suspecting the change under test.
- **Parked deps live in `.deps-held`**, not here, because `deps-audit.sh` reads that file and keeps those deps out of SAFE BATCH. A note here alone gets honored by humans and ignored by the script. Currently parked: `typescript`, because TS 7's native Go compiler ships no programmatic API and `astro check` refuses to run on it. Not an astro bug and not a peer-range technicality; upstream is waiting on TypeScript itself, tracked at withastro/roadmap discussion 1321 with withastro/astro issue 17268 as the umbrella issue. `astro check` is the only consumer of typescript here, so TS 7 buys nothing until that lands. Re-probe: install TS 7, run `bunx astro check`, revert.
