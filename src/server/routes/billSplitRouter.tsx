import express from "express";
import { renderToHtml } from "jsxte";
import { BillSplitPage } from "../views/pages/BillSplit/BillSplitPage";
import {
  createSplitReceiptLineItem,
  getReceipt,
  getReceiptDetailsFromReceiptItemId,
  getReceiptLineItems,
  splitReceiptByAmount,
  splitReceiptEquallyBetweenMembers,
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
import { SaveSplit } from "../views/pages/BillSplit/components/SaveSplit";

const router = express.Router();

router.get("/overview/:receiptId/:groupId", async (req, res) => {
  const receiptId = req.params.receiptId;
  const groupId = req.params.groupId;
  const splitType = req.query.splitType;

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
      splitType={splitType?.toString() ?? "Equally"}
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
      <SplitByAmount
        group={groupWithMembers}
        transactionDetails={receipt}
        currentUser={currentUser}
      />
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
      splitType={(splitType as string) ?? "Equally"}
    />
  );

  const content = renderToHtml(
    <>
      <div class="flex flex-col w-full justify-center items-center">
        {splitOptionsHtml}
      </div>
      <div id="billSplitReceipt" hx-swap-oob="outerHTML">
        {billSplitReceiptHtml}
      </div>
      <div id="saveSplitButton" hx-swap-oob="outerHTML">
        <SaveSplit transactionsDetails={receipt} />
      </div>
    </>
  );

  res.send(content);
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
    <>
      <SplitByItemsForm
        groupWithMembers={groupWithMembers}
        receiptItems={[receiptDetails.receiptsToItems]}
        splitType={splitType?.toString() ?? "Equally"}
        currentUser={currentUser}
      />
    </>
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
      splitType="Equally"
    />
  );

  res.send(html);
});

router.get("/splitSelector/:splitType/:receiptId", async (req, res) => {
  const splitType = req.params.splitType;
  const receiptId = req.params.receiptId;

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

  // console.log(transactionDetails, "Transaction details");

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
    <div class="flex items-center w-full text-font-off-white mb-2" id="splitForm-${receiptId}" hx-swap-oob="outerHTML">${oobHtml}</div>
  `;

  res.send(content);
});

router.get("/checkSplit/:userId", async (req, res) => {
  const ischecked = req.query.ischecked;
  const receiptItemId = req.query.receiptItemId;
  let html;
  let targetId;
  let hxGetUrl;

  if (receiptItemId) {
    targetId = `#splitOptionsRadioButton${req.params.userId}-${receiptItemId}`;
    hxGetUrl = `/billSplit/checkSplit/${req.params.userId}?ischecked=${
      ischecked === "true" ? "false" : "true"
    }&receiptItemId=${receiptItemId}`;
  } else {
    targetId = `#splitOptionsRadioButton${req.params.userId}`;
    hxGetUrl = `/billSplit/checkSplit/${req.params.userId}?ischecked=${
      ischecked === "true" ? "false" : "true"
    }`;
  }

  if (ischecked === "true") {
    html = renderToHtml(
      <>
        <img
          hx-get={hxGetUrl}
          hx-swap="innerHTML"
          hx-target={targetId}
          hx-trigger="click"
          src="/activeIcons/unchecked_circle.svg"
          alt="selected icon"
          class="ml-1 cursor-pointer split-options-radio"
        />
      </>
    );
  } else {
    html = renderToHtml(
      <>
        <img
          hx-get={hxGetUrl}
          hx-swap="innerHTML"
          hx-target={targetId}
          hx-trigger="click"
          src="/activeIcons/checked_blue_circle.svg"
          alt="selected icon"
          class="ml-1 cursor-pointer"
        />
        <input
          type="hidden"
          name={`${ischecked}-${req.params.userId}`}
          value={req.params.userId}
          id="selectedIcon"
          class="split-options-radio"
        />
      </>
    );
  }

  res.send(html);
});

