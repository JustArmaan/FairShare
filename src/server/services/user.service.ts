import { getDB } from "../database/client";
import { items } from "../database/schema/items";
import { users } from "../database/schema/users";
import { eq } from "drizzle-orm";

const db = getDB();

export const findUser = async (id: string) => {
  const results = await db.select().from(users).where(eq(users.id, id));
  return results[0];
};

export const createUser = async (user: Omit<User, "createdAt">) => {
  const newUser = await db.insert(users).values({
    ...user,
  });
  return newUser;
};

// gets the return type, makes it not a promise and not null
type User = ExtractFunctionReturnType<typeof findUser>;

export type ExtractFunctionReturnType<T extends (...args: any[]) => any> =
  NonNullable<Awaited<ReturnType<T>>>;

// partial makes all fields of type optional
export const updateUser = async (
  id: string,
  newFields: Partial<Omit<User, "id">>
) => {
  await db.update(users).set(newFields).where(eq(users.id, id));
};

export const getUserByEmailOnly = async (email: string) => {
  const results = await db.select().from(users).where(eq(users.email, email));
  return results[0];
};

export const getUserByItemId = async (itemId: string) => {
  const results = await db
    .select({ user: users })
    .from(users)
    .innerJoin(items, eq(items.userId, users.id))
    .where(eq(items.id, itemId));

  return results[0].user;
};
