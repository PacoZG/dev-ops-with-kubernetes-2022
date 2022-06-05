FROM node:18-alpine3.14

WORKDIR /app

COPY package.json package.json
COPY index.js index.js

RUN yarn install

ENV PORT ${PORT}
ENV LOG_SERVER_URL ${LOG_SERVER_URL}
ENV PING_PONG_SERVER_URL ${PING_PONG_SERVER_URL}

CMD yarn start