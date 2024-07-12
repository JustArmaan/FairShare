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
  notificationEmit: string
) {
  try {
    const userToGroup = await getUsersToGroup(groupId, notificationRecipientId);

    if (!userToGroup) {
      console.error("Failed to get userToGroup");
      throw new Error("Failed to get userToGroup");
    }

    const newNotif = await createGroupInviteNotification(
      userToGroup.id,
      notificationRecipientId
    );
    if (!newNotif) {
      console.error("Failed to create notification");
    }
    io.to(notificationRecipientId).emit(
      notificationEmit,
      JSON.stringify({ notification: newNotif })
    );
  } catch (error) {
    console.error("Error handling group invitation:", error);
    throw new Error("Error handling group invitation");
  }
}

export async function createGroupNotificationWithWebsocket(
  groupId: string,
  notificationEmit: string,
  notificationRecipientId: string,
  message: string
) {
  try {
    const userToGroup = await getUsersToGroup(groupId, notificationRecipientId);

    if (!userToGroup) {
      console.error("Failed to get userToGroup");
      throw new Error("Failed to get userToGroup");
    }

    const newNotif = await createGroupNotification(
      userToGroup.id,
      message,
      notificationRecipientId
    );

    if (!newNotif) {
      console.error("Failed to create notification");
    }

    io.to(notificationRecipientId).emit(
      notificationEmit,
      JSON.stringify({ notification: newNotif })
    );
  } catch (e) {
    console.error("Error handling group notification:", e);
    throw new Error("Error handling group notification");
  }
}

export async function createGenericNotificationWithWebsocket(
  notificationRecipientId: string,
  notificationEmit: string,
  message: string,
  icon: string
) {
  try {
    const newNotif = await createGenericNotification(
      icon,
      message,
      notificationRecipientId
    );

    if (!newNotif) {
      console.error("Failed to create notification");
    }

    io.to(notificationRecipientId).emit(
      notificationEmit,
      JSON.stringify({ notification: newNotif })
    );
  } catch (e) {
    console.error("Error handling generic notification:", e);
    throw new Error("Error handling generic notification");
  }
}
