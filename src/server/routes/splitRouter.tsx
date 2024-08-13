import express from "express";
import { renderToHtml } from "jsxte";

const router = express.Router();

router.get("/view", async (req, res) => {
  const html = renderToHtml(<></>);

  res.send(html);
});

export const splitRouter = router;
