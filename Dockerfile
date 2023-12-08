FROM node:18.16.0-slim AS build

WORKDIR /app
COPY . .
RUN npm install
RUN ./_tools/patch-perfect-freehand.sh
RUN apt-get update && apt-get install -y libssl-dev
RUN npm run prisma:generate
RUN npm run build

#######################################

FROM node:18.16.0-alpine3.16

WORKDIR /app
RUN rm -rf ./*

COPY --from=build /app/package*.json ./
RUN npm install

COPY _tools/patch-perfect-freehand.sh ./_tools/patch-perfect-freehand.sh
RUN sh ./_tools/patch-perfect-freehand.sh

COPY --from=build /app/prisma ./prisma/
RUN npm run prisma:generate

COPY --from=build /app/build .
CMD [ "node", "index.js" ]