FROM node:24-slim AS build
WORKDIR /repo

RUN apt-get update \
  && apt-get install --yes --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile --filter api...
RUN pnpm --filter api build
RUN pnpm --filter api deploy --prod /prod/api

FROM build AS migration
WORKDIR /repo/apps/api

USER node

CMD ["pnpm", "db:migrate:deploy"]

FROM node:24-slim AS runtime
WORKDIR /app

RUN apt-get update \
  && apt-get install --yes --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build --chown=node:node /prod/api ./

USER node

EXPOSE 3001
CMD ["node", "dist/main.js"]
