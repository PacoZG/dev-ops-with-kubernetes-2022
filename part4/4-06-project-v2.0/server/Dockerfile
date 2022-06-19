FROM node:18-alpine3.14

WORKDIR /server

COPY package.json package.json
COPY server.js server.js
COPY public public
COPY prisma prisma

RUN yarn install

ENV PORT ${PORT}
ENV CLIENT_URL ${CLIENT_URL}
ENV DATABASE_URL ${DATABASE_URL}

CMD npx prisma migrate deploy && yarn start