import { getDB } from "../database/client";
import { users } from "../database/schema/users";
import { eq } from "drizzle-orm";

let db = getDB();

export const findUser = async (userId: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId));
    return user[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const createUser = async (
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
  picture: string
) => {
  try {
    const existUser = await findUser(userId);
    if (!existUser) {
      const newUser = await db.insert(users).values({
        id: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        picture: picture,
      });
      return newUser;
    }
  } catch (err) {
    console.error(err);
  }
};
