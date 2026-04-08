# syntax=docker/dockerfile:1.7

# ---- Build stage: compile the Jekyll site ----
FROM ruby:3.3-slim AS build

WORKDIR /src

# Native gems (nokogiri, ffi, sass-embedded, etc.) need a toolchain.
# git is required by jekyll-remote-theme to fetch minimal-mistakes.
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential \
      git \
    && rm -rf /var/lib/apt/lists/*

# Install gems first so this layer caches when only content changes.
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local without 'development test' \
 && bundle install --jobs 4 --retry 3

# Copy the rest of the source and build.
COPY . .
RUN bundle exec jekyll build --trace

# ---- Serve stage: tiny Caddy image serving the static output ----
FROM caddy:2-alpine

COPY --from=build /src/_site /srv
COPY Caddyfile /etc/caddy/Caddyfile

# Railway injects $PORT; Caddyfile reads it. Default 8080 for local runs.
ENV PORT=8080
EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
