import { getDB } from '../database/client';
import { items } from '../database/schema/items';
import { users } from '../database/schema/users';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { type ArrayElement } from '../interface/types';
import { institutions } from '../database/schema/institutions';

const db = getDB();

export const findUser = async (id: string) => {
  try {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createUser = async (user: Omit<User, 'createdAt'>) => {
  try {
    const newUser = await db.insert(users).values({
      ...user,
    });
    return newUser;
  } catch (err) {
    console.log('failed to create user');
    console.error(err);
  }
};

// gets the return type, makes it not a promise and not null
type User = ExtractFunctionReturnType<typeof findUser>;

export type ExtractFunctionReturnType<T extends (...args: any[]) => any> =
  NonNullable<Awaited<ReturnType<T>>>;

// partial makes all fields of type optional
export const updateUser = async (
  id: string,
  newFields: Partial<Omit<User, 'id'>>
) => {
  try {
    await db.update(users).set(newFields).where(eq(users.id, id));
  } catch (err) {
    console.log(err);
  }
};

export const getUserByEmailOnly = async (email: string) => {
  try {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};

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
>['item'];

export const addItemToUser = async (
  userId: string,
  item: Omit<Omit<Item, 'userId'>, 'institutionId'>
) => {
  console.log('adding item', item, userId);
  const newItem = await db.insert(items).values({
    userId: userId,
    ...item,
  });
  console.log(newItem, 'new item?');
};

const addInstitution = async (institution: Institution) => {
  await db.insert(institutions).values(institution);
};

type Institution = ExtractFunctionReturnType<typeof getInstitution>;

const getInstitution = async (id: string) => {
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
