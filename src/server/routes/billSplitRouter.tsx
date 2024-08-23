import express from "express";
import { renderToHtml } from "jsxte";
import { BillSplitPage } from "../views/pages/BillSplit/BillSplitPage";
import {
  getReceipt,
  getReceiptDetailsFromReceiptItemId,
  getReceiptLineItems,
} from "../services/receipt.service";
import { getGroupWithMembers } from "../services/group.service";
import { SplitOptions } from "../views/pages/BillSplit/components/SplitOptions";
import { SplitEqually } from "../views/pages/BillSplit/components/SplitEqually";
import { SplitByAmount } from "../views/pages/BillSplit/components/SplitAmount";
import { SplitByPercentage } from "../views/pages/BillSplit/components/SplitPercentage";
import { SplitByItems } from "../views/pages/BillSplit/components/SplitItems";
import { findUser } from "../services/user.service";
import { SplitByItemsForm } from "../views/pages/BillSplit/components/SplitByItemsForm";
import { BillSplitReceipt } from "../views/pages/Groups/components/BillSplitReceipt";
import { SplitTypeSelector } from "../views/pages/BillSplit/components/SplitTypeSelector";

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

  console.log("Split type:", splitType);

  const receipt = await getReceipt(receiptId);
  const groupWithMembers = await getGroupWithMembers(groupId);
  const currentUser = await findUser(req.user!.id);

  if (!groupWithMembers || !receipt) {
    return res.status(404).send("Group or receipt not found");
  }

  if (!currentUser) {
    return res.status(404).send("User not found");
  }

  let splitOptionsHtml;
  let billSplitReceiptHtml;

  if (splitType === "Undo") {
    splitOptionsHtml = renderToHtml(
      <div
        hx-get={`/billSplit/overview/${receiptId}`}
        hx-trigger="load"
        hx-swap="innerHTML"
        hx-target="#app"
      />
    );
  } else if (splitType === "Equally") {
    splitOptionsHtml = renderToHtml(
      <SplitEqually
        group={groupWithMembers}
        transactionDetails={receipt}
        currentUser={currentUser}
      />
    );
  } else if (splitType === "Amount") {
    splitOptionsHtml = renderToHtml(
      <SplitByAmount group={groupWithMembers} transactionDetails={receipt} />
    );
  } else if (splitType === "Percentage") {
    splitOptionsHtml = renderToHtml(
      <SplitByPercentage
        group={groupWithMembers}
        transactionDetails={receipt}
      />
    );
  } else if (splitType === "Items") {
    splitOptionsHtml = renderToHtml(
      <SplitByItems
        group={groupWithMembers}
        transactionDetails={receipt}
        currentUser={currentUser}
      />
    );
  }

  const receiptItems = await getReceiptLineItems(receipt[0].id);
  billSplitReceiptHtml = renderToHtml(
    <BillSplitReceipt
      transactionsDetails={receipt}
      receiptItems={[receiptItems]}
      groupWithMembers={groupWithMembers}
      isSplit={splitType === "Items"}
    />
  );

  const html = `
    ${splitOptionsHtml}
    <div id="billSplitReceipt" hx-swap-oob="outerHTML">${billSplitReceiptHtml}</div>
  `;

  res.send(html);
});

router.get("/splitForm/:receiptId", async (req, res) => {
  const receiptId = req.params.receiptId;
  const splitType = req.query.splitType;

  const receiptDetails = await getReceiptDetailsFromReceiptItemId(receiptId);

  if (!receiptDetails) {
    return res.status(404).send("Receipt details not found");
  }

  const groupWithMembers = await getGroupWithMembers(
    receiptDetails.transactionReceipt.groupId
  );

  if (!groupWithMembers) {
    return res.status(404).send("Group not found");
  }

  const currentUser = await findUser(req.user!.id);

  if (!currentUser) {
    return res.status(404).send("User not found");
  }

  const html = renderToHtml(
    <SplitByItemsForm
      groupWithMembers={groupWithMembers}
      receiptItems={[receiptDetails.receiptsToItems]}
      splitType={splitType?.toString() ?? "Equally"}
      currentUser={currentUser}
    />
  );

  res.send(html);
});

