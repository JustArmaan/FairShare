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

// gets the return type, makes it not a promise and not null
type User = NonNullable<Awaited<ReturnType<typeof findUser>>>;

// partial makes all fields of type optional
export const updateUser = async (
  id: string,
  newFields: Partial<Omit<User, "id">>
) => {
  console.log(newFields);
  try {
    await db.update(users).set(newFields).where(eq(users.id, id));
  } catch (err) {
    console.log(err);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};
