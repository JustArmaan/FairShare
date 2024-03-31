import type { Config } from 'drizzle-kit';
import { config } from './src/database/client';

const isDev = process.env.IS_DEV;

export default {
  schema: './src/database/schema/*.ts',
  out: './drizzle',
  driver: isDev ? 'better-sqlite' : 'turso',
  dbCredentials: config,
} satisfies Config;
