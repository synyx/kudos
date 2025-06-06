FROM node:22.3.0-slim AS build

WORKDIR /app
COPY . .
RUN npm install
RUN apt-get update && apt-get install -y libssl-dev
RUN DOCKER_BUILDING=1 npm run db:generate
RUN DOCKER_BUILDING=1 npm run build

#######################################

FROM node:22.3.0-alpine3.19

WORKDIR /app
RUN rm -rf ./*

COPY --from=build /app/build .
COPY --from=build /app/package*.json ./
RUN npm install
COPY --from=build /app/drizzle.config.ts .
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/src/lib/server/db src/lib/server/db
COPY --from=build /app/scripts ./scripts

RUN DOCKER_BUILDING=1 npm run db:generate
RUN chmod +x scripts/start.sh
CMD [ "./scripts/start.sh" ]