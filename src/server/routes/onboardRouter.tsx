import { renderToHtml } from "jsxte";
import express from "express";
import { Initial } from "../views/pages/Login-Register/Initial";
import { Initial1 } from "../views/pages/Login-Register/Initial1";
import { Initial2 } from "../views/pages/Login-Register/Initial2";
import { Initial3 } from "../views/pages/Login-Register/Initial3";
import { Initial4 } from "../views/pages/Login-Register/Initial4";

const router = express.Router();

router.get("/welcome", async (req, res) => {
  const html = renderToHtml(<Initial />);
  res.send(html);
});

router.get("/scan", async (req, res) => {
  const html = renderToHtml(<Initial1 />);
  res.send(html);
});

router.get("/share", async (req, res) => {
  const html = renderToHtml(<Initial2 />);
  res.send(html);
});

router.get("/embark", async (req, res) => {
  const html = renderToHtml(<Initial3 />);
  res.send(html);
});

router.get("/master", async (req, res) => {
  const html = renderToHtml(<Initial4 />);
  res.send(html);
});

export const onboardRouter = router;
