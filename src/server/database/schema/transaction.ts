import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { categories } from "../schema/category";
import { users } from "../schema/users";

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  company: text("company").notNull(),
  amount: real("amount").notNull(),
  timestamp: text("timestamp")
    .notNull()
    .default(sql`(current_timestamp)`),
});
