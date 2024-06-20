import { sqliteTable, text, numeric } from 'drizzle-orm/sqlite-core';
import { accounts } from './accounts';
import { users } from './users';

export const cashAccount = sqliteTable('cashAccount', {
  id: text('id').primaryKey(),
  account_id: text('account_id').references(() => accounts.id, { onDelete: 'cascade'}).notNull(), // chnage to accountId
  userId: text('userId').references(() => users.id, { onDelete: 'cascade'}).notNull(),
});
