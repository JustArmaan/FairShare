import { getDB } from "../database/client";
import { users } from "../database/schema/users";
import { eq } from "drizzle-orm";
import { type User } from "../interface/interface";

let db = getDB();

export const getUser = async (userId: number): Promise<User | null> => {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId));
    return user[0] as User;
  } catch (error) {
    console.error(error);
    return null;
  }
};
