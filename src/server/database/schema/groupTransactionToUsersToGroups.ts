import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { usersToGroups } from './usersToGroups';
import { groupTransactionState } from './groupTransactionState';
import { splitType } from './splitType';

export const groupTransactionToUsersToGroups = sqliteTable(
  'groupTransactionToUsersToGroups',
  {
    id: text('id').primaryKey(),
    amount: real('amount').notNull(),
    groupTransactionStateId: text('group_transaction_state_id')
      .references(() => groupTransactionState.id, { onDelete: 'cascade' })
      .notNull(),
    usersToGroupsId: text('users_to_groups_id')
      .references(() => usersToGroups.id)
      .notNull(),
   
  }
);
