import type { Config } from 'drizzle-kit';
import { config } from './src/server/database/client';
import { env } from './env';

export default {
  dialect: 'sqlite',
  schema: './src/server/database/schema/*',
  out: './drizzle',
  // driver: 'turso',
  driver: env.isDev ? undefined : 'turso',
  dbCredentials: config,
} satisfies Config;
