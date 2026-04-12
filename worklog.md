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

## 2026-03-31

### what happened
- captured 13 idea kernels from voice brain dump session
  - travel/special places, daughter/family values, influences catalog, about-me evolution, knowing-yourself/origins, hobbies evolution, intensity/social feedback, creativity/expression, autonomy/belief/perfectionism, freedom rides/alabama, sports/analytics, writing process, authenticity
  - appended sleep/ADHD cycles material to existing adult-adhd-diagnosis kernel
- updated about page (`_pages/about.md`) to match cosmic farmland voice
  - independence section: dropped legalese register, added cosmic farmland framing, sponsored content joke
  - AI section: expanded uses list, added "virtual rubber duck", dropped co-intelligence hyperlink
  - used split-pane HTML review tool (current page left, feedback textarea right) for edit cycle
- added `sports-analytics-systems` kernel (pattern recognition, predicting announcers, systems thinking)
- added `writing-process` kernel with new context: 2 weeks in, 3 posts published, overflowing with ideas
- shipped inline text selection -> annotation feature in `_scripts/generate-feedback-html`
  - highlight post text -> auto-populates feedback textarea with `instead: "..." / do: "..."` pattern
  - cursor lands on the "do" replacement text ready to type

### what's next
- brainstorm a post from the new kernels (freedom-rides-alabama and knowing-yourself-origins have the most gravity)
- writing-process post is ripe: meta, timely, video angle is interesting
- experimentation budget draft still needs a voice review pass

## 2026-04-01 through 2026-04-03

### what happened
- brainstormed and drafted authenticity post across multiple sessions
  - v1: long-form four-section arc (drowning, diagnosis, historical beat, declaration) with gonzo energy
  - feedback loop: revised drowning section with manic energy, ALL CAPS, engagement farm language
  - collapsed four sections to three (drowning, gonzo, homemade mullet energy)
  - wove in Sturgill Simpson / Johnny Blue Skies lyrics (Mutiny After Midnight)
  - v2 pivot: scrapped long-form entirely, went short/dark/visceral with slop/trough/slaughterhouse metaphor
  - published as "probabilistically perfect piggies" (`_posts/2026-04-03-probabilistically-perfect-piggies.md`)
  - v1 draft preserved in `_drafts/` for future material (thompson, mullet, biographical arc)
- fixed hookify bugs
  - `lowercase-content` rule had no content condition (blocked all writes to post/draft files)
  - added `tool_matcher: Edit|Write|MultiEdit` to prevent blocking Read operations
  - fixed `re.IGNORECASE` defeating case-checking regex with `(?-i:...)` inline groups
  - added same `tool_matcher` fix to `no-em-dashes` rule
- updated lowercase-content hook to distinguish ALL CAPS (voice/energy, allowed) from Title Case (polish, blocked)

### what's next
- v1 draft material: thompson personal discovery, homemade mullet energy, formula vs. intentionality thread could each become their own posts
- experimentation budget draft still needs a voice review pass
- freedom-rides-alabama and knowing-yourself-origins kernels still have gravity
- hookify date-only-frontmatter rule has same trailing newline bug (blocks valid edits)

## 2026-04-05

### what happened
- brainstormed and published lowerchaos post (`_posts/2026-04-05-lowerchaos.md`)
  - quiet/minimal register, feedback responsiveness energy
  - includes quotes from jeff casimir (linkedin), jesse (slack), and an engineer on the team
  - creative tension angle: lowerchaos is intentionally jarring, but meeting people where they're at matters more than winning an aesthetic argument
  - linked to jeff's linkedin comment, linkedin reply draft ready at `_ideas/writing/lowerchaos-linkedin-draft.md`
- fixed broken site rendering on lowerchaos post
  - root cause: `layout: post` doesn't exist in minimal mistakes theme (uses `single`)
  - posts don't need explicit layout, `_config.yml` defaults handle it
- fixed broken BFF kernel link (`/bff-build-friction-fix/` → `/build-friction-fix/`)
- built pre-commit hook system for site trust:
  - **site health check** (`check-site-health.sh`): jekyll build + validates all pages have theme rendering + checks all internal links. blocks commit on failure.
  - **capitalize config check** (`check-capitalize-config.sh`): flags proper nouns in posts missing from `_config.yml` capitalize config. warn only.
  - **playwright tests now trigger on any `_posts/*.md` change**, not just toggle-related files. added test for cross-page session persistence to lowerchaos.
- built feedback auto-regeneration hook (`regenerate-feedback.sh`)
  - PostToolUse hook regenerates `feedback.html` when `_drafts/*.md` files are edited
  - only fires when `feedback.html` exists (active feedback session)
- sprouted lowerchaos kernel on kernels page

### what's next
- update linkedin reply draft with post URL and send
- experimentation budget draft still needs a voice review pass
- freedom-rides-alabama and knowing-yourself-origins kernels still have gravity
- v1 authenticity draft material still available for future posts

## 2026-04-07

### what happened
- renamed GitHub repo from `marshallhouston/marshallhouston.github.io` to `marshallhouston/marshallhouston.wtf` to match the custom domain
  - `gh repo rename` auto-updated local git remote
  - updated repo identifiers in `_config.yml` (`repository:`), `package.json` (name/repo/bugs/homepage), `package-lock.json` (name)
  - committed as 67c4cc1, pushed clean; site health check passed (80 pages)
- created redirect stub repo at `marshallhouston/marshallhouston.github.io` (lives at `~/marshallhouston.github.io-stub/`)
  - `404.html` + `index.html` JS-redirect any path to `marshallhouston.wtf/*` preserving path+query+hash, meta refresh fallback
  - restores inbound-link coverage lost when renaming away from the `username.github.io` Pages pattern
  - Pages auto-enabled, building on creation
- updated `project_domains.md` memory to reflect rename + stub architecture

### what's next
- rename local directory `~/marshallhouston.github.io/` → `~/marshallhouston.wtf/` (deferred, will break open tmux panes)
- verify stub redirect works end-to-end once Pages build finishes
- experimentation budget draft still needs a voice review pass
- freedom-rides-alabama and knowing-yourself-origins kernels still have gravity
