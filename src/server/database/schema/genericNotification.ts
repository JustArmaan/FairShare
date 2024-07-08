import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { notifications } from "./notifications";

export const genericNotification = sqliteTable("genericNotification", {
  id: text("id").primaryKey(),
  notificationId: text("notification_id")
    .references(() => notifications.id, { onDelete: "cascade" })
    .notNull(),
  icon: text("icon"),
});
