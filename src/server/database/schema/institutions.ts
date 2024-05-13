import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const institutions = sqliteTable('institutions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});