router.get("/receipt/:receiptId/:groupId", async (req, res) => {
  const receiptId = req.params.receiptId;
  const groupId = req.params.groupId;
  const isSplit = req.query.isSplit;

  const receipt = await getReceipt(receiptId);

  if (!receipt) {
    return res.status(404).send("Receipt not found");
  }

  const receiptItems = await getReceiptLineItems(receipt[0].id);

  if (!receiptItems) {
    return res.status(404).send("Receipt items not found");
  }

  const groupWithMemebers = await getGroupWithMembers(groupId);

  if (!groupWithMemebers) {
    return res.status(404).send("Group not found");
  }

  const html = renderToHtml(
    <BillSplitReceipt
      transactionsDetails={receipt}
      receiptItems={[receiptItems]}
      groupWithMembers={groupWithMemebers}
      isSplit={isSplit === "true"}
    />
  );

  res.send(html);
});

router.get("/splitSelector/:splitType/:receiptId", async (req, res) => {
  const splitType = req.params.splitType;
  const receiptId = req.params.receiptId;

  console.log("Split type:", splitType, "receiptId:", receiptId);

  const transactionDetails = await getReceiptDetailsFromReceiptItemId(
    receiptId
  );

  if (!transactionDetails) {
    return res.status(404).send("Transaction details not found");
  }

  const html = renderToHtml(
    <SplitTypeSelector
      selectedType={splitType}
      receiptLineItem={[transactionDetails?.receiptsToItems]}
    />
  );

  const groupWithMembers = await getGroupWithMembers(
    transactionDetails?.transactionReceipt.groupId
  );

  if (!groupWithMembers) {
    return res.status(404).send("Group not found");
  }

  const currentUser = await findUser(req.user!.id);

  if (!currentUser) {
    return res.status(404).send("User not found");
  }

  const oobHtml = renderToHtml(
    <SplitByItemsForm
      groupWithMembers={groupWithMembers}
      receiptItems={[transactionDetails?.receiptsToItems]}
      splitType={splitType}
      currentUser={currentUser}
    />
  );

  const content = `
    ${html}
    <div id="splitForm-${receiptId}" hx-swap-oob="true">${oobHtml}</div>
  `;

  res.send(content);
});

router.get("/checkSplit/:userId", async (req, res) => {
  const ischecked = req.query.ischecked;
  console.log(ischecked, "Checking split");
  console.log(req.params.userId, "Checking split");
  let html;

  if (ischecked === "true") {
    html = renderToHtml(
      <>
        <img
          hx-get={`/billSplit/checkSplit/${req.params.userId}?ischecked=false`}
          hx-swap="innerHTML"
          hx-target="#splitOptionsRadioButton"
          hx-trigger="click"
          src="/activeIcons/unchecked_circle.svg"
          alt="selected icon"
          class="ml-1 cursor-pointer"
        />
        <input
          type="hidden"
          name={`${ischecked}-${req.params.userId}`}
          id="selectedIcon"
        />
      </>
    );
  } else {
    html = renderToHtml(
      <>
        <img
          hx-get={`/billSplit/checkSplit/${req.params.userId}?ischecked=true`}
          hx-swap="innerHTML"
          hx-target="#splitOptionsRadioButton"
          hx-trigger="click"
          src="/activeIcons/checked_blue_circle.svg"
          alt="selected icon"
          class="ml-1 cursor-pointer"
        />
        <input
          type="hidden"
          name={`${ischecked}-${req.params.userId}`}
          id="selectedIcon"
        />
      </>
    );
  }
  res.send(html);
});
export const billSplitRouter = router;
