FROM node:26.8.1-slim AS build

WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y libssl-dev
RUN npm install --global corepack@latest \
    && corepack enable pnpm \
    && pnpm fetch --yes \
    && DOCKER_BUILDING=1 pnpm run db:generate \
    && DOCKER_BUILDING=1 pnpm build \
    && pnpm fetch --yes --prod

#######################################

FROM node:26.8.1-alpine

WORKDIR /app
RUN rm -rf ./*

COPY --from=build /app/build .
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/pnpm-workspace.yaml ./
RUN npm install --global corepack@latest \
    && corepack enable pnpm \
    && pnpm ci --yes
COPY --from=build /app/drizzle.config.ts .
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/src/lib/server/db src/lib/server/db
COPY --from=build /app/scripts ./scripts

RUN chmod +x scripts/start.sh
CMD [ "./scripts/start.sh" ]
