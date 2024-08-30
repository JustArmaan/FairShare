import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { transactions } from "./transaction";

export const groupTransactionToUsersToGroupsStatus = sqliteTable(
  "groupTransactionToUsersToGroupsStatus",
  {
    id: text("id").primaryKey(),
    status: text("status").notNull(),
  }
);
