# syntax=docker/dockerfile:1.7

# ---- Build stage: compile the Astro site ----
FROM oven/bun:1.3.13-alpine AS build

WORKDIR /src

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# ---- Serve stage: tiny Caddy image serving the static output ----
FROM caddy:2-alpine

COPY --from=build /src/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

# Railway injects $PORT; Caddyfile reads it. Default 8080 for local runs.
ENV PORT=8080
EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
