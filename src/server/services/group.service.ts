import { getDB } from "../database/client";
import { groups } from "../database/schema/group";
import { categories } from "../database/schema/category";
import { usersToGroups } from "../database/schema/usersToGroups";
import { memberType } from "../database/schema/memberType";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { users } from "../database/schema/users";
import type { UserSchemaWithMemberType } from "../interface/types";
import type { ExtractFunctionReturnType } from "./user.service";

const db = getDB();

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

export const getCategory = async (categoryId: string) => {
  try {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId));
    return category[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

async function getMemberType(type: string) {
  try {
    const result = await db
      .select()
      .from(memberType)
      .where(eq(memberType.type, type));
    return result[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export type MemberTypeSchema = NonNullable<
  Awaited<ReturnType<typeof getMemberType>>
>;

export async function getGroupWithMembers(groupId: string) {
  try {
    const result = await db
      .select({ group: groups, members: users, memberType })
      .from(groups)
      .innerJoin(usersToGroups, eq(usersToGroups.groupId, groupId))
      .innerJoin(users, eq(usersToGroups.userId, users.id))
      .innerJoin(memberType, eq(usersToGroups.memberTypeId, memberType.id))
      .where(eq(groups.id, groupId));

    return result.reduce((groups, currentResult) => {
      const groupIndex = groups.findIndex(
        (group) => group.id === currentResult.group.id
      );
      if (groupIndex === -1) {
        groups.push({
          ...currentResult.group,
          members: [
            { ...currentResult.members, type: currentResult.memberType.type },
          ],
        });
      } else {
        groups[groupIndex].members.push({
          ...currentResult.members,
          type: currentResult.memberType.type,
        });
      }
      return groups;
    }, [] as (GroupSchema & { members: UserSchemaWithMemberType[] })[])[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getGroupsAndAllMembersForUser = async (userId: string) => {
  try {
    const userGroups = await db
      .select({ groupId: usersToGroups.groupId })
      .from(usersToGroups)
      .where(eq(usersToGroups.userId, userId))
      .all();

    if (userGroups.length === 0) {
      console.log("No groups found for this user.");
      return [];
    }

    const groupIds = userGroups.map((group) => group.groupId);
    return (await Promise.all(groupIds.map(getGroupWithMembers))).filter(
      (result) => result !== null
    ) as ExtractFunctionReturnType<typeof getGroupWithMembers>[];
  } catch (error) {
    console.error("Error fetching groups and members for user:", error);
    return [];
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

export const addMember = async (
  groupId: string,
  userId: string,
  type: string
) => {
  try {
    const invitedType = await db
      .select({ id: memberType.id })
      .from(memberType)
      .where(eq(memberType.type, type));

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

export const updateGroup = async (
  groupId: string,
  name?: string,
  color?: string,
  icon?: string,
  temporary?: string
) => {
  try {
    const updateFields: {
      name?: string;
      color?: string;
      icon?: string;
      temporary?: string;
    } = {};

    if (name !== undefined) updateFields.name = name;
    if (color !== undefined) updateFields.color = color;
    if (icon !== undefined) updateFields.icon = icon;
    if (temporary !== undefined) updateFields.temporary = temporary;

    if (Object.keys(updateFields).length > 0) {
      const group = await db
        .update(groups)
        .set(updateFields)
        .where(eq(groups.id, groupId))
        .returning();
      return group[0];
    } else {
      console.log("No fields to update");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const checkUserInGroup = async (groupId: string, userId: string) => {
  try {
    const result = await db
      .select()
      .from(usersToGroups)
      .where(
        and(
          eq(usersToGroups.groupId, groupId),
          eq(usersToGroups.userId, userId)
        )
      );

    if (result.length > 0 && result[0].id) {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export type CategoriesSchema = NonNullable<
  Awaited<ReturnType<typeof getCategories>>
>;

export async function deleteMemberByGroup(userId:string, groupId:string ) {
  try {
    const memeber = await db.delete(usersToGroups)
    .where(
      and(
        eq(usersToGroups.groupId, groupId),
        eq(usersToGroups.userId, userId)
      )
    );
    console.log(memeber)

  } catch (error) {
    console.error(error)
    return false;
  }

}
