import { getDB } from '../database/client';
import { groups } from '../database/schema/group';
import { eq } from 'drizzle-orm';
import { usersToGroups } from '../database/schema/usersToGroups';
import { users } from '../database/schema/users';
import type { UserSchema } from '../interface/types';

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

export async function getGroupWithMembers(groupId: string) {
  try {
    const result = await db
      .select({ group: groups, members: users })
      .from(groups)
      .innerJoin(usersToGroups, eq(usersToGroups.groupId, groupId))
      .innerJoin(users, eq(usersToGroups.userId, users.id))
      .where(eq(groups.id, groupId));

    return result.reduce(
      (groups, currentResult) => {
        const groupIndex = groups.findIndex(
          (group) => group.id === currentResult.group.id
        );
        if (groupIndex === -1) {
          groups.push({
            ...currentResult.group,
            members: [currentResult.members],
          });
        } else {
          groups[groupIndex].members.push(currentResult.members);
        }
        return groups;
      },
      [] as (GroupSchema & { members: UserSchema[] })[]
    )[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getGroupsForUserWithMembers(userId: string) {
  try {
    const result = await db
      .select({ group: groups, members: users })
      .from(groups)
      .innerJoin(usersToGroups, eq(usersToGroups.groupId, groups.id))
      .innerJoin(users, eq(usersToGroups.userId, users.id))
      .where(eq(usersToGroups.userId, userId));

    // combine groups
    return result.reduce(
      (groups, currentResult) => {
        const groupIndex = groups.findIndex(
          (group) => group.id === currentResult.group.id
        );
        if (groupIndex === -1) {
          groups.push({
            ...currentResult.group,
            members: [currentResult.members],
          });
        } else {
          groups[groupIndex].members.push(currentResult.members);
        }
        return groups;
      },
      [] as (GroupSchema & { members: UserSchema[] })[]
    );
  } catch (error) {
    console.log(error);
    return null;
  }
}

export type GroupSchema = NonNullable<Awaited<ReturnType<typeof getGroup>>>;
