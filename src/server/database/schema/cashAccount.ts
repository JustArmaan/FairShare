import { sqliteTable, text, numeric } from 'drizzle-orm/sqlite-core';
import { accounts } from './accounts';

export const cashAccount = sqliteTable('cashAccount', {
  id: text('id').primaryKey(),
  account_id: text('account_id').references(() => accounts.id, { onDelete: 'cascade'}).notNull(),
});
