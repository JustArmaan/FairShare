import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { notificationType } from "./notificationType";

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  notificationTypeId: text("notification_type_id").references(
    () => notificationType.id
  ),
  message: text("message").notNull(),
  timestamp: text("timestamp").notNull(),
  readStatus: integer("read_status", { mode: "boolean" }),
});
