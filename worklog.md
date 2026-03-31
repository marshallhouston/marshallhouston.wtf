# worklog

## 2026-03-25

### what happened
- captured tattoos idea doc (`_ideas/writing/tattoos-geometry-meaning.md`) from conversation about the two triangles and circle/tangency tattoos
- reviewed full ideas landscape (8 idea docs + raw kernels in brainstorm file)
- brainstormed experimentation budget post from idea kernel to full post arc
  - hook: anecdote of someone whose budget collapsed from one AI tool failure
  - health bar metaphor for mental experimentation budget
  - economics model (capacity, marginal cost, fixed cost, outcome shock, return, recharge)
  - systems thinking lens (Meadows), cognitive science (Kahneman, Pryor)
  - exploratory tone, not prescriptive
- appended fleshed out design to `_ideas/writing/experimentation-budget.md`
- created `brainstorm-post` skill at `.claude/skills/brainstorm-post/SKILL.md`
- added `mise.toml` (ruby 3.3 pin)
- set up this worklog
- revisited experimentation budget idea, pushed on voice and structure
  - killed LinkedIn-style hook ("someone experimenting with AI tools"), replaced with real felt moment ("are you kidding me?")
  - shifted from presentation structure to discovery arc (reader walks through thinking as it happened)
  - added anti-pattern check for hooks to brainstorm-post skill
  - saved feedback memory re: no LinkedIn hooks
  - appended revised discovery arc design to idea doc
  - wrote first draft of post at `_posts/2026-03-25-your-experimentation-budget.md`

### what's next
- review and revise experimentation budget draft (voice check, does it land?)
- could use the brainstorm-post skill on another idea kernel to test it
- cosmic farmland idea captured separately, worth exploring

## 2026-03-30

### what happened
- fixed frontmatter formatting in Jekyll posts (`_posts/` and `_drafts/`)
  - removed time and timezone from `build-friction-fix` and `mental-experimentation-budgets` posts
  - kept date-only format per Jekyll best practices
- created hookify rule at `.claude/hookify.date-only-frontmatter.local.md`
  - prevents accidental time/timezone inclusion in post dates
- published `mental-experimentation-budgets` post after many rounds of revision (2 weekends in a row)
- used new review workflow: `review.html` - post sections on left, feedback panels on right, "copy all feedback as markdown" button
  - section-by-section feedback with placeholders tailored to each section
  - structured markdown output formatted for pasting directly into Claude Code
  - this was the editing loop: review.html -> enter feedback -> copy markdown -> paste to Claude Code -> repeat
- fixed broken Stop hook for worklog auto-update
  - was using `type: "agent"` which only works for PreToolUse/PostToolUse - silently did nothing
  - replaced with `type: "command"` using `additionalContext` to wake Claude before session ends
- planning `/feedback` command + HTML generation script to make review workflow repeatable

### what's next
- implement `/feedback` command + `generate-feedback-html` script
  - script: takes any content file, parses into sections, generates post-specific review HTML
  - command: invokes script, opens browser, guides applying structured feedback
- explore advanced: inline text selection -> auto-capture in feedback textarea (v2 of review.html)
