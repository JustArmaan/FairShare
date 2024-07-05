import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notificationType = sqliteTable("notification_type", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
});
