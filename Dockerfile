FROM oven/bun

WORKDIR /usr/src/app


COPY package*.json bun.lockb ./

USER root
RUN apt-get update && apt-get install -y python3 python3-pip 

RUN bun remove better-sqlite3

RUN bun install
COPY . .

ENV NODE_ENV production

CMD [ "bun", "start" ]
