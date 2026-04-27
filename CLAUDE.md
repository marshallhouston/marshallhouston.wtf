# CLAUDE.md

## Build & Development

```bash
bundle install                              # install dependencies
bundle exec jekyll serve --livereload       # local dev server at localhost:4000
```

## Voice & Style

marshall's voice is a spectrum, not a template. Each post has its own register/energy. **Read the target post's energy before drafting.** When unsure, ask.

### Constants
- Exploratory, not conclusive. Ship the thinking.
- Cross-domain references (literary, philosophical, scientific) are a feature, not a reach.
- Don't prescribe tools to the reader.
- Direct quotes (block quotes with attribution) preserve original capitalization. Marshall's voice is lowercase; other people's words stay as they wrote them.
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

**Judgment-required (use better term when context allows):**

- Socially-charged: master alone (→ main, lead), native feature (→ core, built-in), culture fit (→ values fit), housekeeping (→ cleanup, maintenance), first-class citizen (→ rephrase).
- Gendered: guys (→ folks, people), girl(s) for adult women (→ women), he/she pronouns (→ they), man/woman-as-default examples (→ diverse names).
- Ableist: crazy, insane (→ unpredictable, unexpected, baffling), normal (→ typical), abnormal (→ atypical), sanity-check (→ final check), blind to / blind eye (→ unaware, ignored), dumb (→ silent, no-op), lame (→ uninspired).
- Ageist: grandfather/grandfathered (→ established, carry over, exempt), legacy when used dismissively (→ established, prior, v1).
- Violent: kill/killing (→ stop, terminate, end), hang (→ stall, freeze), crushing it / killing it (→ excelling), abort (→ cancel, stop), hit (→ reach, request).
- Slaughter metaphors: avoid pets vs. cattle for stateful vs. stateless.

When a non-inclusive term is an established API/keyword (SQL `SLAVE`, k8s field names), keep it in code font and rewrite surrounding prose to use the inclusive term. Don't invent new keywords.

When in doubt, ask.

## Content Pipeline

Ideas move through three stages. Never skip ahead.

1. **`_ideas/writing/`** - kernels and brainstorming.
2. **`_drafts/`** - working drafts. Not published. Preview with `--drafts` flag.
3. **`_posts/`** - published. Only move here when marshall says it's ready.

Other idea buckets (separate from writing pipeline):
- **`_ideas/tools/`** - apps and tools to build.
- **`_ideas/site/`** - improvements to the site itself.

### Drafting gate

Writing to `_drafts/` is gated on two preconditions:

1. A kernel exists in `_ideas/writing/` (or `_kernels/`) for this post.
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
