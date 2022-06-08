FROM node:18-alpine3.14

WORKDIR /client

ARG VITE_SERVER_URL ${VITE_SERVER_URL}

COPY package.json package.json
COPY index.html index.html
COPY server.js server.js
COPY tsconfig.json tsconfig.json
COPY tsconfig.node.json tsconfig.node.json
COPY vite.config.ts vite.config.ts
COPY ./src ./src

RUN yarn install && yarn build

ENV PORT ${PORT}

CMD yarn start