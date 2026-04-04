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

## Worklog

`worklog.md` tracks what happened each session and what's next. Read it at the start of every session.

## Content Pipeline

Ideas move through three stages. Never skip ahead.

1. **`_ideas/writing/`** - kernels and brainstorming.
2. **`_drafts/`** - working drafts. Not published. Preview with `--drafts` flag.
3. **`_posts/`** - published. Only move here when marshall says it's ready.

Other idea buckets (separate from writing pipeline):
- **`_ideas/tools/`** - apps and tools to build.
- **`_ideas/site/`** - improvements to the site itself.
