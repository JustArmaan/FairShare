import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const splitType = sqliteTable('splitType', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
});
