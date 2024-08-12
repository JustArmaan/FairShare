import express from "express";
import { renderToHtml } from "jsxte";
import AddReceiptPage from "../views/pages/ReceiptScanning/ScanReceiptPage";
import { rateLimit } from "../utils/rateLimit";
import path from "path";
import fs from "fs";
import upload from "../utils/multerConfig";
import { AddReceiptManuallyPage } from "../views/pages/ReceiptScanning/AddReceiptManuallyPage";
import { ro } from "@faker-js/faker";
import { BillSplitReceipt } from "../views/pages/Groups/components/BillSplitReceipt";

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

      const transactionDetails = {
        companyName: "Guu Thurlow",
        address: "838 Thurlow St, Vancouver",
        date: "March 28, 2024 16:04",
        transactionId: "ID123456321",
      };

      const itemizedTransaction = [
        {
          item: "Ebi Mayo",
          quantity: 1,
          price: 16.0,
          owingMembers: [],
        },
        {
          item: "Asahi Pitcher",
          quantity: 1,
          price: 22.0,
          owingMembers: [],
        },
        {
          item: "Katsu Curry",
          quantity: 1,
          price: 20.0,
          owingMembers: [],
        },
        {
          item: "Beef Yakisoba",
          quantity: 1,
          price: 21.0,
          owingMembers: [],
        },
        {
          item: "AAA BBQ Beef",
          quantity: 1,
          price: 26.5,
          owingMembers: [],
        },
        {
          item: "Oolong Tea",
          quantity: 1,
          price: 2.5,
          owingMembers: [],
        },
      ];

      const html = renderToHtml(
        <BillSplitReceipt
          transactionsDetails={transactionDetails}
          receiptItems={itemizedTransaction}
        />
      );

      res.send(html);
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
