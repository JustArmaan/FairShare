import express from "express";
import { renderToHtml } from "jsxte";
import { ErrorPage } from "../views/pages/Errors/Error";

const router = express.Router();

router.get("/:status", (req, res) => {
  const html = renderToHtml(
    <ErrorPage status={req.params.status ? req.params.status : 500} />
  );
  res.send(html);
});

export const errorRouter = router;
