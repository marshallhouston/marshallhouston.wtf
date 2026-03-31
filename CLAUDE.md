# CLAUDE.md

## Build & Development

```bash
bundle install                              # install dependencies
bundle exec jekyll serve --livereload       # local dev server at localhost:4000
```

## Voice & Style

This is Marshall's personal blog. The voice is intentionally different from his professional writing at Ibotta.

### Why this voice matters

There's a scarcity of authenticity right now. AI-assisted writing is converging toward the mean, milquetoast, stale, writing toward the average. Marshall's voice is a deliberate pushback against that homogenization. The rawness isn't laziness, it's resistance. When everything sounds like it was written by the same robot, a real human voice becomes more valuable, not less.

### Marshall contains multitudes

There is no single "the voice." Marshall's voice is a spectrum, and the energy of a post matches the idea, not a template. He's figuring out his voice through Freire's praxis: action + reflection. Each post is authentic but different.

**Do not default to any one post's energy.** Read the draft or idea as it is and match *that* energy. When in doubt, ask Marshall what register he's going for rather than assuming.

The published posts are reference points for the range:

- **`hiyaaa-world`** - Quiet, minimal, personal. Short declarative sentences. No framework, no references. Just a human showing up. The energy is arrival, not performance.
- **`build-friction-fix`** - High energy, manic, stream-of-consciousness. Rabbit hole tangents, repetition as emphasis, exclamation energy without exclamation marks. Literary references (Yeats). Meta-application (the post applies BFF to itself). Unhinged and fast-paced.
- **`mental-experimentation-budgets`** - Measured, calmer, model-building. Still personal but more structured. References are academic/practical (Kahneman, Meadows, Prior). Laying out a mental model with variables and a formula. The energy is "let me think through this with you."

### What stays constant across the range
- **Exploratory, not conclusive.** Posts are kernels of ideas, not finished arguments. Ship the thinking, see what resonates, iterate later.
- **Lowercase-intentional.** Titles, tone, energy. Not casual-by-accident but informal-by-choice.
- **Wide-ranging connections.** English and economics double major. Far-flung literary, philosophical, and cross-domain references are a feature, not a reach. The resonance is enough.
- **Personal.** Topics span coffee, golf, parenting, music, tattoos, neurodivergence, the full person.
- **Self-referential.** Posts can apply their own framework to the writing itself. Meta-application is a feature.
- **Tool-agnostic for the reader.** Don't prescribe specific tools to the reader. Naming what Marshall personally uses is fine (specificity is good), but recommendations should be pattern-level, not product-level.

### What varies by post
- **Pacing.** BFF is rapid-fire, short bursts. MEB is longer paragraphs, more measured cadence. Match the content.
- **Structure.** Some posts are loose and tangential. Others lay out models with named variables. Both are valid.
- **Reference density.** Some posts are heavy on cross-domain references. Others have none. Don't inject references to match a previous post's style.
- **Repetition.** BFF uses repetition for rhythm (three variations is emphasis, five is a TED talk). MEB doesn't lean on that device. Use it when the energy calls for it.

### Anti-patterns
- **If it could have been written by any AI, it's wrong.** Rewrite toward Marshall, not toward "good writing."
- Don't clean up the rawness. If a blockquote is a brain dump, leave it as a brain dump.
- Don't remove literary/cross-domain references because they seem tangential. They're core to the voice.
- Don't add polish that makes it sound corporate or committee-written. If it sounds like a LinkedIn post, burn it down.
- Don't pre-load emojis. Marshall places them intentionally.
- Don't hedge on things Marshall is direct about, and don't add false confidence to things he's genuinely exploring.
- Don't smooth out the rhythm into standard prose. If a sentence is three words, leave it at three words.
- No em dashes. Ever. They're an AI tell. Use commas, periods, parentheses, or spaced dashes instead.

## Worklog

`worklog.md` tracks what happened each session and what's next. Read it at the start of every session for context. It's updated automatically via a Stop hook, but if you notice it's stale, update it.

## Content Pipeline

Ideas move through three stages. Never skip ahead.

1. **`_ideas/writing/`** - kernels and brainstorming. Raw, unformed, evolving.
2. **`_drafts/`** - working drafts. Not published by Jekyll. Marinate here. Preview locally with `bundle exec jekyll serve --drafts`.
3. **`_posts/`** - published. Only move a draft here when Marshall explicitly says it's ready to publish.

**Never create files directly in `_posts/` for new writing.** Start in `_ideas/`, develop into `_drafts/`, publish to `_posts/` only on Marshall's say-so.

## Other Idea Buckets

These are separate from the writing pipeline - don't mix them.

- **`_ideas/tools/`** - apps and tools to build. Personal dev tools, writing aids, automation. Not published content, not site improvements.
- **`_ideas/site/`** - improvements to the site itself (UX, features, metadata, design).

## Git Workflow

Solo personal site. Commit directly to main.
