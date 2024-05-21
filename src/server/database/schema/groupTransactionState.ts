import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { transactionsToGroups } from './transactionsToGroups';

export const groupTransactionState = sqliteTable('groupTransactionState', {
  id: text('id').primaryKey(),
  groupTransactionId: text('group_transaction_id')
    .references(() => transactionsToGroups.id, { onDelete: 'cascade' })
    .notNull(),
  pending: integer('pending', { mode: 'boolean' }),
});
