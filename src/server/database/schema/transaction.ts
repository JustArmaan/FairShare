import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { categories } from "../schema/category";
import { accounts } from "./accounts";

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .references(() => accounts.id, { onDelete: "cascade" })
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
