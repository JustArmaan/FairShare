import express from "express";
import { renderToHtml } from "jsxte";
import { PlaidMobileLinkPage } from "../views/pages/PlaidMobileLink/PlaidMobileLinkPage";
import { cookieOptions } from "./authRouter";
import InstitutionsPage from "../views/pages/transactions/InstitutionPage";
import { getItemsForUser } from "../services/plaid.service";

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
      res.cookie(key, req.query[key], cookieOptions);
    });
    return res.redirect("/mobile/link");
  } catch (e) {
    console.log(e);
    return res.status(404).send();
  }
});

router.get("/link", async (req, res) => {
  const items = await getItemsForUser(req.user!.id);
  const html = renderToHtml(<InstitutionsPage info={items} mobile={true} />);
  /*
  const html = renderToHtml(
    <PlaidMobileLinkPage
      connected={req.query?.connected as boolean | undefined}
    />
  );
  */
  return res.send(html);
});

export const plaidMobileLinkRouter = router;
