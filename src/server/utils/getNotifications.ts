import {
  getGenericNotificationById,
  getGroupNotificationById,
  getGroupInviteNotificaitonById,
  getUnreadNotifications,
} from "../services/notification.service";

export async function getMostRecentNotifications(userId: string) {
  const genericNotification = await getGenericNotificationById(userId);
  const groupNotification = await getGroupNotificationById(userId);

  if (!genericNotification || !groupNotification) {
    throw new Error("Failed to get notifications");
  }
  const allNotifications = [...genericNotification, ...groupNotification];

  allNotifications.sort(
    (a, b) =>
      new Date(a.notifications.timestamp).getTime() -
      new Date(b.notifications.timestamp).getTime()
  );

  return allNotifications;
}

export async function getOldestToNewestNotifications(userId: string) {
  const genericNotification = await getGenericNotificationById(userId);
  const groupNotification = await getGroupNotificationById(userId);

  if (!genericNotification || !groupNotification) {
    throw new Error("Failed to get notifications");
  }
  const allNotifications = [...genericNotification, ...groupNotification];

  allNotifications.sort(
    (a, b) =>
      new Date(b.notifications.timestamp).getTime() -
      new Date(a.notifications.timestamp).getTime()
  );

  return allNotifications;
}

export async function getAllNotifications(userId: string) {
  const genericNotification = await getGenericNotificationById(userId);
  const groupNotification = await getGroupNotificationById(userId);
  const groupInviteNotification = await getGroupInviteNotificaitonById(userId);

  if (!genericNotification || !groupNotification || !groupInviteNotification) {
    throw new Error("Failed to get notifications");
  }

  return [
    ...genericNotification,
    ...groupNotification,
    ...groupInviteNotification,
  ];
}

export async function getSortedNotifications(userId: string, sortType: string) {
  switch (sortType) {
    case "Most Recent":
      return getMostRecentNotifications(userId);
    case "Oldest to Newest":
      return getOldestToNewestNotifications(userId);
    case "Groups":
      return getGroupNotificationById(userId);
    case "Account":
      return getGenericNotificationById(userId);
    default:
      throw new Error("Invalid sort type");
  }
}
