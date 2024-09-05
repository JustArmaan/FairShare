import { getDB } from "../database/client";
import { usersToGroups } from "../database/schema/usersToGroups";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import type { ExtractFunctionReturnType } from "./user.service";
import { notifications } from "../database/schema/notifications";
import { type ArrayElement } from "../interface/types";
import { groupNotification } from "../database/schema/groupNotification";
import { genericNotification } from "../database/schema/genericNotification";
import { notificationType } from "../database/schema/notificationType";
import { groupInvite } from "../database/schema/groupInvite";
import { groups } from "../database/schema/group";
import { users } from "../database/schema/users";

let db = getDB();

export async function getNotificationTypeByType(type: string) {
  const results = await db
    .select()
    .from(notificationType)
    .where(eq(notificationType.type, type));
  return results[0];
}

export async function getNotificationTypeById(typeId: string) {
  const result = await db
    .select()
    .from(notificationType)
    .where(eq(notificationType.id, typeId));

  return result[0];
}

export async function createGroupInviteNotification(
  userToGroupId: string,
  userId: string,
  notificationSenderId: string
) {
  const notificationType = await getNotificationTypeByType("invite");
  if (!notificationType) {
    return null;
  }
  const notification = await db
    .insert(notifications)
    .values({
      id: uuidv4(),
      notificationTypeId: notificationType.id,
      notificationSenderId: notificationSenderId,
      userId,
    })
    .returning();

  const results = await db
    .insert(groupInvite)
    .values({
      id: uuidv4(),
      notificationId: notification[0].id,
      userGroupId: userToGroupId,
    })
    .returning();
  return results[0];
}

export async function createGenericNotification(
  icon: string,
  message: string,
  userId: string,
  color: string,
  notificationSenderId: string
) {
  const notificationType = await getNotificationTypeByType("generic");
  const notification = await db
    .insert(notifications)
    .values({
      id: uuidv4(),
      notificationTypeId: notificationType.id,
      userId,
      notificationSenderId,
    })
    .returning();

  const genericNotice = await db
    .insert(genericNotification)
    .values({
      id: uuidv4(),
      notificationId: notification[0].id,
      userId,
      icon,
      message,
      color,
    })
    .returning();
  return genericNotice[0];
}

export async function createGroupNotification(
  userToGroupId: string,
  message: string,
  userId: string,
  notificationSenderId: string
) {
  const notificationType = await getNotificationTypeByType("group");

  const notification = await db
    .insert(notifications)
    .values({
      id: uuidv4(),
      notificationTypeId: notificationType.id,
      userId,
      notificationSenderId,
    })
    .returning();

  const groupNotice = await db
    .insert(groupNotification)
    .values({
      id: uuidv4(),
      notificationId: notification[0].id,
      userGroupId: userToGroupId,
      message,
    })
    .returning();

  return groupNotice[0];
}

export async function getGroupInviteNotificaitonById(userId: string) {
  const type = await getNotificationTypeByType("invite");
  if (!type) {
    throw new Error("Notification type not found");
  }
  const result = await db
    .select()
    .from(notifications)
    .innerJoin(groupInvite, eq(notifications.id, groupInvite.notificationId))
    .innerJoin(usersToGroups, eq(groupInvite.userGroupId, usersToGroups.id))
    .innerJoin(groups, eq(usersToGroups.groupId, groups.id))
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.notificationTypeId, type.id)
      )
    );
  return result;
}

export type InviteNotification = ArrayElement<
  ExtractFunctionReturnType<typeof getGroupInviteNotificaitonById>
>;

export async function getGenericNotificationById(userId: string) {
  const type = await getNotificationTypeByType("generic");
  if (!type) {
    throw new Error("Notification type not found");
  }
  const result = await db
    .select()
    .from(notifications)
    .innerJoin(
      genericNotification,
      eq(notifications.id, genericNotification.notificationId)
    )
    .innerJoin(users, eq(notifications.notificationSenderId, users.id))
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.notificationTypeId, type.id)
      )
    );

  return result;
}

export type GenericNotification = ArrayElement<
  ExtractFunctionReturnType<typeof getGenericNotificationById>
>;

export async function getGroupNotificationById(userId: string) {
  const type = await getNotificationTypeByType("group");
  if (!type) {
    throw new Error("Notification type not found");
  }
  const result = await db
    .select()
    .from(notifications)
    .innerJoin(
      groupNotification,
      eq(notifications.id, groupNotification.notificationId)
    )
    .innerJoin(users, eq(notifications.notificationSenderId, users.id))
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.notificationTypeId, type.id)
      )
    );
  return result;
}

export type GroupNotification = ArrayElement<
  ExtractFunctionReturnType<typeof getGroupNotificationById>
