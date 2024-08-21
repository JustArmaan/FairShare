import { getDB } from "../database/client";
import { usersToGroups } from "../database/schema/usersToGroups";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import type { ExtractFunctionReturnType } from "./user.service";
import { getGroupOwnerWithGroupId, getUsersToGroup } from "./group.service";
import { notifications } from "../database/schema/notifications";
import { type ArrayElement } from "../interface/types";
import { groupNotification } from "../database/schema/groupNotification";
import { genericNotification } from "../database/schema/genericNotification";
import { notificationType } from "../database/schema/notificationType";
import { groupInvite } from "../database/schema/groupInvite";
import { th } from "@faker-js/faker";
import { groups } from "../database/schema/group";

let db = getDB();

// export async function getNotificationForUserInGroup(
//   groupId: string,
//   userId: string
// ) {
//   try {
//     const userToGroup = await getUsersToGroup(groupId, userId);

//     if (!userToGroup) {
//       return null;
//     }

//     const results = await db
//       .select()
//       .from(notifications)
//       .innerJoin(groupNotification, eq(notifications.id, groupNotification.id))
//       .where(eq(groupNotification.userGroupId, userToGroup.id));
//     return results[0];
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

// export async function getAllGroupNotificationsForUser(userId: string) {
//   try {
//     const results = await db
//       .select({ notifications: notifications })
//       .from(notifications)
//       .innerJoin(groupNotification, eq(notifications.id, groupNotification.id))
//       .innerJoin(
//         usersToGroups,
//         eq(groupNotification.userGroupId, usersToGroups.id)
//       )
//       .where(eq(usersToGroups.userId, userId));

//     const mappedResults = results.map((result) => {
//       return {
//         ...result.notifications,
//       };
//     });
//     return mappedResults;
//   } catch (e) {
//     console.error(e);
//     return [];
//   }
// }

// async function getNotificationIdForUserInGroup(userGroupId: string) {
//   const results = await db
//     .select()
//     .from(groupNotification)
//     .where(eq(groupNotification.userGroupId, userGroupId));

//   return results.map((result) => result.notificationId);
// }

// export type Notification = ArrayElement<
//   ExtractFunctionReturnType<typeof getAllGroupNotificationsForUser>
// >;

// export async function createNotificationForUserInGroups(
//   groupId: string,
//   userId: string,
//   notification: Omit<Notification, "id" | "userGroupId">
//   type:
// ) {
//   try {
//     const userToGroup = await getUsersToGroup(groupId, userId);

//     if (!userToGroup) {
//       return null;
//     }

//     const results = await db
//       .insert(notifications)
//       .values({ ...notification, id: uuidv4() }) // needs to be fixed
//       .returning();
//     return results[0];
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

// export async function deleteNotificationForUserInGroup(
//   groupId: string,
//   userId: string,
//   notificationId: string
// ) {
//   try {
//     const userToGroup = await getUsersToGroup(groupId, userId);

//     if (!userToGroup) {
//       return null;
//     }

//     await db
//       .delete(notifications)
//       .where(
//         and(
//           eq(notifications.notificationTypeId, notifications.id),
//           eq(notifications.id, notificationId)
//         )
//       );
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function deleteAllNotificationsForUser(userGroupId: string) {
//   try {
//     await db
//       .delete(notifications)
//       .where(
//         and(
//           eq(notifications.id, groupNotification.notificationId),
//           eq(notifications.id, genericNotification.notificationId)
//         )
//       );
//   } catch (error) {
//     console.error(error);
//   }
// }

export async function getNotificationTypeByType(type: string) {
  try {
    const results = await db
      .select()
      .from(notificationType)
      .where(eq(notificationType.type, type));
    return results[0];
  } catch (error) {
    console.error(error);
  }
}

export async function createGroupInviteNotification(
  userToGroupId: string,
  userId: string
) {
  try {
    const notificationType = await getNotificationTypeByType("invite");
    if (!notificationType) {
      return null;
    }
    const notification = await db
      .insert(notifications)
      .values({
        id: uuidv4(),
        notificationTypeId: notificationType.id,
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
  } catch (error) {
    console.error(error);
  }
}

export async function createGenericNotification(
  icon: string,
  message: string,
  userId: string
) {
  try {
    const notificationType = await getNotificationTypeByType("generic");
    if (!notificationType) {
      return null;
    }
    const notification = await db
      .insert(notifications)
      .values({
        id: uuidv4(),
        notificationTypeId: notificationType.id,
        userId,
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
      })
      .returning();
    return genericNotice[0];
  } catch (error) {
    console.error(error);
  }
}

export async function createGroupNotification(
  userToGroupId: string,
  message: string,
  userId: string
) {
  try {
    const notificationType = await getNotificationTypeByType("group");
    if (!notificationType) {
      return null;
    }
    const notification = await db
      .insert(notifications)
      .values({
        id: uuidv4(),
        notificationTypeId: notificationType.id,
        userId,
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
  } catch (error) {
    console.error(error);
  }
}

export async function getGroupInviteNotificaitonById(userId: string) {
  try {
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
  } catch (error) {
    console.error(error);
  }
}

export type InviteNotification = ArrayElement<
  ExtractFunctionReturnType<typeof getGroupInviteNotificaitonById>
>;

export async function getGenericNotificationById(userId: string) {
  try {
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
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.notificationTypeId, type.id)
        )
      );
    return result;
  } catch (error) {
    console.error(error);
  }
}

export type GenericNotification = ArrayElement<
  ExtractFunctionReturnType<typeof getGenericNotificationById>
>;

export async function getGroupNotificationById(userId: string) {
  try {
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
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.notificationTypeId, type.id)
        )
      );
    return result;
  } catch (error) {
    console.error(error);
  }
}

