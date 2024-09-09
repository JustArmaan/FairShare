import { renderToHtml } from "jsxte";
import express from "express";
import { Intro } from "../views/pages/Intro/Intro";
import { ConnectItem } from "../views/pages/Login-Register/ConnectItem";
import { findUser } from "../services/user.service";

const router = express.Router();

router.get("/welcome", async (req, res) => {
  const html = renderToHtml(<Intro index={0}/>);
  res.send(html);
});

router.get("/connect", async (req, res) => {
  const user = await findUser(req.user!.id);
  const html = renderToHtml(<ConnectItem user={user?.firstName || "user"} />);
  res.send(html);
});

export const onboardRouter = router;
