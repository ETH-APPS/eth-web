# ---------- Tahap 1: build ----------
FROM node:24-slim AS build
WORKDIR /repo

# Corepack membaca "packageManager" di package.json,
# jadi versi pnpm di sini sama dengan di Mac.
RUN corepack enable

# Build context = root monorepo (lihat .dockerignore untuk yang dikecualikan).
COPY . .

# Instal hanya dependency milik "web", sesuai pnpm-lock.yaml persis.
RUN pnpm install --frozen-lockfile --filter web

RUN pnpm --filter web build

# ---------- Tahap 2: runtime ----------
FROM node:24-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Hanya hasil build; tidak ada source, node_modules, maupun .env.
COPY --from=build --chown=node:node /repo/apps/web/.output ./.output

# Jalan sebagai user non-root bawaan image (uid 1000).
USER node

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