export type GroupNotification = ArrayElement<
  ExtractFunctionReturnType<typeof getGroupNotificationById>
>;

export async function getCombinedNotification(
  notifId: string
): Promise<CombinedNotification | null> {
  const result = await db
    .select()
    .from(notifications)
    .leftJoin(
      genericNotification,
      eq(notifications.id, genericNotification.notificationId)
    )
    .leftJoin(
      groupNotification,
      eq(notifications.id, groupNotification.notificationId)
    )
    .innerJoin(
      usersToGroups,
      eq(groupNotification.userGroupId, usersToGroups.id)
    )
    .innerJoin(groups, eq(usersToGroups.groupId, groups.id))
    .where(eq(notifications.id, notifId));

  return result.length > 0 ? result[0] : null;
}

export type CombinedNotification = GenericNotification | GroupNotification;

export async function getUnreadNotifications(userId: string) {
  try {
    const groupInviteNotifications = await getGroupInviteNotificaitonById(
      userId
    );

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
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    await db
      .update(notifications)
      .set({ readStatus: true })
      .where(eq(notifications.id, notificationId));
  } catch (error) {
    console.error(error);
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    await db
      .update(notifications)
      .set({ readStatus: true })
      .where(eq(notifications.userId, userId));
  } catch (error) {
    console.error(error);
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await db.delete(notifications).where(eq(notifications.id, notificationId));
  } catch (error) {
    console.error(error);
  }
}

export async function deleteGroupInviteNotificationByNotificationId(
  notificationId: string
) {
  try {
    await db
      .delete(groupInvite)
      .where(eq(groupInvite.notificationId, notificationId));

    await db.delete(notifications).where(eq(notifications.id, notificationId));
  } catch (error) {
    console.error(error);
  }
}

export async function deleteGenericNotificationByNotificationId(
  notificationId: string
) {
  try {
    await db
      .delete(genericNotification)
      .where(eq(genericNotification.notificationId, notificationId));

    await db.delete(notifications).where(eq(notifications.id, notificationId));
  } catch (error) {
    console.error(error);
  }
}

export async function deleteGroupNotificationByNotificationId(
  notificationId: string
) {
  try {
    await db
      .delete(groupNotification)
      .where(eq(groupNotification.notificationId, notificationId));

    await db.delete(notifications).where(eq(notifications.id, notificationId));
  } catch (error) {
    console.error(error);
  }
}

export async function deleteAllNotifications(userId: string) {
  try {
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
  } catch (e) {
    console.error(e, "deleteing all notifications");
    throw new Error("Error deleting all notifications");
  }
}

export async function getGroupNameByUserGroupId(userGroupId: string) {
  try {
    const result = await db
      .select({ name: groups.name })
      .from(usersToGroups)
      .innerJoin(groups, eq(usersToGroups.groupId, groups.id))
      .where(eq(usersToGroups.id, userGroupId));
    return result[0];
  } catch (error) {
    console.error(error, "getting group name by user group id");
    throw new Error("Error getting group name by user group id");
  }
}
