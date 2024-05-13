import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  plaidAccessToken: text('plaid_access_token').notNull(),
  institutionId: text('institution_id').notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});
