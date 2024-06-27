import express from "express";
import { renderToHtml } from "jsxte";
import { PlaidMobileLinkPage } from "../views/pages/PlaidMobileLink/PlaidMobileLinkPage";
import { cookieOptions } from "./authRouter";

const router = express.Router();

router.get("/auth", (req, res) => {
  try {
    [
      "ac-state-key",
      "id_token",
      "access_token",
      "user",
      "refresh_token",
    ].forEach((key) => {
      if (!req.query[key]) throw new Error("Missing auth cookies in request");
      res.cookie(key, req.query[key], cookieOptions);
    });
    console.log("All cookies set for redirect with session!");
  } catch (e) {
    return res.status(404).send();
  }
});

router.get("/link", (req, res) => {
  if (!req.user) {
    return res.status(403).send();
  }
  const html = renderToHtml(
    <PlaidMobileLinkPage
      connected={req.query?.connected as boolean | undefined}
    />
  );
  return res.send(html);
});

export const plaidMobileLinkRouter = router;
