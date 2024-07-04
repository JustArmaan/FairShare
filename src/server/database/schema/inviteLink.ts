import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersToGroups } from "./usersToGroups";
import { sql } from "drizzle-orm";

export const inviteShareLink = sqliteTable("inviteShareLink", {
  id: text("id").primaryKey(),
  usersToGroupsId: text("users_to_groups_id")
    .references(() => usersToGroups.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});
