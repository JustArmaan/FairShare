import { sqliteTable, text, numeric } from "drizzle-orm/sqlite-core";
import { items } from "./items";
import { accountType } from "./accountType";
import { currencyCode } from "./currencyCode";
import { accounts } from "./accounts";

export const plaidAccount = sqliteTable("plaidAccount", {
  id: text("id").primaryKey(),
  balance: numeric("balance"),
  currencyCodeId: text("currency_code_id").references(() => currencyCode.id),
  accountTypeId: text("account_type_id").references(() => accountType.id),
  itemId: text("item_id")
    .references(() => items.id, { onDelete: "cascade" })
    .notNull(),
  accountsId: text("accounts_id")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),
});
