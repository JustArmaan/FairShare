import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { transactionsToGroups } from './transactionsToGroups';
import { splitType } from './splitType';

export const groupTransactionState = sqliteTable('groupTransactionState', {
  id: text('id').primaryKey(),
  groupTransactionId: text('group_transaction_id')
    .references(() => transactionsToGroups.id, { onDelete: 'cascade' })
    .notNull(),
  pending: integer('pending', { mode: 'boolean' }),
  splitTypeId: text('split_type_id')
    .references(() => splitType.id)
    .notNull(),
});
