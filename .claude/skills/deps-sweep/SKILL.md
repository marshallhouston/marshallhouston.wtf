---
name: deps-sweep
description: Quarterly dependency bump workflow. Buckets bun outdated into safe-batch / majors / exact-pinned / peer-held, opens one PR per bucket, ships each. Triggers /deps-sweep, "bump deps", "what needs to be bumped", "deps audit".
---

Adapted from the preach-hub skill of the same name. This is a static Astro site: no server, no runtime deps beyond the build, so "reachable in prod" almost always means "reachable at build time".

1. Run `bash .claude/skills/deps-sweep/scripts/deps-audit.sh`. Four buckets:
   - **SAFE BATCH** — patch/minor where update == latest. One PR for all.
   - **MAJORS** — latest major > current. One PR per dep, after the safe batch lands.
   - **EXACT-PINNED** — update < latest only because package.json pins exact (no `^`/`~`). Edit the pin; verify peers with `npm info <dep>@<latest> peerDependencies`. Own PR.
   - **PEER-HELD** — genuinely blocked on a peer dep. Follow-up after the core dep lands.

1b. **Run `bun audit`.** `bun outdated` only sees direct deps; it is blind to a current direct dep dragging a vulnerable transitive tree. Nearly every advisory here sits under `astro` (vite, sharp, svgo, yaml, esbuild). Triage:
   - Build-time only, trusted input (our own markdown/images) → note it, no action.
   - Windows-only advisories are not exposures here (macOS dev, Linux CI).
   - Fix by bumping the *parent* — an astro bump moves the whole tree. Re-run `bun audit` after the safe batch and re-triage what's left.

2. **Safe batch PR.** Branch off main. `bun update <name> ...` for every dep in the batch. Verify: `bunx astro check` + `bun run build` + `bun run test` (Playwright). If one dep breaks the build, hold that dep, ship the rest, file a follow-up.

3. **Each major, separately.** Branch per dep. Before bumping, grep usage: `grep -rn "<dep-name>" src scripts astro.config.mjs`. Zero importers → delete the dep instead of migrating. Astro majors: read the upgrade guide, run `bunx @astrojs/upgrade`, expect config + content-collection API churn.

4. **Ship each PR.** `gh pr merge <pr> --squash`, delete branch. Verify prod: `curl -s -o /dev/null -w "%{http_code}\n" https://marshallhouston.wtf` → 200, and spot-check a post page renders.

5. **Final check.** `bun outdated` empty or majors-only. `bun audit` count down to the noted build-time-only set.

## Notes

- **Astro is the whole tree.** mdx/rss/sitemap/check are peers of astro; bump astro first, then the integrations, or peer resolution fights you.
- **Playwright bumps need `bunx playwright install`** after the version change or tests fail on a missing browser.
- **No Dependabot.** Manual judgment beats bot noise.
- **PR scope discipline.** Safe batch = one PR. Majors = separate.
