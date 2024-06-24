import express from "express";
import { renderToHtml } from "jsxte";
import { Header } from "../views/components/Header";
import { Nav } from "../views/components/Navigation";
import { Menu } from "../views/components/Menu";
import { Login } from "../views/pages/Onboarding/Login";

const router = express.Router();

router.get("/header", (_, res) => {
  try {
    const html = renderToHtml(<Header />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get("/nav", (_, res) => {
  try {
    const html = renderToHtml(<Nav />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
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
  const html = renderToHtml(<Login />);
  return res.send(html);
});

router.get("/onboard", (req, res) => {
  if (!req.user) {
    const html = renderToHtml(<Login />);

    return res.send(html);
  } else {
    const html = renderToHtml(
      <>
        <div
          id="header"
          hx-get="/header"
          hx-trigger="load"
          hx-swap="outerHTML"
        ></div>
        <div
          id="app"
          hx-get="/home/page/default"
          hx-trigger="load"
          hx-swap="innerHTML"
          hx-push-url="/home/page/default"
        ></div>
        <div class="h-24" /> {/* spacer div to make up for nav bar*/}
        <div id="nav" hx-get="/nav" hx-trigger="load" hx-swap="outerHTML"></div>
      </>
    );
    return res.send(html);
  }
});

router.get("/will-error", async (req, res) => {
  console.log("hit error route");

  await new Promise((_, rej) => {
    rej("Unknown Error");
  });
});

router.post("/webhook", (req, res) => {
  const event = req.body;

  console.log("Received webhook event:", event);

  res.status(200).send("Webhook received");
});

export const indexRouter = router;
