import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { transactionReceipt } from "./transactionReceipt";

export const receiptsToItems = sqliteTable("receiptsToItems", {
  id: text("id").primaryKey(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  costPerItem: real("cost_per_item").notNull(), 
    transactionReceiptId: text("fk_transaction_receipt_id")
    .references(() => transactionReceipt.id, { onDelete: "cascade" })
    .notNull(),
});
