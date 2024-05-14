import { getDB } from "../database/client.ts";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { items } from "../database/schema/items.ts";
import { institutions } from "../database/schema/institutions.ts";
import { accountType } from "../database/schema/accountType.ts";
import { users } from "../database/schema/users.ts";
import { currencyCode } from "../database/schema/currencyCode.ts";
import { accounts } from "../database/schema/accounts.ts";
import { type ArrayElement } from "../interface/types.ts";
import { type ExtractFunctionReturnType } from "./user.service.ts";

let db = getDB();

export const getItemsForUser = async (userId: string) => {
  try {
    const results = await db
      .select({ item: items })
      .from(users)
      .innerJoin(items, eq(users.id, items.userId))
      .where(eq(users.id, userId));

    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
};

type Item = ArrayElement<
  ExtractFunctionReturnType<typeof getItemsForUser>
>["item"];

export const addItemToUser = async (
  userId: string,
  item: Omit<Omit<Item, "userId">, "institutionId">
) => {
  try {
    const newItem = await db
      .insert(items)
      .values({
        userId: userId,
        ...item,
      })
      .returning();
    return newItem;
  } catch (error) {
    console.error(error);
  }
};

export async function getItem(id: string) {
  try {
    const result = await db.select().from(items).where(eq(items.id, id));
    return result[0];
  } catch (error) {
    console.error(error);
  }
}

export async function addInstitution(id: string, name: string) {
  try {
    const newInstitution = await db
      .insert(institutions)
      .values({ id, name })
      .returning();
    return newInstitution;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getInstitution = async (id: string) => {
  try {
    const results = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, id));
    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export async function createAccountType(type: string, subType: string) {
  try {
    const newAccountType = await db
      .insert(accountType)
      .values({ id: uuidv4(), type, subtype: subType })
      .returning();
    return newAccountType;
  } catch (error) {
    console.error(error);
  }
}

export async function getAccountType(id: string) {
  try {
    if (!id) throw new Error("Missing required field");

    const result = await db
      .select()
      .from(accountType)
      .where(eq(accountType.id, id));
    return result[0];
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

export async function getCurrencyCode(id: string) {
  try {
    const result = await db
      .select()
      .from(currencyCode)
      .where(eq(currencyCode.id, id));
    return result[0];
  } catch (error) {
    console.error(error);
  }
}

export type AccountSchema = ExtractFunctionReturnType<typeof getAccount>;

export async function createAccount(account: AccountSchema) {
  try {
    Object.keys(account).forEach((key) => {
      if (!account[key as keyof typeof account]) {
        throw new Error("Missing required field");
      }
    });

    if (!account.accountTypeId) {
      throw new Error("Account type ID not found");
    }

    const accountType = await getAccountType(account.accountTypeId);
    const item = await getItem(account.itemId);
    const currencyCode = account.currencyCodeId
      ? await getCurrencyCode(account.currencyCodeId)
      : null;

    if (!accountType || !item) {
      throw new Error("Account type or item not found");
    }

    if (!item) {
      throw new Error("Item not found");
    }

    if (!currencyCode) {
      throw new Error("Currency code not found");
    }

    const newAccount = await db
      .insert(accounts)
      .values({
        id: uuidv4(),
        name: account.name,
        institutionId: account.institutionId,
        itemId: item.id,
        accountTypeId: accountType.id,
        balance: account.balance,
        currencyCodeId: currencyCode.id,
      })
      .returning();
    return newAccount;
  } catch (error) {
    console.error(error);
  }
}

export async function getAccount(id: string) {
  try {
    const account = await db.select().from(accounts).where(eq(accounts.id, id));
    return account[0];
  } catch (error) {
    console.error(error);
  }
}
