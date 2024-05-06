import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { categories } from "../schema/category";
import { users } from "../schema/users";

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: text("category_id")
    .references(() => categories.id, { onDelete: "cascade" })
    .notNull(),
  company: text("company").notNull(),
  amount: real("amount").notNull(),
  timestamp: text("timestamp").notNull(),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
});
