FROM node:18-alpine3.14

WORKDIR /server

COPY package.json package.json
COPY server.js server.js
COPY index.html index.html
COPY public public

RUN yarn install

ENV PORT ${PORT}
ENV VERSION ${VERSION}

CMD yarn start