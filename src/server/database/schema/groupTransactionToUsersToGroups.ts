import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { usersToGroups } from "./usersToGroups";
import { groupTransactionState } from "./groupTransactionState";
import { groupTransactionToUsersToGroupsStatus } from "./groupTransactionToUsersToGroupStatus";
import { transactions } from "./transaction";

export const groupTransactionToUsersToGroups = sqliteTable(
  "groupTransactionToUsersToGroups",
  {
    id: text("id").primaryKey(),
    amount: real("amount").notNull(),
    groupTransactionStateId: text("group_transaction_state_id")
      .references(() => groupTransactionState.id, { onDelete: "cascade" })
      .notNull(),
    usersToGroupsId: text("users_to_groups_id")
      .references(() => usersToGroups.id, { onDelete: "cascade" })
      .notNull(),
    groupTransactionToUsersToGroupsStatusId: text(
      "group_transaction_to_users_to_groups_status_id"
    )
      .references(() => groupTransactionToUsersToGroupsStatus.id)
      .notNull(),
    linkedTransactionId: text("linked_transaction_id").references(
      () => transactions.id
    ),
  }
);
