FROM node:18-alpine3.14

WORKDIR /server

RUN adduser -S appuser

COPY --chown=appuser package.json package.json
COPY --chown=appuser server.js server.js
COPY --chown=appuser index.html index.html

RUN yarn install

USER appuser

ENV PORT ${PORT}

CMD yarn start