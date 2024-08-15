import express from "express";
import { renderToHtml } from "jsxte";
import AddReceiptPage from "../views/pages/ReceiptScanning/ScanReceiptPage";
import { rateLimit } from "../utils/rateLimit";
import path from "path";
import fs from "fs";
import upload from "../utils/multerConfig";
import { AddReceiptManuallyPage } from "../views/pages/ReceiptScanning/AddReceiptManuallyPage";
import { getReceiptData } from "../integrations/receipts/getReceiptData";
import { ConfirmReceiptPage } from "../views/pages/ReceiptScanning/ConfirmReceiptPage";
import { v4 as uuidv4 } from "uuid";
import { EditReceiptPage } from "../views/pages/ReceiptScanning/EditReceiptPage";
import {
  createReceipt,
  createReceiptLineItems,
  type ReceiptLineItem,
  type ReceiptLineItems,
} from "../services/receipt.service";

const router = express.Router();

router.post("/editReceipt", async (req, res) => {
  const { transactionsDetails, receiptItems } = req.body;

  try {
    const transactionDetails = JSON.parse(transactionsDetails);
    let itemizedTransaction = JSON.parse(receiptItems);

    itemizedTransaction = itemizedTransaction.flat(1);

    const html = renderToHtml(
      <EditReceiptPage
        transactionsDetails={transactionDetails}
        receiptItems={itemizedTransaction}
      />
    );

    res.send(html);
  } catch (error) {
    console.error("Error processing receipt items:", error);
    res.status(500).send("Internal Server Error");
  }
});

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
      });

      writeStream.on("error", (err) => {
        console.error("Error writing file:", err);
        res.status(500).send("Internal Server Error");
      });

      const relativePath =
        "/py-receipt-server/temp/" + filePath.split("\\").pop();

      const receiptResponse = await getReceiptData(
        __dirname + "/../.." + relativePath
      );

      const { extracted_text } = receiptResponse;

      const transactionDetails: {
        id: string;
        timestamp: string | null;
        transactionId: string | null;
        total: number;
        subtotal: number;
        phone: string;
        storeAddress: string;
        storeName: string;
        tax: number;
        tips: number;
        discount: number;
      }[] = [
        {
          id: uuidv4(),
          timestamp: null,
          transactionId: null,
          total: parseFloat(extracted_text.total.slice(1)) || 0,
          subtotal: parseFloat(extracted_text.subtotal.slice(1)) || 0,
          phone: extracted_text.phone || "",
          storeAddress: extracted_text.store_addr || "",
          storeName: extracted_text.store_name || "",
          tax: parseFloat(extracted_text.tax.slice(1)) || 0,
          tips: parseFloat(extracted_text.tips.slice(1)) || 0,
          discount: 0,
        },
      ];

      const itemizedTransaction: {
        id: string;
        productName: string;
        quantity: number;
        costPerItem: number;
        transactionReceiptId: string;
      }[] = extracted_text.line_items.map((item) => ({
        id: uuidv4(),
        productName: item.item_name,
        quantity: parseFloat(item.item_quantity),
        costPerItem: parseFloat(item.item_value.slice(1)),
        transactionReceiptId: transactionDetails[0].id,
      }));

      const transactionDetailsJSON = JSON.stringify(transactionDetails);
      const itemizedTransactionJSON = JSON.stringify(itemizedTransaction);

      const data = {
        transactionsDetails: transactionDetailsJSON,
        itemizedTransaction: itemizedTransactionJSON,
      };

      res.json(data);
    } catch (error) {
      console.error("Error processing receipt:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/confirmReceipt", async (req, res) => {
  console.log("POST request received at /confirmReceipt", req.body);

  const { transactionsDetails, itemizedTransaction } = req.body;

  if (!transactionsDetails || !itemizedTransaction) {
    return res.status(400).send("Missing required data.");
  }

  try {
    const transactionDetails = JSON.parse(transactionsDetails);
    let receiptItems = JSON.parse(itemizedTransaction);

    const html = renderToHtml(
      <ConfirmReceiptPage
        transactionsDetails={transactionDetails}
        receiptItems={[receiptItems]}
      />
    );

    res.send(html);
  } catch (error) {
    console.error("Error parsing data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/addManually", async (req, res) => {
  const html = renderToHtml(<AddReceiptManuallyPage />);

  res.send(html);
});

router.get("/addInput", async (req, res) => {
  const index = req.query.index;
  console.log("Index:", index);

  const html = `
    <div class="flex justify-between mb-1 w-full receipt-input-container">
      <input
        type="text"
        name="items[${index}].productName"
        placeholder="Item Name"
        class="w-[50%] bg-primary-faded-black text-font-off-white pl-2"
      />
      <input
        type="text"
        name="items[${index}].quantity"
        placeholder="Quantity"
        class="w-[20%] bg-primary-faded-black text-font-off-white text-center"
      />
      <input
        type="text"
        name="items[${index}].costPerItem"
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

router.post("/postReceipt", async (req, res) => {
  console.log("POST request received at /postReceipt", req.body);
  try {
    const {
      storeName,
      storeAddress,
      timestamp,
      transactionId,
      subtotal,
      tax,
      tips,
      discount,
      total,
      ...items
    } = req.body;

    if (!storeName) {
      return res.status(400).send("Please add a store name to continue.");
    }

    if (!storeAddress) {
      return res.status(400).send("Please add a store address to continue.");
    }

    if (!timestamp) {
      return res.status(400).send("Please add a timestamp to continue.");
    }

    const parseOrFallback = (value: string, fallback: number = 0) => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? fallback : parsed;
    };

    const receipt = {
      id: uuidv4(),
      storeName,
      storeAddress,
      timestamp,
      transactionId,
      subtotal: parseOrFallback(subtotal),
      tax: parseOrFallback(tax),
      tips: parseOrFallback(tips),
      discount: parseOrFallback(discount),
      phone: "",
      total: parseOrFallback(total),
    };

    const savedReceipt = await createReceipt([receipt]);

    const lineItems: ReceiptLineItems = [] as ReceiptLineItems;

    for (const key in items) {
      if (Object.prototype.hasOwnProperty.call(items, key)) {
        const keyParts = key.split(".");

        if (keyParts.length === 2 && keyParts[0].startsWith("items[")) {
          const indexPart = keyParts[0].slice(6, -1);
          const index = parseInt(indexPart, 10);

          const field = keyParts[1] as keyof ReceiptLineItem;

          lineItems[index] =
            lineItems[index] ||
            ({
              id: uuidv4(),
              transactionReceiptId: savedReceipt.id,
            } as ReceiptLineItem);

          if (field === "quantity") {
            const quantity = parseOrFallback(items[key], undefined);
            if (quantity === null || quantity <= 0) {
              return res
                .status(400)
                .send(`Invalid quantity for item ${index}.`);
            }
            lineItems[index].quantity = quantity;
          } else if (field === "costPerItem") {
            const costPerItem = parseOrFallback(items[key], undefined);
            if (costPerItem === null || costPerItem <= 0) {
              return res.status(400).send(`Invalid price for item ${index}.`);
            }
            lineItems[index].costPerItem = costPerItem;
          } else if (field === "productName") {
            if (!items[key]) {
              return res
                .status(400)
                .send(`Product name for item ${index} cannot be empty.`);
            }
            lineItems[index].productName = items[key];
          }
        }
      }
    }

    await createReceiptLineItems(lineItems);
    console.log("Receipt saved successfully");
    res.send("Receipt saved successfully");
  } catch (error) {
    console.error("Error saving receipt:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/postReceiptBulk", async (req, res) => {
  console.log("POST request received at /postReceiptBulk", req.body);
  const { transactionsDetails, receiptItems } = req.body;

  try {
    const transactionDetailsArray = JSON.parse(transactionsDetails);
    let itemizedTransaction = JSON.parse(receiptItems);

    itemizedTransaction = itemizedTransaction.flat(1);

    const transactionDetails = transactionDetailsArray[0];

    if (!transactionDetails.storeName) {
      return res
        .status(400)
        .send("Edit the receipt and add a store name to continue.");
    }

    if (!transactionDetails.storeAddress) {
      return res
        .status(400)
        .send("Edit the receipt and add a store address to continue.");
    }

    if (!transactionDetails.timestamp) {
      return res
        .status(400)
        .send("Edit the receipt and add a timestamp to continue.");
    }

    for (let i = 0; i < itemizedTransaction.length; i++) {
      const item = itemizedTransaction[i];

      if (!item.productName || typeof item.productName !== "string") {
        return res
          .status(400)
          .send(`Item ${i + 1}: Product name is missing or invalid.`);
      }

      if (
        !item.quantity ||
        isNaN(parseFloat(item.quantity)) ||
        parseFloat(item.quantity) <= 0
      ) {
        return res
          .status(400)
          .send(`Item ${i + 1}: Quantity is missing or invalid.`);
      }

      if (
        !item.costPerItem ||
        isNaN(parseFloat(item.costPerItem)) ||
        parseFloat(item.costPerItem) <= 0
      ) {
        return res
          .status(400)
          .send(`Item ${i + 1}: Price is missing or invalid.`);
      }
    }

    const savedReceipt = await createReceipt([transactionDetails]);

    const lineItems: ReceiptLineItems = [] as ReceiptLineItems;

    for (let i = 0; i < itemizedTransaction.length; i++) {
      const item = itemizedTransaction[i];

      lineItems.push({
        id: uuidv4(),
        transactionReceiptId: savedReceipt.id,
        productName: item.productName,
        quantity: parseFloat(item.quantity),
        costPerItem: parseFloat(item.costPerItem),
      });
    }

    await createReceiptLineItems(lineItems);

    console.log("Receipt and line items saved successfully");
    res.send("Receipt processed successfully.");
  } catch (error) {
    console.error("Error processing receipt items:", error);
    res.status(500).send("Internal Server Error");
  }
});

export const receiptRouter = router;
