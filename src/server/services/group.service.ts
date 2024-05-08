import { getDB } from "../database/client";
import { groups } from "../database/schema/group";
import { categories } from "../database/schema/category";
import { usersToGroups } from "../database/schema/usersToGroups";
import { memberType } from "../database/schema/memberType";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

let db = getDB();

export async function getGroup(groupId: string) {
  try {
    const group = await db.select().from(groups).where(eq(groups.id, groupId));
    return group[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getCategories = async () => {
  try {
    const allCategories = await db.select().from(categories).all();
    return allCategories;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export type GroupSchema = NonNullable<Awaited<ReturnType<typeof getGroup>>>;

export const createGroup = async (
  name: string,
  color: string,
  icon: string,
  temporary: string
) => {
  try {
    const group = await db
      .insert(groups)
      .values({
        id: uuidv4(),
        name,
        color,
        icon,
        temporary,
      })
      .returning();
    return group[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addMember = async (groupId: string, userId: string) => {
  try {
    const invitedType = await db
      .select({ id: memberType.id })
      .from(memberType)
      .where(eq(memberType.type, "Invited"));

    if (invitedType.length === 0) {
      throw new Error("Member type 'Invited' not found.");
    }

    const memberTypeId = invitedType[0].id;

    await db.insert(usersToGroups).values({
      id: uuidv4(),
      groupId: groupId,
      userId: userId,
      memberTypeId: memberTypeId,
    });

    console.log("Member added successfully.");
    return true;
  } catch (error) {
    console.error("Failed to add member:", error);
    return false;
  }
};

export type CategoriesSchema = NonNullable<
  Awaited<ReturnType<typeof getCategories>>
>;
