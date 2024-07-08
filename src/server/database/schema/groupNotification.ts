import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { usersToGroups } from "./usersToGroups";
import { notifications } from "./notifications";

export const groupNotification = sqliteTable("groupNotification", {
  id: text("id").primaryKey(),
  notificationId: text("notification_id")
    .references(() => notifications.id, { onDelete: "cascade" })
    .notNull(),
  userGroupId: text("user_group_id")
    .references(() => usersToGroups.id, { onDelete: "cascade" })
    .notNull(),
});
