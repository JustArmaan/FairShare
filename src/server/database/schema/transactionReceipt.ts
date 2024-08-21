import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { transactions } from "./transaction";
import { groups } from "./group";

export const transactionReceipt = sqliteTable("transactionReceipt", {
  id: text("id").primaryKey(),
  transactionId: text("fk_transaction_id").references(() => transactions.id),
  groupId: text("fk_group_id").references(() => groups.id),
  total: real("total").notNull(),
  subtotal: real("subtotal").notNull(),
  phone: text("phone").notNull(),
  storeAddress: text("store_address").notNull(),
  storeName: text("store_name").notNull(),
  tax: real("tax").notNull(),
  tips: real("tips").notNull(),
  timestamp: text("timestamp"),
  discount: real("discount").notNull(),
});
