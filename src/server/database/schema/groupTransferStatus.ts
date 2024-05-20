import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// seeded item
export const groupTransferStatus = sqliteTable('groupTransferStatus', {
  id: text('id').primaryKey(),
  status: text('status').notNull(),
});
