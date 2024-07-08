import express from "express";
import { renderToHtml } from "jsxte";
import { NotificationPage } from "../views/pages/Notifications/NotificationsPage.tsx";
import { NotificationList } from "../views/pages/Notifications/NotificationList.tsx";
import {
  deleteAllNotificationsForUser,
  getAllGroupNotificationsForUser,
} from "../services/notification.service.ts";
import { NotificationIcon } from "../views/components/NavigationIcon.tsx";
import Reminder from "../views/pages/Notifications/components/Reminder.tsx";
import { findUser } from "../services/user.service.ts";
import NotificationPicker from "../views/pages/Notifications/components/NotificationPicker.tsx";

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
    const notifications = await getAllGroupNotificationsForUser(req.user!.id);
    const sort = req.query.sort as string;

    if (!notifications) {
      return res.status(404).send("Problem with notification");
    }

    const html = renderToHtml(
      <NotificationList
        notifications={notifications}
        selectedSort={sort ?? "Most Recent"}
      />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get("/notificationIcon", async (req, res) => {
  try {
    const userId = req.user!.id;
    if (!userId) {
      return res.status(404).send("No userId");
    }

    const notifications = await getAllGroupNotificationsForUser(req.user!.id);

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
  await deleteAllNotificationsForUser(req.body.userToGroupId);

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

export const notificationRouter = router;
