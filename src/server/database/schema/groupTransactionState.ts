import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { transactionsToGroups } from "./transactionsToGroups";

export const transactionState = sqliteTable("transactionState", {
  id: text("id").primaryKey(),
  groupTransactionId: text("fk_group_transaction_id")
    .references(() => transactionsToGroups.id, { onDelete: "cascade" })
    .notNull(),
  pending: integer("pending", { mode: "boolean" }),
});
