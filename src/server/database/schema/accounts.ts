import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { accountType } from './accountType';
import { currencyCode } from './currencyCode';

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  accountTypeId: text('account_type_id').references(() => accountType.id),
  currencyCodeId: text('currency_code_id').references(() => currencyCode.id),
});
