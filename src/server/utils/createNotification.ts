import {
  createGroupInviteNotification,
  createGroupNotification,
  createGenericNotification,
} from "../services/notification.service";
import { io } from "../main";
import { getUsersToGroup } from "../services/group.service";

export async function createGroupInviteWithWebsocket(
  groupId: string,
  notificationRecipientId: string,
  notificationEmit: string,
  senderId: string
) {
  const userToGroup = await getUsersToGroup(groupId, notificationRecipientId);

  if (!userToGroup) {
    console.error("Failed to get userToGroup");
    throw new Error("Failed to get userToGroup");
  }

  const newNotif = await createGroupInviteNotification(
    userToGroup.id,
    notificationRecipientId,
    senderId
  );
  if (!newNotif) {
    console.error("Failed to create notification");
  }
  console.log(notificationEmit);
  io.to(notificationRecipientId).emit(
    notificationEmit,
    JSON.stringify({ notification: newNotif })
  );
}

export async function createGroupNotificationWithWebsocket(
  groupId: string,
  notificationEmit: string,
  notificationRecipientId: string,
  notificationSenderId: string,
  message: string
) {
  const userToGroup = await getUsersToGroup(groupId, notificationRecipientId);

  const newNotif = await createGroupNotification(
    userToGroup.id,
    message,
    notificationRecipientId,
    notificationSenderId
  );

  io.to(notificationRecipientId).emit(notificationEmit, {
    notification: newNotif,
  });
}

export async function createGenericNotificationWithWebsocket(
  notificationRecipientId: string,
  notificationEmit: string,
  message: string,
  icon: string,
  color: string,
  senderId: string
) {
  const newNotif = await createGenericNotification(
    icon,
    message,
    notificationRecipientId,
    color,
    senderId
  );

  if (!newNotif) {
    console.error("Failed to create notification");
  }

  io.to(notificationRecipientId).emit(notificationEmit, {
    notification: newNotif,
  });
}
