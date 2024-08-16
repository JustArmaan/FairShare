import express from "express";
import { renderToHtml } from "jsxte";
import { BillSplitPage } from "../views/pages/BillSplit/BillSplitPage";
import { getReceipt, getReceiptLineItems } from "../services/receipt.service";
import { getGroupWithMembers } from "../services/group.service";
import { SplitOptions } from "../views/pages/BillSplit/components/SplitOptions";

const router = express.Router();

router.get("/overview/:receiptId", async (req, res) => {
  const receiptId = req.params.receiptId;

  console.log("Receipt ID:", receiptId);

  const receipt = await getReceipt(receiptId);

  console.log("Receipt:", receipt);

  if (!receipt) {
    return res.status(404).send("Receipt not found");
  }

  const receiptItems = await getReceiptLineItems(receipt[0].id);

  console.log("Receipt items:", receiptItems);

  const groupWithMemebers = await getGroupWithMembers(
    "b4b5615b-110d-4426-80b6-ab828b87f165"
  );

  console.log("Group with members:", groupWithMemebers);

  if (!groupWithMemebers) {
    return res.status(404).send("Group not found");
  }

  const html = renderToHtml(
    <BillSplitPage
      group={groupWithMemebers}
      transactionsDetails={receipt}
      receiptItems={receiptItems}
    />
  );

  res.send(html);
});

router.get("/splitOptions/:receiptId", async (req, res) => {
  const splitType = req.query.splitType;
  const receiptId = req.params.receiptId;

  let html;

  if (splitType === "Undo") {
    html = renderToHtml(
      <div
        hx-get={`/billSplit/overview/${receiptId}`}
        hx-trigger="load"
        hx-swap="innerHTML"
        hx-target="#app"
      />
    );
  } else {
    html = renderToHtml(
      <SplitOptions
        splitType={splitType?.toString() ?? "Equally"}
        receiptId={receiptId}
      />
    );
  }

  res.send(html);
});

export const billSplitRouter = router;
