import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { notifications } from "./notifications";
import { usersToGroups } from "./usersToGroups";

export const groupInvite = sqliteTable("groupInvite", {
  id: text("id").primaryKey(),
  notificationId: text("notification_id")
    .references(() => notifications.id, { onDelete: "cascade" })
    .notNull(),
  userGroupId: text("fk_user_group_id")
    .references(() => usersToGroups.id, { onDelete: "cascade" })
    .notNull(),
});
