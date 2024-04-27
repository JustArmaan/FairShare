import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const isDev = process.env.IS_DEV;

const url = isDev ? process.env.LOCAL_DB_URL : process.env.DB_URL;
if (!url) throw new Error('Missing db url env variable');

const authToken = process.env.AUTH_TOKEN;
if (!authToken && !isDev) throw new Error('Missing db auth token env variable');

export const config = {
  url,
  authToken,
};

const client = createClient(isDev ? { ...config, url: `file:${url}` } : config);

export const db = drizzle(client);
