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

COPY --from=build /app/package*.json ./
COPY drizzle.config.ts .
COPY drizzle .
COPY src/lib/server/db src/lib/server/db
RUN npm install

RUN DOCKER_BUILDING=1 npm run db:generate

COPY --from=build /app/build .
CMD [ "node", "index.js" ]