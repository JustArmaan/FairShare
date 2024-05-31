import { createNotificationForUserInGroups } from '../services/notification.service';
import { io } from '../main';

export async function createNotificationWithWebsocket(
  groupId: string,
  message: string,
  notificationRecipientId: string,
  notificationEmit: string,
  route?: string
) {
  try {
    const newNotif = await createNotificationForUserInGroups(groupId, notificationRecipientId, {
      timestamp: new Date().toISOString(),
      message: message,
      route: route ? route : null,
    });
    if (!newNotif) {
      console.error('Failed to create notification');
    }
    io.to(notificationRecipientId).emit(
      notificationEmit,
      JSON.stringify({ notification: newNotif })
    );
  } catch (error) {
    console.error('Error handling group invitation:', error);
  }
}
