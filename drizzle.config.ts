import type { Config } from "drizzle-kit";
import { config } from "./src/server/database/client";

const isDev = process.env.IS_DEV;

export default {
  schema: "./src/server/database/schema/*",
  out: "./drizzle",
  driver: isDev ? "better-sqlite" : "turso",
  dbCredentials: config,
} satisfies Config;
