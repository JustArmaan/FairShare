import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notificationType = sqliteTable("notificationType", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
});
