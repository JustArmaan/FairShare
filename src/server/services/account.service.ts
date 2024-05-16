import { eq } from 'drizzle-orm';
import { getDB } from '../database/client';
import { accounts } from '../database/schema/accounts';
import { type ExtractFunctionReturnType } from './user.service';

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
