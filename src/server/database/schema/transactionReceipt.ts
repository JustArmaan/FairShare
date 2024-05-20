import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { transactionState } from "./groupTransactionState";
import { transactions } from "./transaction";

export const transactionReceipt = sqliteTable("transactionReceipt", {
  id: text("id").primaryKey(),
  groupTransactionStateId: text("fk_group_transaction_state_id")
    .references(() => transactionState.id, { onDelete: "cascade" })
    .notNull(),
  transactionId: text("fk_transaction_id")
    .references(() => transactions.id)
    .notNull(),
});
