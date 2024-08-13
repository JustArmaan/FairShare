import express from "express";
import { renderToHtml } from "jsxte";
import AddReceiptPage from "../views/pages/ReceiptScanning/ScanReceiptPage";
import { rateLimit } from "../utils/rateLimit";
import path from "path";
import fs from "fs";
import upload from "../utils/multerConfig";
import { AddReceiptManuallyPage } from "../views/pages/ReceiptScanning/AddReceiptManuallyPage";
import { ro } from "@faker-js/faker";

const router = express.Router();

router.get("/addReceipt", async (req, res) => {
  try {
    const html = renderToHtml(<AddReceiptPage />);
    res.send(html);
  } catch (error) {
    console.error("Error rendering AddReceiptPage:", error);
    res.status(500).send("Internal Server Error");
  }
});

const rateLimitOptions = {
  windowMs: 60000,
  maxRequests: 5,
};

router.post(
  "/next",
  rateLimit(rateLimitOptions),
  upload.single("image"),
  async (req: express.Request, res) => {
    try {
      const outDir = path.join(
        __dirname,
        "..",
        "..",
        "py-receipt-server",
        "temp"
      );

      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      const imageData = req.file.buffer;
      const filename = `image_${Date.now()}.jpg`;
      const filePath = path.join(outDir, filename);

      const writeStream = fs.createWriteStream(filePath);

      writeStream.write(imageData);
      writeStream.end();

      writeStream.on("finish", () => {
        console.log(`Image saved to ${filePath}`);
        res.send("Success");
      });

      writeStream.on("error", (err) => {
        console.error("Error writing file:", err);
        res.status(500).send("Internal Server Error");
      });
    } catch (error) {
      console.error("Error processing receipt:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/addManually", async (req, res) => {
  const html = renderToHtml(<AddReceiptManuallyPage />);

  res.send(html);
});

router.get("/addInput", async (req, res) => {
  const html = `
    <div class="flex justify-between mb-1 w-full receipt-input-container">
      <input
        type="text"
        placeholder="Item Name"
        class="w-[50%] bg-primary-faded-black text-font-off-white pl-2"
      />
      <input
        type="text"
        placeholder="Quantity"
        class="w-[20%] bg-primary-faded-black text-font-off-white text-center"
      />
      <input
        type="text"
        placeholder="Price"
        class="w-[20%] bg-primary-faded-black text-font-off-white text-center"
      />
    </div>`;
  res.send(html);
});

router.get("/addPaymentMethod", async (req, res) => {
  const html = renderToHtml(`<div>This still needs to be implemented</div>`);

  res.send(html);
});

export const receiptRouter = router;
