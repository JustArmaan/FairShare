import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const accountType = sqliteTable('account_type', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
});
