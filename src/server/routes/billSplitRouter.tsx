import express from "express";
import { renderToHtml } from "jsxte";
import { BillSplitPage } from "../views/pages/BillSplit/BillSplitPage";
import { getReceipt, getReceiptLineItems } from "../services/receipt.service";
import { getGroupWithMembers } from "../services/group.service";
import { SplitOptions } from "../views/pages/BillSplit/components/SplitOptions";
import { SplitEqually } from "../views/pages/BillSplit/components/SplitEqually";
import { SplitByAmount } from "../views/pages/BillSplit/components/SplitAmount";
import { SplitByPercentage } from "../views/pages/BillSplit/components/SplitPercentage";
import { SplitByItems } from "../views/pages/BillSplit/components/SplitItems";
import { findUser } from "../services/user.service";

const router = express.Router();

router.get("/overview/:receiptId/:groupId", async (req, res) => {
  const receiptId = req.params.receiptId;
  const groupId = req.params.groupId;

  const receipt = await getReceipt(receiptId);

  if (!receipt) {
    return res.status(404).send("Receipt not found");
  }

  const receiptItems = await getReceiptLineItems(receipt[0].id);

  const groupWithMemebers = await getGroupWithMembers(groupId);

  if (!groupWithMemebers) {
    return res.status(404).send("Group not found");
  }

  const currentUser = await findUser(req.user!.id);

  if (!currentUser) {
    return res.status(404).send("User not found");
  }

  const html = renderToHtml(
    <BillSplitPage
      group={groupWithMemebers}
      transactionsDetails={receipt}
      receiptItems={receiptItems}
      currentUser={currentUser}
    />
  );

  res.send(html);
});

router.get("/splitOptions/:receiptId/:groupId", async (req, res) => {
  const splitType = req.query.splitType;
  const receiptId = req.params.receiptId;
  const groupId = req.params.groupId;

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
        groupId={groupId}
      />
    );
  }

  res.send(html);
});

router.get("/changeSplitOption/:receiptId/:groupId", async (req, res) => {
  const splitType = req.query.splitType;
  const receiptId = req.params.receiptId;
  const groupId = req.params.groupId;

  const receipt = await getReceipt(receiptId);
  const groupWithMemebers = await getGroupWithMembers(groupId);
  const currentUser = await findUser(req.user!.id);

  if (!groupWithMemebers || !receipt) {
    return res.status(404).send("Group or receipt not found");
  }

  if (!currentUser) {
    return res.status(404).send("User not found");
  }

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
  } else if (splitType === "Equally") {
    html = renderToHtml(
      <SplitEqually
        group={groupWithMemebers}
        transactionDetails={receipt}
        currentUser={currentUser}
      />
    );
  } else if (splitType === "Amount") {
    html = renderToHtml(
      <SplitByAmount group={groupWithMemebers} transactionDetails={receipt} />
    );
  } else if (splitType === "Percentage") {
    html = renderToHtml(
      <SplitByPercentage
        group={groupWithMemebers}
        transactionDetails={receipt}
      />
    );
  } else if (splitType === "Items") {
    html = renderToHtml(
      <SplitByItems
        group={groupWithMemebers}
        transactionDetails={receipt}
        currentUser={currentUser}
      />
    );
  }

  res.send(html);
});

export const billSplitRouter = router;
