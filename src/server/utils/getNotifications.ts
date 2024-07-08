import { getGenericNotificationById, getGroupNotificationById } from "../services/notification.service";

export async function getNotificaitons(userId: string) {
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