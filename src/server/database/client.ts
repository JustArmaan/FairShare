import { LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from "../../../env"

const isDev = env.isDev;

const url = isDev ? env.localDb : process.env.VITE_DB_URL;
if (!url) throw new Error('Missing db url env variable');



const authToken = process.env.VITE_AUTH_TOKEN;
if (!authToken && !isDev) throw new Error('Missing db auth token env variable');

export const config = {
  url,
  authToken,
};

const client = createClient(isDev ? { ...config, url: `file:${url}` } : config);

let dbSingleton: LibSQLDatabase | undefined;

export const getDB = () => {
  return (dbSingleton ??= drizzle(client));
};