>;

export type CombinedNotification = GenericNotification | GroupNotification;

export async function getUnreadNotifications(userId: string) {
  const groupInviteNotifications = await getGroupInviteNotificaitonById(userId);

  if (!groupInviteNotifications) {
    throw new Error("Failed to get group invite notifications");
  }

  const unreadGroupInviteNotifications = groupInviteNotifications.filter(
    (n) => !n.notifications.readStatus
  );

  const genericNotifications = await getGenericNotificationById(userId);

  if (!genericNotifications) {
    throw new Error("Failed to get generic notifications");
  }

  const unreadGenericNotifications = genericNotifications.filter(
    (n) => !n.notifications.readStatus
  );

  const groupNotifications = await getGroupNotificationById(userId);

  if (!groupNotifications) {
    throw new Error("Failed to get group notifications");
  }

  const unreadGroupNotifications = groupNotifications.filter(
    (n) => !n.notifications.readStatus
  );

  const unreadNotifications = [
    ...unreadGroupInviteNotifications,
    ...unreadGenericNotifications,
    ...unreadGroupNotifications,
  ];

  return unreadNotifications;
}

export async function markNotificationAsRead(notificationId: string) {
  await db
    .update(notifications)
    .set({ readStatus: true })
    .where(eq(notifications.id, notificationId));
}

export async function markAllNotificationsAsRead(userId: string) {
  await db
    .update(notifications)
    .set({ readStatus: true })
    .where(eq(notifications.userId, userId));
}

export async function deleteNotification(notificationId: string) {
  await db.delete(notifications).where(eq(notifications.id, notificationId));
}

export async function deleteGroupInviteNotificationByNotificationId(
  notificationId: string
) {
  await db
    .delete(groupInvite)
    .where(eq(groupInvite.notificationId, notificationId));

  await db.delete(notifications).where(eq(notifications.id, notificationId));
}

export async function deleteGenericNotificationByNotificationId(
  notificationId: string
) {
  await db
    .delete(genericNotification)
    .where(eq(genericNotification.notificationId, notificationId));

  await db.delete(notifications).where(eq(notifications.id, notificationId));
}

export async function deleteGroupNotificationByNotificationId(
  notificationId: string
) {
  await db
    .delete(groupNotification)
    .where(eq(groupNotification.notificationId, notificationId));

  await db.delete(notifications).where(eq(notifications.id, notificationId));
}

export async function deleteAllNotifications(userId: string) {
  const results = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId));

  for (const result of results) {
    const { id } = result;
    await db.delete(notifications).where(eq(notifications.id, id));
    await deleteGenericNotificationByNotificationId(id);
    await deleteGroupNotificationByNotificationId(id);
    await deleteGroupInviteNotificationByNotificationId(id);
  }
}

export async function getGroupNameByUserGroupId(userGroupId: string) {
  const result = await db
    .select({ name: groups.name })
    .from(usersToGroups)
    .innerJoin(groups, eq(usersToGroups.groupId, groups.id))
    .where(eq(usersToGroups.id, userGroupId));
  return result[0];
}

export async function getGroupInviteByNotificationId(notificationId: string) {
  const result = await db
    .select()
    .from(notifications)
    .innerJoin(groupInvite, eq(notifications.id, groupInvite.notificationId))
    .innerJoin(usersToGroups, eq(groupInvite.userGroupId, usersToGroups.id))
    .innerJoin(groups, eq(usersToGroups.groupId, groups.id))
    .where(eq(notifications.id, notificationId));
  return result[0];
}

export async function getGroupNotificationByNotificationId(
  notificationId: string
) {
  const result = await db
    .select()
    .from(notifications)
    .innerJoin(
      groupNotification,
      eq(notifications.id, groupNotification.notificationId)
    )
    .innerJoin(
      usersToGroups,
      eq(groupNotification.userGroupId, usersToGroups.id)
    )
    .innerJoin(groups, eq(usersToGroups.groupId, groups.id))
    .innerJoin(users, eq(notifications.userId, users.id))
    .where(eq(notifications.id, notificationId));
  return result[0];
}

export async function getGenericNotificationByNotificationId(
  notificationId: string
) {
  const result = await db
    .select()
    .from(notifications)
    .innerJoin(
      genericNotification,
      eq(notifications.id, genericNotification.notificationId)
    )
    .innerJoin(
      usersToGroups,
      eq(genericNotification.userId, usersToGroups.userId)
    )
    .innerJoin(groups, eq(usersToGroups.groupId, groups.id))
    .innerJoin(users, eq(notifications.userId, users.id))
    .where(eq(notifications.id, notificationId));
  return result[0];
}
