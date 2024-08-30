import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { groupTransactionToUsersToGroups } from "./groupTransactionToUsersToGroups";
import { receiptLineItem } from "./receiptLineItem";

export const receiptLineItemToGroupTransaction = sqliteTable(
  "receiptLineItemToGroupTransaction",
  {
    id: text("id").primaryKey(),
    receiptLineItemId: text("fk_receipt_line_item_id")
      .references(() => receiptLineItem.id)
      .notNull(),
    groupTransactionId: text("fk_group_transaction_id")
      .references(() => groupTransactionToUsersToGroups.id)
      .notNull(),
    amount: real("amount").notNull(),
  }
);
