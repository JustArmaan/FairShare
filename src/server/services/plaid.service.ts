import { getDB } from "../database/client.ts";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

let db = getDB();

export async function addItem(userId: string, plaidAccessToken: string) {
  try {
    const institution = await getInstitution(plaidAccessToken);
    const newItem = await db
      .insert(item)
      .values({
        id: uuidv4(),
        userId,
        plaidAccessToken,
        institutionId: institution.id,
      })
      .returning();

    return newItem;
  } catch (error) {
    console.log(error);
  }
}

export async function getItem(id: string) {
  try {
    const item = await db.select().from(item).where(eq(item.id, id));
  } catch (error) {
    console.error(error);
  }
}

export async function addInstitution(name: string) {
  try {
    const newInstitution = await db
      .insert(institution)
      .values({ id: uuidv4(), name })
      .returning();
    return newInstitution;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function getInstitution(plaidAccessToken: string) {
    try {
        const institution = await db.select().from(institution).where(eq(institution.plaidAccessToken, plaidAccessToken));
        return institution[0];
    } catch (error) {
        console.error(error);
    }
}

export async function createAccountType(type: string, subType: string) {
  try {
    const newAccountType = await db
      .insert(accountType)
      .values({ id: uuidv4(), type, subType })
      .returning();
    return newAccountType;
  } catch (error) {
    console.error(error);
  }
}

export async function getAccountType(id: string) {
  try {
    const accountType = await db
      .select()
      .from(accountType)
      .where(eq(accountType.id, id));
    return accountType[0];
  } catch (error) {
    console.error(error);
  }
}

export async function createCurrencyCode(code: string) {
  try {
    const newCurrencyCode = await db
      .insert(currencyCode)
      .values({ id: uuidv4(), code })
      .returning();
    return newCurrencyCode;
  } catch (error) {
    console.error(error);
  }
}

export function getCurrencyCode(id: string) {
  try {
    const currencyCode = await db
      .select()
      .from(currencyCode)
      .where(eq(currencyCode.id, id));
    return currencyCode[0];
  } catch (error) {
    console.error(error);
  }
}

export async function createAccount(
  name: string,
  accountTypeId: string,
  itemId: string,
  balance: number,
  currencyCodeId: string
) {
  try {
    const accountType = await getAccountType(accountTypeId);
    const item = await getItem(itemId);
    const currencyCode = await getCurrencyCode(currencyCodeId);

    const newAccount = await db.insert(account).values({
        id: uuidv4(),
        name,
        accountType.id,
        item.id,
        balance,
        currencyCode.id,
        });
    return newAccount;
  } catch (error) {
    console.error(error);
  }
}

export function getAccount(id: string) {
    try {
        const account = await db.select().from(account).where(eq(account.id, id));
        return account[0];
    } catch (error) {
        console.error(error);
    }
}