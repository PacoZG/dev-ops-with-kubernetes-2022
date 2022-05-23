FROM node:18-alpine3.14

WORKDIR /app

COPY package.json package.json
COPY index.js index.js

ENV WRITE_PATH ${WRITE_PATH}

CMD yarn start