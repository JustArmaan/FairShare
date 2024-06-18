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
          hx-get="/home/page"
          hx-trigger="load"
          hx-swap="innerHTML"
        ></div>
        <div class="h-24" /> {/* spacer div to make up for nav bar*/}
        <div id="nav" hx-get="/nav" hx-trigger="load" hx-swap="outerHTML"></div>
      </>
    );
    return res.send(html);
  }
});

router.get("/layout", (req, res) => {
  const url = req.query.url as string;
  console.log("2", url);
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
        <div id="app" hx-get={url} hx-trigger="load" hx-swap="innerHTML"></div>
        <div class="h-24" /> {/* spacer div to make up for nav bar*/}
        <div id="nav" hx-get="/nav" hx-trigger="load" hx-swap="outerHTML"></div>
      </>
    );
    return res.send(html);
  }
});

router.get("/fullPageLoad", (req, res) => {
  const url = req.query.url as string;
  const formattedUrl = url.split("/").slice(3).join("/");
  console.log("1", formattedUrl);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fairshare</title>
  <script type="module" src="/src/client/main.ts" defer></script>
  <script src="https://unpkg.com/htmx.org@1.9.10"></script>
  <script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
  <link rel="stylesheet" href="/output.css" />
  <link rel="stylesheet" href="/global.css" />
  <link rel="icon" type="image/x-icon" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
  <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/ws.js"></script>
</head>
<body class="bg-primary-black-page">
  <div id="app" hx-get="/layout?url=${encodeURIComponent(
    formattedUrl
  )}" hx-trigger="load" hx-swap="outerHTML"></div>
  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
  </script>
</body>
</html>
`;
  res.send(html);
});

router.post("/webhook", (req, res) => {
  const event = req.body;

  console.log("Received webhook event:", event);

  res.status(200).send("Webhook received");
});

export const indexRouter = router;
