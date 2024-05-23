import { eq } from 'drizzle-orm';
import { getDB } from '../database/client';
import { accounts } from '../database/schema/accounts';
import { type ExtractFunctionReturnType } from './user.service';
import { items } from '../database/schema/items';

const db = getDB();

export async function addAccount(account: Account) {
  try {
    await db.insert(accounts).values(account);
  } catch (error) {
    console.error(error, 'in addAccount');
  }
}

export type Account = ExtractFunctionReturnType<typeof getAccount>;

export async function getAccount(accountId: string) {
  try {
    const results = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId));
    return results[0];
  } catch (error) {
    console.error(error, 'in getAccount');
    return null;
  }
}

export type AccountWithItem = ExtractFunctionReturnType<
  typeof getAccountWithItem
>;

export async function getAccountWithItem(accountId: string) {
  try {
    const results = await db
      .select({ account: accounts, item: items })
      .from(accounts)
      .innerJoin(items, eq(accounts.itemId, items.id))
      .where(eq(accounts.id, accountId));
    return results.map((account) => ({
      ...account.account,
      item: account.item,
    }))[0];
  } catch (e) {
    console.log(e, 'in getAccountWithItem');
    return null;
  }
}

export async function getAccountsWithItemsForUser(userId: string) {
  try {
    const results = await db
      .select({ account: accounts, item: items })
      .from(accounts)
      .innerJoin(items, eq(accounts.itemId, items.id))
      .where(eq(items.userId, userId));

    return results.map((account) => ({
      ...account.account,
      item: account.item,
    }));
  } catch (e) {
    console.log(e, 'in getAccountsWithItemsForUser');
    return [];
  }
}
