import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { usersToGroups } from './usersToGroups';
import { transactionState } from './groupTransactionState';

export const groupTransactionToUsersToGroups = sqliteTable(
  'groupTransactionToUsersToGroups',
  {
    id: text('id').primaryKey(),
    amount: real('amount').notNull(),
    groupTransactionStateId: text('transactions_to_groups_id')
      .references(() => transactionState.id, { onDelete: 'cascade' })
      .notNull(),
    usersToGroupsId: text('users_to_groups_id')
      .references(() => usersToGroups.id)
      .notNull(),
  }
);
