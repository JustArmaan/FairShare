import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { transactionsToGroups } from './transactionsToGroups';
import { usersToGroups } from './usersToGroups';

export const groupTransactionToUsersToGroups = sqliteTable(
  'groupTransactionToUsersToGroups',
  {
    id: text('id').primaryKey(),
    amount: real('amount').notNull(),
    transactionsToGroupsId: text('transactions_to_groups_id')
      .references(() => transactionsToGroups.id, { onDelete: 'cascade' })
      .notNull(),
    usersToGroupsId: text('users_to_groups_id')
      .references(() => usersToGroups.id)
      .notNull(),
  }
);
