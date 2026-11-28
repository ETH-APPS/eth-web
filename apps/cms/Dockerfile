FROM node:24-slim AS build
WORKDIR /repo

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile --filter cms...
RUN pnpm --filter cms build

FROM node:24-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY --from=build --chown=node:node /repo/apps/cms/.output ./.output

USER node

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
