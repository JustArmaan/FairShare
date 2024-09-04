import { eq } from "drizzle-orm";
import { getDB } from "../database/client";
import { accounts } from "../database/schema/accounts";
import { type ExtractFunctionReturnType } from "./user.service";
import { items } from "../database/schema/items";
import { users } from "../database/schema/users";
import { plaidAccount } from "../database/schema/plaidAccount";
import { cashAccount } from "../database/schema/cashAccount";
import { transactions } from "../database/schema/transaction";

const db = getDB();

export async function addAccount(account: AccountDetails) {
  const result = await db.insert(accounts).values(account).returning();
  return result[0];
}

export async function getItemFromAccountId(id: string) {
  const result = await db
    .select({ item: items })
    .from(accounts)
    .innerJoin(plaidAccount, eq(accounts.id, plaidAccount.accountsId))
    .innerJoin(items, eq(plaidAccount.itemId, items.id))
    .where(eq(accounts.id, id));
  return result[0];
}

export async function addPlaidAccount(account: PlaidAccount) {
  await db.insert(plaidAccount).values(account);
}

export async function updatePlaidAccount(
  id: string,
  account: Omit<Partial<PlaidAccount>, "id">
) {
  await db.update(plaidAccount).set(account).where(eq(plaidAccount.id, id));
}

export type Account = ExtractFunctionReturnType<typeof getAccount>;
export type PlaidAccount = ExtractFunctionReturnType<typeof getPlaidAccount>;
export type AccountDetails = ExtractFunctionReturnType<
  typeof getAccountDetails
>;

export async function getPlaidAccount(accountId: string) {
  const results = await db
    .select()
    .from(plaidAccount)
    .where(eq(plaidAccount.accountsId, accountId));
  return results[0];
}

async function getAccountDetails(id: string) {
  const results = await db.select().from(accounts).where(eq(accounts.id, id));
  return results[0];
}

export async function getAccount(accountId: string) {
  const results = await db
    .select()
    .from(accounts)
    .innerJoin(plaidAccount, eq(accounts.id, plaidAccount.accountsId))
    .where(eq(accounts.id, accountId));
  const mappedResults = results.map((result) => {
    return {
      id: result.accounts.id,
      name: result.accounts.name,
      accountTypeId: result.plaidAccount.accountTypeId,
      balance: result.plaidAccount.balance,
      currencyCodeId: result.plaidAccount.currencyCodeId,
      itemId: result.plaidAccount.itemId,
    };
  });

  return mappedResults[0];
}

export async function getCashAccount(accountId: string) {
  const results = await db
    .select()
    .from(accounts)
    .innerJoin(cashAccount, eq(accounts.id, cashAccount.account_id))
    .where(eq(accounts.id, accountId));
  const mappedResults = results.map((result) => {
    return {
      id: result.accounts.id,
      name: result.accounts.name,
    };
  });
  return mappedResults[0];
}

export type AccountWithItem = ExtractFunctionReturnType<
  typeof getAccountWithItem
>;

export async function getAccountWithItem(accountId: string) {
  const results = await db
    .select({ account: accounts, item: items, plaidAccount: plaidAccount })
    .from(accounts)
    .innerJoin(plaidAccount, eq(accounts.id, plaidAccount.accountsId))
    .innerJoin(items, eq(plaidAccount.itemId, items.id))
    .where(eq(accounts.id, accountId));
  return results.map((account) => ({
    ...account.account,
    item: account.item,
    plaidAccount: account.plaidAccount,
  }))[0];
}

export async function getAccountsWithItemsForUser(userId: string) {
  const results = await db
    .select({ account: accounts, item: items, plaidAccount: plaidAccount })
    .from(accounts)
    .innerJoin(plaidAccount, eq(accounts.id, plaidAccount.accountsId))
    .innerJoin(items, eq(plaidAccount.itemId, items.id))
    .where(eq(items.userId, userId));

  return results.map((account) => ({
    ...account.account,
    item: account.item,
    plaidAccount: account.plaidAccount,
  }));
}
export async function getUserInfoFromAccount(accountId: string) {
  const results = await db
    .select({ account: accounts, user: users })
    .from(accounts)
    .innerJoin(plaidAccount, eq(accounts.id, plaidAccount.accountsId))
    .innerJoin(items, eq(plaidAccount.itemId, items.id))
    .innerJoin(users, eq(users.id, items.userId))
    .where(eq(accounts.id, accountId));
  return results[0];
}

export async function getAccountIdByTransactionId(transactionId: string) {
  const result = await db
    .select({ accountId: accounts.id })
    .from(transactions)
    .innerJoin(accounts, eq(accounts.id, transactions.accountId))
    .where(eq(transactions.id, transactionId));

  return result[0].accountId;
}
