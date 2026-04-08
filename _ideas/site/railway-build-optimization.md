---
title: railway build optimization
updated_at: 2026-04-08 03:46 MDT
---

captured 2026-04-08 right after the railway cutover. the cold build takes ~4 min and every push to main triggers one, even when the push changes zero bytes of the rendered site. two separate problems worth addressing, probably in one pass.

## problem 1: builds are slow

the long pole is `bundle install` of the `github-pages` meta-gem, which pins ~100 deps to github pages' exact environment. we're not on github pages anymore. the pin is pure cost.

### lever 1 (biggest): drop github-pages gem

replace in `Gemfile`:

```ruby
gem "github-pages", group: :jekyll_plugins
gem "jekyll-include-cache", group: :jekyll_plugins
```

with:

```ruby
gem "jekyll", "~> 4.3"
gem "jekyll-remote-theme"
gem "jekyll-feed"
gem "jekyll-sitemap"
gem "jekyll-include-cache"
```

then `bundle install` locally, commit the new `Gemfile.lock`, push.

expected: cold build ~4 min → ~60-90 sec. also unlocks newer jekyll (faster builds, fewer deprecations).

### lever 2: bundler cache mount in Dockerfile

```dockerfile
RUN --mount=type=cache,target=/usr/local/bundle \
    bundle install --jobs 4 --retry 3
```

persists gem cache across builds even when the docker layer gets invalidated. safety net for gemfile tweaks.

### lever 3: vendor the remote theme

`jekyll-remote-theme` fetches `mmistakes/minimal-mistakes` from github every build. vendoring as a git submodule under `vendor/theme/` saves ~5-10s and removes a network dependency. small but steady.

### lever 4: jekyll incremental build + cache mount

```dockerfile
RUN --mount=type=cache,target=/src/.jekyll-cache \
    bundle exec jekyll build --incremental
```

reuses prior build artifacts for unchanged pages. works well once warm.

### do NOT do

- alpine base image — musl vs glibc breaks native gems
- pre-built `jekyll/jekyll` image — loses ruby version control
- `--jobs 16+` — diminishing returns, can thrash railway build workers

### expected combined results (levers 1 + 2)

- cold: ~4 min → ~60-90 sec
- warm (content-only change): ~4 min → ~30-45 sec

## problem 2: every push rebuilds, even no-op ones

railway's default is "rebuild on every push to main." it doesn't know which files affect the output. a commit touching `_ideas/**` or `worklog.md` triggers the same rebuild as a commit touching `_posts/**`.

### fix: configure watch paths

in railway service → Settings → Source → Watch Paths. railway only rebuilds when files matching the listed globs change.

suggested pattern list (positive-include, everything else ignored):

```
_config.yml
_posts/**
_pages/**
_layouts/**
_includes/**
_data/**
_kernels/**
assets/**
index.html
comparison.html
favicon.svg
robots.txt
llms.txt
Gemfile
Gemfile.lock
Dockerfile
Caddyfile
.dockerignore
```

### caveat

watch paths is positive-include only. forgetting a pattern means "changes to that file silently don't deploy." first-time trap: double-check the list, especially `_posts/**`.

### side effects

- commits that only touch worklog/ideas/drafts → no railway build, no build minutes consumed, no noise in deploy history
- faster "oh i added a kernel" loop (no 4-min wait)
- cleaner deploy timeline — every entry represents a real content change

## order of operations

1. watch paths first (5 min, reversible, no code change) — immediately stops the noise
2. then gem migration + Dockerfile cache mounts in one branch — validate locally, push, watch the first build, measure
3. vendor theme + incremental build as follow-ups if still not fast enough

## open questions

- does railway honor `[skip ci]` in commit messages? (if yes, that's an escape hatch for one-off noop commits without editing watch paths)
- is there a way to see per-step timings in railway build logs to validate where time goes?
