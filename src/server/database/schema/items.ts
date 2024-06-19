import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  plaidAccessToken: text("plaid_access_token").notNull(),
  institutionName: text("institution_name").notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  nextCursor: text("next_cursor"),
});
