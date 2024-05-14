import { getDB } from '../database/client.ts';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { items } from '../database/schema/items.ts';
import { institutions } from '../database/schema/institutions.ts';
import { users } from '../database/schema/users.ts';
import { currencyCode } from '../database/schema/currencyCode.ts';
import { type ArrayElement } from '../interface/types.ts';
import { type ExtractFunctionReturnType } from './user.service.ts';

const db = getDB();

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

export type Item = ArrayElement<
  ExtractFunctionReturnType<typeof getItemsForUser>
>['item'];

export const addItemToUser = async (
  userId: string,
  item: Omit<Omit<Item, 'userId'>, 'institutionId'>
) => {
  await db.insert(items).values({
    userId: userId,
    ...item,
  });
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

export async function createCurrencyCode(code: string) {
  try {
    await db.insert(currencyCode).values({ id: uuidv4(), code });
  } catch (error) {
    console.error(error);
  }
}

export async function updateItem(
  itemId: string,
  item: Partial<Omit<Item, 'id'>>
) {
  await db.update(items).set(item).where(eq(items.id, itemId));
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
