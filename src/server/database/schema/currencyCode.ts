import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const currencyCode = sqliteTable('currency_code', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
});
