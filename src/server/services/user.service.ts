import { getDB } from '../database/client';
import { memberType } from '../database/schema/memberType';
import { users } from '../database/schema/users';
import { eq } from 'drizzle-orm';
import { usersToGroups } from '../database/schema/usersToGroups';

const db = getDB();

export const findUserOnly = async (id: string) => {
  try {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const findUser = async (id: string) => {
  try {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createUser = async (
  user: Omit<Omit<User, 'createdAt'>, 'plaidAccessToken'>
) => {
  try {
    console.log(user.id, 'thihs is the id');
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
  console.log(newFields);
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
