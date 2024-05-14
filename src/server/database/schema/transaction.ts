import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { categories } from '../schema/category';
import { accounts } from './accounts';

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .references(() => accounts.id, { onDelete: 'cascade' })
    .notNull(),
  categoryId: text('category_id')
    .references(() => categories.id, { onDelete: 'cascade' })
    .notNull(),
  company: text('company'),
  amount: real('amount').notNull(),
  timestamp: text('timestamp'),
  address: text('address'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  pending: integer('id', { mode: 'boolean' }),
});
