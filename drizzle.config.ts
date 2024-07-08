import type { Config } from "drizzle-kit";
import { config } from "./src/server/database/client";

export default {
  dialect: "sqlite",
  schema: "./src/server/database/schema/*",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: config,
} satisfies Config;
