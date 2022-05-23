FROM node:18-alpine3.14

WORKDIR /app

COPY package.json package.json
COPY index.js index.js

RUN yarn install

ENV READ_PATH ${READ_PATH}

CMD yarn start