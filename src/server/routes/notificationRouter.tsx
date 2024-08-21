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
  getGenericNotificationById,
  getGenericNotificationByNotificationId,
  getGroupInviteByNotificationId,
  getGroupInviteNotificaitonById,
  getGroupNotificationById,
  getGroupNotificationByNotificationId,
  getNotificationTypeById,
  getNotificationTypeByType,
  getUnreadNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type CombinedNotification,
} from "../services/notification.service.ts";
import { getGroupOwnerWithGroupId } from "../services/group.service.ts";
import Reminder from "../views/pages/Notifications/components/Reminder.tsx";

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

router.get("/notificationList/:userId", async (req, res) => {
  try {
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
    const groupOwner = await getGroupOwnerWithGroupId(
      inviteNotifications[0].groupInvite.id
    );

    const html = renderToHtml(
      <NotificationList
        inviteNotifications={inviteNotifications}
        notifications={notifications}
        selectedSort={sort}
        groupOwner={groupOwner ?? undefined}
      />
    );

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching notifications");
  }
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
  const notifcationTypeId = req.query.notificationTypeId as string;
  const notificationId = req.params.notificationId;

  const notificationType = await getNotificationTypeById(notifcationTypeId);

  if (!notificationType) {
    return res.status(404).send("No notification type found");
  }

  let notifications;

  if (notificationType.type === "invite") {
    notifications = await getGroupInviteByNotificationId(notificationId);
  } else if (notificationType.type === "generic") {
    notifications = await getGenericNotificationByNotificationId(
      notificationId
    );
  } else if (notificationType.type === "group") {
    notifications = await getGroupNotificationByNotificationId(notificationId);
  }

  console.log(notifications, "notifications");

  if (!notifications) {
    return res.status(404).send("No notifications found");
  }

  const html = renderToHtml(<Reminder notifications={notifications} />);

  await markNotificationAsRead(notificationId);

  res.send(html);
});

export const notificationRouter = router;
