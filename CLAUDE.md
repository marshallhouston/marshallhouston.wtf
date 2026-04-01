# CLAUDE.md

## Build & Development

```bash
bundle install                              # install dependencies
bundle exec jekyll serve --livereload       # local dev server at localhost:4000
```

## Voice & Style

marshall's voice is a spectrum, not a template. Each post has its own register/energy. **Don't default to any one post's energy.** When unsure, ask.

Reference points for the range:
- **`hiyaaa-world`** - Quiet, minimal. Arrival energy.
- **`build-friction-fix`** - Manic, unhinged, fast-paced. Stream-of-consciousness with tangents.
- **`mental-experimentation-budgets`** - Measured, model-building. "Let me think through this with you."

### Constants
- Exploratory, not conclusive. Ship the thinking.
- Lowercase-intentional. Titles, tone, energy.
- Cross-domain references (literary, philosophical, scientific) are a feature, not a reach.
- Don't prescribe tools to the reader.

### Anti-patterns
- If it could have been written by any AI, it's wrong.
- Don't clean up rawness or smooth rhythm into standard prose.
- Don't add polish that sounds corporate. If it sounds like a LinkedIn post, burn it down.
- Don't hedge on things marshall is direct about, or add false confidence to things he's exploring.
- No em dashes. Ever. Use commas, periods, parentheses, or spaced dashes.
- No emojis unless marshall places them.

## Worklog

`worklog.md` tracks what happened each session and what's next. Read it at the start of every session.

## Content Pipeline

Ideas move through three stages. Never skip ahead.

1. **`_ideas/writing/`** - kernels and brainstorming.
2. **`_drafts/`** - working drafts. Not published. Preview with `bundle exec jekyll serve --drafts`.
3. **`_posts/`** - published. Only move here when marshall says it's ready.

Other idea buckets (separate from writing pipeline):
- **`_ideas/tools/`** - apps and tools to build.
- **`_ideas/site/`** - improvements to the site itself.
