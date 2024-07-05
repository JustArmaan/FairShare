import { getDB } from "../database/client";
import { usersToGroups } from "../database/schema/usersToGroups";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import type { ExtractFunctionReturnType } from "./user.service";
import { getUsersToGroup } from "./group.service";
import { notifications } from "../database/schema/notifications";
import { type ArrayElement } from "../interface/types";
import { groupNotification } from "../database/schema/groupNotification";
import { genericNotification } from "../database/schema/genericNotification";

let db = getDB();

export async function getNotificationForUserInGroup(
  groupId: string,
  userId: string
) {
  try {
    const userToGroup = await getUsersToGroup(groupId, userId);

    if (!userToGroup) {
      return null;
    }

    const results = await db
      .select()
      .from(notifications)
      .innerJoin(groupNotification, eq(notifications.id, groupNotification.id))
      .where(eq(groupNotification.userGroupId, userToGroup.id));
    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAllGroupNotificationsForUser(userId: string) {
  try {
    const results = await db
      .select({ notifications: notifications })
      .from(notifications)
      .innerJoin(groupNotification, eq(notifications.id, groupNotification.id))
      .innerJoin(
        usersToGroups,
        eq(groupNotification.userGroupId, usersToGroups.id)
      )
      .where(eq(usersToGroups.userId, userId));

    const mappedResults = results.map((result) => {
      return {
        ...result.notifications,
      };
    });
    return mappedResults;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export type Notification = ArrayElement<
  ExtractFunctionReturnType<typeof getAllGroupNotificationsForUser>
>;

export async function createNotificationForUserInGroups(
  groupId: string,
  userId: string,
  notification: Omit<Notification, "id" | "userGroupId">
) {
  try {
    const userToGroup = await getUsersToGroup(groupId, userId);

    if (!userToGroup) {
      return null;
    }

    const results = await db
      .insert(notifications)
      .values({ ...notification, id: uuidv4() }) // needs to be fixed
      .returning();
    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteNotificationForUserInGroup(
  groupId: string,
  userId: string,
  notificationId: string
) {
  try {
    const userToGroup = await getUsersToGroup(groupId, userId);

    if (!userToGroup) {
      return null;
    }

    await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.notificationTypeId, notifications.id),
          eq(notifications.id, notificationId)
        )
      );
  } catch (error) {
    console.error(error);
  }
}

export async function deleteAllNotificationsForUser(userGroupId: string) {
  try {
    await db.delete(notifications).where;
    and(
      eq(groupNotification.notificationId, notifications.id),
      eq(genericNotification.notificationId, notifications.id)
    );
  } catch (error) {
    console.error(error);
  }
}