router.post("/saveSplit/:receiptId", async (req, res) => {
  const receiptId = req.params.receiptId;
  const receipt = await getReceipt(receiptId);

  if (!receipt) {
    return res.status(404).send("Receipt not found");
  }

  console.log(req.body, "Request body first");

  const { splitType } = req.body;

  if (splitType === "Equally") {
    const checkedMembers: string[] = [];

    for (let key in req.body) {
      if (key.startsWith("true-")) {
        const userId = key.replace("true-", "");
        checkedMembers.push(userId);
      }
    }
    if (checkedMembers.length === 0) {
      return res.status(400).send("Select at least one member");
    }
    await splitReceiptEquallyBetweenMembers(checkedMembers, receiptId);
  }

  if (splitType === "Amount") {
    const userAmounts: { userId: string; amount: number }[] = [];
    let totalEnteredAmount = 0;
    console.log("This is running");

    if (Array.isArray(req.body.splitAmount)) {
      const amounts = req.body.splitAmount;
      const checkedMembers = Object.keys(req.body)
        .filter((key) => key.startsWith("true-"))
        .map((key) => key.replace("true-", ""));

      checkedMembers.forEach((userId, index) => {
        const amount = parseFloat(amounts[index]);
        if (!isNaN(amount) && amount > 0) {
          userAmounts.push({ userId, amount });
          totalEnteredAmount += amount;
        }
      });
    } else {
      for (let key in req.body) {
        if (key.startsWith("splitAmount-")) {
          const userId = key.replace("splitAmount-", "");
          const amount = parseFloat(req.body[key]);

          if (!isNaN(amount) && amount > 0) {
            userAmounts.push({ userId, amount });
            totalEnteredAmount += amount;
          }
        }
      }
    }

    if (userAmounts.length === 0) {
      return res
        .status(400)
        .send("Enter a valid amount for at least one member");
    }

    const receiptTotal = receipt[0].total;
    if (totalEnteredAmount > receiptTotal) {
      return res
        .status(400)
        .send("The total amount allocated exceeds the receipt total");
    }

    await splitReceiptByAmount(userAmounts, receiptId);
  }

  if (splitType === "Percentage") {
    const userPercentages: { userId: string; percentage: number }[] = [];
    let totalPercentage = 0;

    for (let key in req.body) {
      if (key.startsWith("splitPercentage-")) {
        const userId = key.replace("splitPercentage-", "");
        const percentage = parseFloat(req.body[key]);

        if (!isNaN(percentage) && percentage > 0) {
          userPercentages.push({ userId, percentage });
          totalPercentage += percentage;
        }
      }
    }

    if (totalPercentage > 100) {
      return res.status(400).send("Total percentage exceeds 100%");
    }

    const totalAmount = parseFloat(receipt[0].total.toFixed(2));
    const userAmounts = userPercentages.map(({ userId, percentage }) => ({
      userId,
      amount: (percentage / 100) * totalAmount,
    }));

    await splitReceiptByAmount(userAmounts, receiptId);
  }

  if (splitType.includes("Items")) {
    const itemSplitType = req.body.itemSplitType;
    const receiptLineItemId = itemSplitType.split("-")[1];

    if (itemSplitType.startsWith("equal")) {
      const checkedMembers: string[] = [];

      for (let key in req.body) {
        if (key.startsWith("true-")) {
          const userId = key.replace("true-", "");
          checkedMembers.push(userId);
        }
      }

      if (checkedMembers.length === 0) {
        return res.status(400).send("Select at least one member");
      }

      const amountPerMember = receipt[0].total / checkedMembers.length;

      for (const userId of checkedMembers) {
        const groupTransactionToUsersToGroupsId = await splitReceiptByAmount(
          [{ userId: userId, amount: amountPerMember }],
          receiptId
        );

        if (!groupTransactionToUsersToGroupsId) {
          return res.status(500).send("Error splitting receipt");
        }

        await createSplitReceiptLineItem(
          receiptLineItemId,
          groupTransactionToUsersToGroupsId[0].id,
          amountPerMember
        );
      }
    }

    if (itemSplitType.startsWith("amount")) {
      const userAmountsMap: { [userId: string]: number } = {};

      for (let key in req.body) {
        if (key.startsWith("splitAmount-")) {
          const userId = key.replace("splitAmount-", "");
          const amount = parseFloat(req.body[key]);

          if (!isNaN(amount) && amount > 0) {
            if (userAmountsMap[userId]) {
              userAmountsMap[userId] += amount;
            } else {
              userAmountsMap[userId] = amount;
            }
          }
        }
      }

      const userAmounts = Object.entries(userAmountsMap).map(
        ([userId, amount]) => ({ userId, amount })
      );

      await splitReceiptByAmount(userAmounts, receiptId);

      for (const { userId, amount } of userAmounts) {
        const groupTransactionToUsersToGroupsId = await splitReceiptByAmount(
          [{ userId: userId, amount: amount }],
          receiptId
        );

        if (!groupTransactionToUsersToGroupsId) {
          return res.status(500).send("Error splitting receipt");
        }

        await createSplitReceiptLineItem(
          receiptLineItemId,
          groupTransactionToUsersToGroupsId[0].id,
          amount
        );
      }
    }

    if (itemSplitType.startsWith("percentage")) {
      const userPercentagesMap: { [userId: string]: number } = {};

      for (let key in req.body) {
        if (key.startsWith("splitPercentage-")) {
          const userId = key.replace("splitPercentage-", "");
          const percentage = parseFloat(req.body[key]);

          if (!isNaN(percentage) && percentage > 0) {
            if (userPercentagesMap[userId]) {
              userPercentagesMap[userId] += percentage;
            } else {
              userPercentagesMap[userId] = percentage;
            }
          }
        }
      }

      const totalAmount = parseFloat(receipt[0].total.toFixed(2));
      const userAmounts: { userId: string; amount: number }[] = [];

      for (const [userId, percentage] of Object.entries(userPercentagesMap)) {
        const amount = (percentage / 100) * totalAmount;
        userAmounts.push({ userId, amount });
      }

      const groupTransactionToUserToGroupsResult = await splitReceiptByAmount(
        userAmounts,
        receiptId
      );

      if (!groupTransactionToUserToGroupsResult) {
        return res.status(500).send("Error splitting receipt");
      }

      for (const { userId, amount } of userAmounts) {
        await createSplitReceiptLineItem(
          receiptLineItemId,
          groupTransactionToUserToGroupsResult[0].id,
          amount
        );
      }
    }
  }

  res.sendStatus(200);
});

router.post("/amount", async (req, res) => {
  const memberId = req.body.memberId;
  const totalAmount = parseFloat(req.body.totalOwed);
  const splitAmount = parseFloat(req.body.splitAmount);

  console.log(req.body);

  if (totalAmount === 0) {
    return res.status(400).send("Amount cannot be zero");
  } else {
    const updatedAmount = totalAmount - splitAmount;
    if (updatedAmount < 0) {
      return res.status(400).send(`Amount cannot be more than ${totalAmount}`);
    }
    res.send(updatedAmount.toFixed(2));
    console.log(updatedAmount, "Updated Amount");
  }
});
export const billSplitRouter = router;
