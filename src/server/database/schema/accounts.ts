import { sqliteTable, text, numeric } from 'drizzle-orm/sqlite-core';
import { items } from './items';
import { accountType } from './accountType';
import { currencyCode } from './currencyCode';

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  institutionId: text('institution_id').notNull(),
  itemId: text('item_id')
    .references(() => items.id, { onDelete: 'cascade' })
    .notNull(),
  accountTypeId: text('account_type_id').references(() => accountType.id),
  balance: numeric('balance').notNull(),
  currencyCodeId: text('currency_code_id').references(() => currencyCode.id),
});
