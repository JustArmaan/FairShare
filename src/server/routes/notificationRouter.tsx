import express from 'express';
import { renderToHtml } from 'jsxte';
import { getUser } from './authRouter.ts';
import { NotificationPage } from '../views/pages/Notifications/NotificationsPage.tsx';
import { NotificationList } from '../views/pages/Notifications/NotificationList.tsx';
import { getAccountsForUser } from '../services/plaid.service';
import {
  deleteAllNotificationsForUser,
  getAllGroupNotificationsForUser,
} from '../services/notification.service.ts';
import { NotificationIcon } from '../views/components/NavigationIcon.tsx';

const router = express.Router();

router.get('/page', getUser, async (req, res) => {
  try {
    const userId = req.user!.id;
    if (!userId) {
      return res.status(404).send('No userId');
    }

    const html = renderToHtml(<NotificationPage userId={userId} />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get('/notificationList/:userId', getUser, async (req, res) => {
  try {
    const notifications = await getAllGroupNotificationsForUser(req.user!.id);

    if (!notifications) {
      return res.status(404).send('Problem with notification');
    }

    const html = renderToHtml(
      <NotificationList notifications={notifications} />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get('/notificationIcon', getUser, async (req, res) => {
  try {
    const userId = req.user!.id;
    if (!userId) {
      return res.status(404).send('No userId');
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

router.post('/clearNotifications', getUser, async (req, res) => {
  await deleteAllNotificationsForUser(req.body.userToGroupId);

  const html = renderToHtml(
    <>
      <div
        hx-get='notification/notificationIcon'
        hx-target='#notification-icon'
        hx-swap='outerHTML'
        hx-trigger='load'
      ></div>
      <div
        hx-get='/notification/page'
        hx-swap='innerHTML'
        hx-target='#app'
        hx-trigger='load'
      ></div>
    </>
  );

  res.send(html);
});

export const notificationRouter = router;
