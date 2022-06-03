FROM node:18-alpine3.14

WORKDIR /server

COPY package.json package.json
COPY server.js server.js
COPY public public

RUN yarn install

ENV PORT ${PORT}
ENV CLIENT_URL ${CLIENT_URL}

CMD yarn start