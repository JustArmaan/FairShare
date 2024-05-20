import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// seeded item
export const groupTransferStatus = sqliteTable('group_transfer_status', {
  id: text('id').primaryKey(),
  status: text('status').notNull(),
});
