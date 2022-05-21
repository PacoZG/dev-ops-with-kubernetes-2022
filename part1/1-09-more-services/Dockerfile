FROM node:18-alpine3.14

WORKDIR /app

RUN adduser -S appuser

COPY --chown=appuser package.json package.json
COPY --chown=appuser index.js index.js

RUN yarn install

USER appuser

CMD yarn start