import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersToGroups } from "./usersToGroups";

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userGroupId: text("fk_user_group_id")
  .references(() => usersToGroups.id, { onDelete: "cascade" })
  .notNull(),
  message: text('message').notNull(),
  timestamp: text('timestamp').notNull(),
});
