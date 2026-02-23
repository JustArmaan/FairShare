import express from "express";
import { renderToHtml } from "jsxte";
import { Header } from "../views/components/Header";
import { Menu } from "../views/components/Menu";
import { Nav } from "../views/components/Navigation";
import { Login } from "../views/pages/Onboarding/Login";

const router = express.Router();

router.get("/boot", (req, res) => {
  if (req.user) {
    res.set("HX-Redirect", "/home/page/default");
    return res.send("");
  }
  const html = renderToHtml(<Login />);
  return res.send(html);
});

router.get("/header", (_, res) => {
  const html = renderToHtml(<Header />);
  res.send(html);
});

router.get("/nav", (req, res) => {
  const html = renderToHtml(
    req.get("referer")?.includes("mobile/link") ? <></> : <Nav />
  );
  res.send(html);
});

router.get("/menu", (req, res) => {
  try {
    const open = req.query.open as string;
    const html = renderToHtml(<Menu value={open === "true"} />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get("/empty", (req, res) => {
  res.send("");
});

router.get("/signin", (req, res) => {
  if (req.user) {
    res.set("HX-Redirect", "/home/page/default");
    return res.send("");
  }
  const html = renderToHtml(<Login />);
  return res.send(html);
});

router.get("/onboard", (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  return res.redirect("/home/page/default");
});

router.get("/will-error", async (req, res) => {
  console.log("hit error route");
  await new Promise((_, rej) => {
    rej("Unknown Error");
  });
});

router.post("/webhook", (req, res) => {
  res.status(200).send("Webhook received");
});

export const indexRouter = router;
