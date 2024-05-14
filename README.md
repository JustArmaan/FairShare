# BETH Stack + Tailwind

## Motivation

A minimal tech stack focused on productivity, simplicity and an awesome developer experience.

Inspired by: [beth-stack](https://www.youtube.com/watch?v=cpzowDDJj24&ab_channel=EthanNiser)

## Quickstart

### Setup your .env file

A template .env-template is provided for you that should be filled in.

**.env-template**

```bash
IS_DEV=TRUE
DB_URL= # live turso connection string, can be ignored if not using turso
AUTH_TOKEN=  # for connecting to turso, same as above
LOCAL_DB_URL= # ./database.db (you can run with just this for a while)
```

Rename `.env-template` to `.env`

If you choose not to use SQLite or the Turso Typescript SDK, feel free to ignore
the db related variables.

```
bun i
bun run dev
```

Your server should be up at `localhost:3000` 🚀

Elysia will auto-refresh your browser whenever bun detects a change while
running in dev mode.
