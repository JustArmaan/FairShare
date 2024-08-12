import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { usersToGroups } from "./usersToGroups";
import { receiptLineItem } from "./receiptLineItem";

export const usersToItems = sqliteTable("usersToItems", {
  id: text("id").primaryKey(),
  itemsToUserId: text("items_to_user_id")
    .references(() => receiptLineItem.id, { onDelete: "cascade" })
    .notNull(),
  usersToGroupId: text("users_to_group_id")
    .references(() => usersToGroups.id, { onDelete: "cascade" })
    .notNull(),
  percentShare: real("percent_share").notNull(),
});
