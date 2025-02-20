import express from "express";
import { renderToHtml } from "jsxte";
import { NotificationPage } from "../views/pages/Notifications/NotificationsPage.tsx";
import { NotificationList } from "../views/pages/Notifications/NotificationList.tsx";
import { NotificationIcon } from "../views/components/NavigationIcon.tsx";
import { findUser } from "../services/user.service.ts";
import NotificationPicker from "../views/pages/Notifications/components/NotificationPicker.tsx";
import { getSortedNotifications } from "../utils/getNotifications.ts";
import {
  deleteAllNotifications,
  getGenericNotificationByNotificationId,
  getGroupInviteByNotificationId,
  getGroupInviteNotificaitonById,
  getGroupNotificationByNotificationId,
  getNotificationTypeById,
  getUnreadNotifications,
  markNotificationAsRead,
} from "../services/notification.service.ts";
import {
  getGroupOwnerWithGroupId,
  getGroupTransactionStateFromOwedId,
} from "../services/group.service.ts";
import Reminder from "../views/pages/Notifications/components/Reminder.tsx";
import {
  createGenericNotificationWithWebsocket,
  createGroupNotificationWithWebsocket,
} from "../utils/createNotification.ts";
import {
  getAllGroupTransactionStatesFromGroupId,
  getAllOwedForGroupTransaction,
  getAllOwedForGroupTransactionWithMemberInfo,
  getGroupTransactionDetails,
  getTransactionOwnerFromOwedId,
} from "../services/owed.service.ts";

const router = express.Router();

router.get("/page", async (req, res) => {
  try {
    const sort = req.query.sort as string;
    const userId = req.user!.id;
    if (!userId) {
      return res.status(404).send("No userId");
    }

    const html = renderToHtml(
      <NotificationPage
        userId={userId}
        selectedSorted={sort ?? "Most Recent"}
      />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get("/notificationList", async (req, res) => {
  const sort = (req.query.sort as string) || "Most Recent";
  const userId = req.user!.id;
  if (!userId) {
    return res.status(404).send("No userId");
  }

  const notifications = await getSortedNotifications(userId, sort);

  const inviteNotifications = await getGroupInviteNotificaitonById(userId);

  if (!notifications || !inviteNotifications) {
    return res.status(404).send("Problem with notification");
  }
  const html = renderToHtml(
    <NotificationList
      inviteNotifications={inviteNotifications}
      notifications={notifications}
      selectedSort={sort}
    />
  );

  res.send(html);
});

router.get("/notificationIcon", async (req, res) => {
  try {
    const userId = req.user!.id;
    if (!userId) {
      return res.status(404).send("No userId");
    }

    const notifications = await getUnreadNotifications(req.user!.id);

    if (!notifications) {
      return res.status(404).send("Problem with notification");
    }

    const html = renderToHtml(
      <NotificationIcon
        userId={userId}
        notificationCount={notifications.length}
      />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.post("/clearNotifications", async (req, res) => {
  await deleteAllNotifications(req.body.userToGroupId);

  const html = renderToHtml(
    <div
      hx-get={`/notification/page`}
      hx-trigger="load"
      hx-target="#app"
      hx-swap="innerHTML"
      hx-push-url={`/notification/page`}
    />
  );

  res.send(html);
});

router.get("/notificationPicker", async (req, res) => {
  const sort = req.query.sort as string;
  const currentUser = await findUser(req.user!.id);
  if (!currentUser) {
    return res.status(404).send("No user found");
  }
  const html = renderToHtml(
    <NotificationPicker
      currentUserId={currentUser.id}
      selectedSort={sort ?? "Most Recent"}
    />
  );

  res.send(html);
});

router.get("/reminder/:notificationId", async (req, res) => {
  const notificationTypeId = req.query.notificationTypeId as string;
  const notificationId = req.params.notificationId;

  const notificationType = await getNotificationTypeById(notificationTypeId);

  if (!notificationType) {
    return res.status(404).send("No notification type found");
  }

  let notifications;

  if (notificationType.type === "invite") {
    notifications = await getGroupInviteByNotificationId(notificationId);
  } else if (notificationType.type === "generic") {
    notifications =
      await getGenericNotificationByNotificationId(notificationId);
  } else if (notificationType.type === "group") {
    notifications = await getGroupNotificationByNotificationId(notificationId);
  }

  if (!notifications) {
    return res.status(404).send("No notifications found");
  }

  const groupOwner = await getGroupOwnerWithGroupId(notifications.groups.id);

  if (!groupOwner) {
    res.status(404).send("No group owner found");
  }

  const html = renderToHtml(
    <Reminder notifications={notifications} groupOwner={groupOwner} />
  );

  await markNotificationAsRead(notificationId);

  res.send(html);
});

router.get("/remind", async (req, res) => {
  const user = req.user!;
  const { owedId } = req.query as { [key: string]: string };

  const groupTransactionState =
    await getGroupTransactionStateFromOwedId(owedId);

  const results = (await getGroupTransactionDetails(groupTransactionState.id))!;

  results.forEach(async (result) => {
    if (result.groupTransactionToUsersToGroupsStatus.status !== "notSent")
      return;
    if (result.users.id === user.id) return;
    await createGenericNotificationWithWebsocket(
      result.users.id,
      "refreshNotifications",
      `${user.firstName} is waiting for you to send them a transfer.`,
      "",
      "",
      user.id
    );
  });

  return res.status(200).send("");
});

export const notificationRouter = router;
