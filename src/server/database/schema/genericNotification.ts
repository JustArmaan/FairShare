import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { notifications } from "./notifications";
import { users } from "./users";

export const genericNotification = sqliteTable("genericNotification", {
  id: text("id").primaryKey(),
  notificationId: text("notification_id")
    .references(() => notifications.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  icon: text("icon").notNull(),
  message: text("message").notNull(),
});
