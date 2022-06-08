FROM ubuntu

WORKDIR /job

COPY create-daily-todo.sh create-daily-todo.sh

RUN apt-get update -y && apt-get install -y curl

ENV SERVER_URL ${SERVER_URL}

CMD ./create-daily-todo.sh