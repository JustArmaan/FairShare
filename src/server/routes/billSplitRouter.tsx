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
import { UncheckedMember } from "../views/pages/BillSplit/components/UncheckedMember";
import { transactionReceipt } from "../database/schema/transactionReceipt";
import { CheckedMember } from "../views/pages/BillSplit/components/CheckedMember";

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

router.get("/checkSplit/:userId/:receiptId", async (req, res) => {
  const ischecked = req.query.ischecked;
  const receiptItemId = req.query.receiptItemId as string;
  const splitType = req.query.splitType;
  const userId = req.params.userId;
  let html;
  let targetId;
  let hxGetUrl;

  console.log(
    "receiptItemId",
    receiptItemId,
    "ischecked",
    ischecked,
    "splitType",
    splitType,
    "userId",
    userId
  );

  const receiptDetails = await getReceipt(req.params.receiptId);

  if (!receiptDetails) {
    res.status(404).send("Receipt details not found");
  }

  if (receiptItemId) {
    targetId = `#splitOptionsRadioButton${req.params.userId}-${receiptItemId}`;
    hxGetUrl = `/billSplit/checkSplit/${req.params.userId}/${
      req.params.receiptId
    }/?ischecked=${
      ischecked === "true" ? "false" : "true"
    }&receiptItemId=${receiptItemId}`;
  } else {
    targetId = `#splitOptionsRadioButton${req.params.userId}`;
    hxGetUrl = `/billSplit/checkSplit/${
      req.params.userId
    }/req.params.receiptId?ischecked=${
      ischecked === "true" ? "false" : "true"
    }`;
  }

  const groupWithMembers = await getGroupWithMembers(
    receiptDetails?.[0].groupId as string
  );

  const user = groupWithMembers?.members.find((member) => member.id === userId);

  if (!user) {
    return res.status(404).send("User not found");
  }

  const currentUser = await findUser(req.user!.id);

  if (!currentUser) {
    return res.status(404).send("User not found");
  }

  if (ischecked === "true") {
    html = renderToHtml(
      <>
        <UncheckedMember
          receiptId={receiptDetails[0].id as string}
          member={user}
          currentUser={currentUser}
        />
      </>
    );
  } else {
    html = renderToHtml(
      <>
        <CheckedMember
          member={user}
          currentUser={currentUser}
          splitType={(splitType as string) ?? "Equally"}
          receipt={receiptDetails}
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
    const receiptLineItems = req.body.itemSplitType;

    const userTotals: { [userId: string]: number } = {};

    for (let i = 0; i < receiptLineItems.length; i++) {
      const itemSplitType = receiptLineItems[i];
      const match = itemSplitType.match(/^(equal|amount|percentage)-(.+)$/);
      if (!match) {
        console.error("Invalid itemSplitType format");
        return res.status(400).send("Invalid item split type format");
      }

      const splitType = match[1];
      const receiptItemId = match[2];

      if (itemSplitType.startsWith("equal")) {
        const checkedMembers: string[] = [];

        for (let key in req.body) {
          if (key.startsWith("true-")) {
            const userId = key.replace("true-", "");
            checkedMembers.push(userId);
          }
        }

        if (checkedMembers.length === 0) {
          console.error("No members selected for equal split.");
          return res.status(400).send("Select at least one member");
        }

        const amountPerMember = receipt[0].total / checkedMembers.length;

        for (const userId of checkedMembers) {
          if (!userTotals[userId]) {
            userTotals[userId] = 0;
          }
          userTotals[userId] += amountPerMember;

          const groupTransactionToUsersToGroupsId = await splitReceiptByAmount(
            [{ userId, amount: amountPerMember }],
            receiptId
          );

          if (!groupTransactionToUsersToGroupsId) {
            console.error("Error splitting receipt for equal split.");
            return res.status(500).send("Error splitting receipt");
          }

          await createSplitReceiptLineItem(
            receiptItemId,
            groupTransactionToUsersToGroupsId[0].id,
            amountPerMember
          );
        }
      }

      if (itemSplitType.startsWith("amount")) {
        for (let key in req.body) {
          if (key.startsWith("splitAmount-") && key.includes(receiptItemId)) {
            const userId = key
              .replace("splitAmount-", "")
              .replace(`-${receiptItemId}`, "");
            const amount = parseFloat(req.body[key]);

            if (!isNaN(amount) && amount > 0) {
              if (!userTotals[userId]) {
                userTotals[userId] = 0;
              }
              userTotals[userId] += amount;

              const groupTransactionToUsersToGroupsId =
                await splitReceiptByAmount([{ userId, amount }], receiptId);

              if (!groupTransactionToUsersToGroupsId) {
                console.error("Error splitting receipt for amount split.");
                return res.status(500).send("Error splitting receipt");
              }

              await createSplitReceiptLineItem(
                receiptItemId,
                groupTransactionToUsersToGroupsId[0].id,
                amount
              );
            }
          }
        }
      }

      if (itemSplitType.startsWith("percentage")) {
        for (let key in req.body) {
          if (
            key.startsWith("splitPercentage-") &&
            key.includes(receiptItemId)
          ) {
            const userId = key
              .replace("splitPercentage-", "")
              .replace(`-${receiptItemId}`, "");
            const percentage = parseFloat(req.body[key]);

            if (!isNaN(percentage) && percentage > 0) {
              const amount =
                (percentage / 100) * parseFloat(receipt[0].total.toFixed(2));

              if (!userTotals[userId]) {
                userTotals[userId] = 0;
              }
              userTotals[userId] += amount;

              const groupTransactionToUsersToGroupsId =
                await splitReceiptByAmount([{ userId, amount }], receiptId);

              if (!groupTransactionToUsersToGroupsId) {
                console.error("Error splitting receipt for percentage split.");
                return res.status(500).send("Error splitting receipt");
              }

              await createSplitReceiptLineItem(
                receiptItemId,
                groupTransactionToUsersToGroupsId[0].id,
                amount
              );
            }
          }
        }
      }
    }
  }

  res.sendStatus(200);
});

router.post("/amount", async (req, res) => {
  const memberId = req.body.memberId;
  const totalAmount = parseFloat(req.body.totalOwed);
  const splitAmount = parseFloat(req.body.splitAmount);

  if (totalAmount === 0) {
    return res.status(400).send("Amount cannot be zero");
  } else {
    const updatedAmount = totalAmount - splitAmount;
    if (updatedAmount < 0) {
      return res.status(400).send(`Amount cannot be more than ${totalAmount}`);
    }
    res.send(updatedAmount.toFixed(2));
  }
});

export const billSplitRouter = router;
