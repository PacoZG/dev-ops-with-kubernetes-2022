#!/bin/sh

echo Posting the new TODO to $SERVER_URL
URL=$(curl -w "%{url_effective}\n" -I -L -s -S https://en.wikipedia.org/wiki/Special:Random -o /dev/null)
echo Generated random wikipedia URL: $URL
curl -X POST -H "Content-Type: application/json" -d '{"message": "Read '${URL}'"}' $SERVER_URL/todos
