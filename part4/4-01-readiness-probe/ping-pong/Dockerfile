FROM node:18-alpine3.14

WORKDIR /app

COPY package.json package.json
COPY index.js index.js
COPY prisma prisma

RUN yarn install

ENV PORT ${PORT}

CMD npx prisma migrate deploy && yarn start