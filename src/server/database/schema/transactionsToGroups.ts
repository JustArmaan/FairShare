import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { groups } from './group';
import { transactions } from './transaction';

export const transactionsToGroups = sqliteTable('transactionsToGroups', {
  id: text('id').primaryKey(),
  groupsId: text('group_id') // TODO:maybe change groups to groupId - but i dont want to break anything
    .references(() => groups.id, { onDelete: 'cascade' })
    .notNull(),
  transactionId: text('transaction_id')
    .references(() => transactions.id, { onDelete: 'cascade' })
    .notNull(),
});
