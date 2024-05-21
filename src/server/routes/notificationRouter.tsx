import express from "express";
import { renderToHtml } from "jsxte";
import { getUser } from "./authRouter.ts";
import { NotificationPage } from "../views/pages/Notifications/NotificationsPage.tsx";
const router = express.Router();

router.get("/page", getUser, async (req, res) => {
  try {
    const html = renderToHtml(<NotificationPage />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

export const notificationRouter = router;
