FROM node:18-alpine3.14

WORKDIR /app

RUN adduser -S appuser

COPY --chown=appuser log-output.js log-output.js

USER appuser

CMD node log-output.js