import { createClient } from '@libsql/client';

const isDev = process.env.IS_DEV;

const url = isDev ? process.env.LOCAL_DB_URL : process.env.DB_URL;
if (!url) throw new Error('Missing db url env variable');

const authToken = process.env.AUTH_TOKEN;
if (!authToken) throw new Error('Missing db auth token env variable');

const devConfig = {
  url,
};

const liveConfig = {
  ...devConfig,
  authToken,
};

export const client = createClient(isDev ? devConfig : liveConfig);
