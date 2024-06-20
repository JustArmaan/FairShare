import express from "express";
import InstitutionsPage from "../views/pages/transactions/InstitutionPage";
import { deleteItem, getItem, getItemsForUser } from "../services/plaid.service";
import { renderToHtml } from "jsxte";

const router = express.Router();

router.get("/page", async (req, res) => {
  try {
    const info = await getItemsForUser(req.user!.id);
    const html = renderToHtml(<InstitutionsPage info={info ? info : []} />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.post("/delete/:itemId", async (req, res) => {
  try {
    const item = await getItem(req.params.itemId);
    if (!item || item.userId !== req.user!.id) return res.status(404).send(); // 404 when unauthorized to prevent exposing id information
    await deleteItem(req.params.itemId);
    const html = renderToHtml(
      <div
        hx-get="/institutions/page"
        hx-trigger="load"
        hx-swap="innerHTML"
        hx-target="#app"
      />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get("/edit", async (req, res) => {
  try {
    const info = await getItemsForUser(req.user!.id);
    const html = renderToHtml(
      <InstitutionsPage info={info ? info : []} edit />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

export const institutionRouter = router;
