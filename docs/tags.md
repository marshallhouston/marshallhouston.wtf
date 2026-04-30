# Tag taxonomy

Two axes. 1-5 tags per post. List lives in `src/content.config.ts` (`TOPIC_TAGS`, `MODE_TAGS`). Build fails on tags outside taxonomy.

## Topic (what the post is about)

- `claude-code` — claude code, skills, plugins, agentic workflows
- `mental-models` — frameworks, abstractions, ways of seeing
- `ai-culture` — industry, norms, the discourse
- `talks` — talk transcripts / writeups
- `debugging` — debugging, sensemaking, mental experimentation
- `writing` — writing process, the craft
- `creative-expression` — making, voice, aesthetic

## Mode (how the post reads)

- `workflow` — how-to, process, system being shared
- `critique` — pushback, opinion, calling something out
- `ruminating` — reflective, exploratory, low-conclusion
- `unhinged` — high-energy, satirical, off-normal register

## Adding / renaming a tag

Before adding, ask:

1. Will 3+ posts use it within 6 months? Singletons rot.
2. Is it a new axis or already covered? Don't blur axes.
3. Can existing tag carry the load? Default = no new tag.

To add: edit `TOPIC_TAGS` or `MODE_TAGS` in `src/content.config.ts`. To rename: change the constant + run sed across `src/content/posts/*.md`. To remove: delete from constant, build will surface posts using it.
