import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "../schema/users";
import { groups } from "./group";
import { memberType } from "./memberType";
import { accounts } from "./accounts";

export const usersToGroups = sqliteTable("usersToGroups", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  groupId: text("group_id")
    .references(() => groups.id, { onDelete: "cascade" })
    .notNull(),
  memberTypeId: text("member_type_id")
    .references(() => memberType.id)
    .notNull(),
  depositAccountId: text("deposit_account_id").references(() => accounts.id),
});
