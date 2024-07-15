import express from "express";
import { renderToHtml } from "jsxte";
import { AddReceiptPage } from "../views/pages/ReceiptScanning/ScanReceiptPage";
import { CaptureCameraPage } from "../views/pages/ReceiptScanning/CaptureCameraPage";

const router = express.Router();

router.get("/addReceipt", async (req, res) => {
  const html = renderToHtml(AddReceiptPage());
  res.send(html);
});

router.get("/captureCamera", async (req, res) => {
  const html = renderToHtml(CaptureCameraPage());
  res.send(html);
});

export const receiptRouter = router;
