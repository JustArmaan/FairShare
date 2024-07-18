import express from "express";
import { renderToHtml } from "jsxte";
import AddReceiptPage from "../views/pages/ReceiptScanning/ScanReceiptPage";

const router = express.Router();

router.get("/addReceipt", async (req, res) => {
  try {
    console.log("AddReceiptPage route hit");
    const html = renderToHtml(<AddReceiptPage />);
    res.send(html);
  } catch (error) {
    console.error("Error rendering AddReceiptPage:", error);
    res.status(500).send("Internal Server Error");
  }
});

export const receiptRouter = router;
