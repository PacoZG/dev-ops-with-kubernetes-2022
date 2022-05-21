FROM node:18-alpine3.14

WORKDIR /app

RUN adduser -S appuser

COPY --chown=appuser package.json package.json
COPY --chown=appuser index.js index.js

USER appuser

ENV WRITE_PATH ${WRITE_PATH}

CMD yarn start