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
import { notificationType } from "../database/schema/notificationType";
import { groupInvite } from "../database/schema/groupInvite";

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

async function getNotificaitonTypeByType(type: string) {
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
    const notificationType = await getNotificaitonTypeByType("invite");
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
    const notificationType = await getNotificaitonTypeByType("generic");
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

export async function creategroupNotification(
  userToGroupId: string,
  message: string,
  userId: string
) {
  try {
    const notificationType = await getNotificaitonTypeByType("group");
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
    const type = await getNotificaitonTypeByType("invite");
    if (!type) {
      throw new Error("Notification type not found");
    }
    const result = await db
      .select()
      .from(notifications)
      .innerJoin(groupInvite, eq(notifications.id, groupInvite.notificationId))
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

export async function getGenericNotificationById(userId: string) {
  try {
    const type = await getNotificaitonTypeByType("generic");
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

export async function getGroupNotificationById(userId: string) {
  try {
    const type = await getNotificaitonTypeByType("group");
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

export async function getUnreadNotifications(userId: string) {
  try {
    const results = await db
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
      .leftJoin(groupInvite, eq(notifications.id, groupInvite.notificationId))
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.readStatus, false)
        )
      );

    const mappedResults = results.map((result) => {
      const {
        notifications: notification,
        genericNotification,
        groupNotification,
        groupInvite,
      } = result;

      let specificNotification = {};

      if (groupInvite && groupInvite.notificationId === notification.id) {
        specificNotification = { ...notification, ...groupInvite };
      } else if (
        genericNotification &&
        genericNotification.notificationId === notification.id
      ) {
        specificNotification = { ...notification, ...genericNotification };
      } else if (
        groupNotification &&
        groupNotification.notificationId === notification.id
      ) {
        specificNotification = { ...notification, ...groupNotification };
      } else {
        specificNotification = { ...notification };
      }

      return specificNotification;
    });

    return mappedResults;
  } catch (error) {
    console.error(error);
  }
}
