FROM node:18-alpine3.14

WORKDIR /server

COPY package.json package.json
COPY server.js server.js

RUN yarn install

ENV NATS_SERVER_URL ${NATS_SERVER_URL}
ENV TICK_INTERVAL ${TICK_INTERVAL}
ENV DISCORD_TOKEN ${DISCORD_TOKEN}

CMD yarn start