import type { Config } from "drizzle-kit";
import { config } from "./src/server/database/client";

const isDev = process.env.VITE_IS_DEV;

export default {
  schema: "./src/server/database/schema/*",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: config,
} satisfies Config;
