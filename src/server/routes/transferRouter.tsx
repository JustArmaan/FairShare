import express from "express";
import { renderToHtml } from "jsxte";
import {
  getGroupTransactionStateId,
  getGroupTransactionWithSplitType,
  getGroupWithMembers,
  getSplitOptions,
  getTransactionsForGroup,
  getUsersToGroup,
  updateGroupTransactionToUserToGroup,
  updateSplitType,
} from "../services/group.service";
import { SplitOptionsPage } from "../views/pages/Transfers/SplitOptionsPage";
import {
  getAllOwedForGroupTransactionWithMemberInfo,
  getAllOwedForGroupTransactionWithTransactionId,
} from "../services/owed.service";
import { FullSelector } from "../views/pages/Transfers/components/FullSelector";
import { getSplitTypeById } from "../services/transfer.service";
import {
  findUser,
  type ExtractFunctionReturnType,
} from "../services/user.service";
import { ViewGroups } from "../views/pages/Groups/components/ViewGroup";
import { getAccountsForUser } from "../services/plaid.service";
import { createTransferForSender } from "../integrations/vopay/transfer";

const router = express.Router();

function uppercaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

router.get(
  "/splitTransaction/splitOptions/open/:transactionId/:groupId/:selectedType",
  async (req, res) => {
    const splitTypes = await getSplitOptions();
    const transaction = await getGroupTransactionWithSplitType(
      req.params.groupId,
      req.params.transactionId
    );

    if (!transaction) {
      return res.status(404).send("No such transaction");
    }

    if (!splitTypes) {
      return res.status(404).send("No split options found");
    }

    const selectedType = splitTypes.find(
      (splitType) => splitType.type === req.params.selectedType
    );

    if (!selectedType) {
      return res.status(404).send("No such split type");
    }

    const html = renderToHtml(
      <div
        hx-get={`/transfer/splitTransaction/splitOptions/closed/${transaction.transaction.id}/${req.params.groupId}/${selectedType.type}`}
        hx-trigger="click"
        hx-target="#split-swapper"
        hx-swap="innerHTML"
        class="w-full"
      >
        <div class="flex py-2 hover:opacity-80 pointer-cursor px-4 justify-between text-left text-font-off-white bg-primary-black rounded-lg mt-2 w-full">
          <input
            id="select-split-options"
            type="button"
            name="select-split-options"
            value={uppercaseFirstLetter(selectedType.type)}
          />
          <img src="/activeIcons/expand_more.svg" alt="expandable" />
        </div>
        {splitTypes.map(
          (splitType) =>
            splitType.type !== selectedType.type && (
              <div
                hx-get={`/transfer/fullSelector/${req.params.groupId}/${transaction.transaction.id}/${splitType.id}`}
                hx-trigger="click"
                hx-target="#swap-full-selector"
                hx-swap="innerHTML"
                data-split-option={`${splitType.id}`}
                class="flex items-center p-2 mt-2 bg-card-black rounded-lg hover:bg-primary-faded-black w-full animation-fade-in"
              >
                {uppercaseFirstLetter(splitType.type)}
              </div>
            )
        )}
      </div>
    );

    res.send(html);
  }
);

router.get(
  "/splitTransaction/splitOptions/closed/:transactionId/:groupId/:splitTypeName",
  async (req, res) => {
    const splitTypes = await getSplitOptions();
    const transaction = await getGroupTransactionWithSplitType(
      req.params.groupId,
      req.params.transactionId
    );

    if (!transaction) {
      return res.status(404).send("No such transaction");
    }

    if (!splitTypes) {
      return res.status(404).send("No split options found");
    }

    const selectedSplitType = splitTypes.find(
      (splitType) => splitType.type === req.params.splitTypeName
    );

    if (!selectedSplitType) {
      return res.status(404).send("No such split type");
    }

    const html = renderToHtml(
      <div
        hx-get={`/transfer/splitTransaction/splitOptions/open/${transaction.transaction.id}/${req.params.groupId}/${selectedSplitType.type}`}
        hx-trigger="click"
        hx-target="#split-swapper"
        hx-swap="innerHTML"
        class="w-full"
      >
        <div class="flex py-2 hover:opacity-80 pointer-cursor px-4 justify-between text-left text-font-off-white bg-primary-black rounded-lg mt-2 w-full">
          <input
            id="select-split-options"
            type="button"
            name="select-split-options"
            value={uppercaseFirstLetter(
              selectedSplitType.type ? selectedSplitType.type : transaction.type
            )}
          />
          <img src="/activeIcons/expand_more.svg" alt="expandable" />
        </div>
      </div>
    );

    res.send(html);
  }
);

router.get("/splitTransaction/:groupId/:transactionId", async (req, res) => {
  const groupId = req.params.groupId;
  const transactionId = req.params.transactionId;
  const groupWithMember = await getGroupWithMembers(groupId);

  if (!groupWithMember) {
    return res.status(404).send("No such group");
  }

  const transactionDetails = await getGroupTransactionWithSplitType(
    groupId,
    transactionId
  );

  if (!transactionDetails) {
    return res.status(404).send("No such transaction");
  }

  const owedInfo = await getAllOwedForGroupTransactionWithMemberInfo(
    groupId,
    transactionId
  );

  if (!owedInfo) {
    return res.status(404).send("No owed info found");
  }

  const html = renderToHtml(
    <SplitOptionsPage
      groupId={groupId}
      transactionId={transactionId}
      transaction={transactionDetails}
      groupWithMembers={groupWithMember}
      owedInfo={owedInfo}
      splitType={transactionDetails.type}
    />
  );

  res.send(html);
});

router.get(
  "/fullSelector/:groupId/:transactionId/:selectedType",
  async (req, res) => {
    const groupId = req.params.groupId;
    const transactionId = req.params.transactionId;
    const groupWithMember = await getGroupWithMembers(groupId);
    const splitTypeId = req.params.selectedType;

    const splitType = await getSplitTypeById(splitTypeId);

    if (!splitType) {
      return res.status(404).send("No such split type");
    }

    if (!groupWithMember) {
      return res.status(404).send("No such group");
    }

    const transactionDetails = await getGroupTransactionWithSplitType(
      groupId,
      transactionId
    );

    if (!transactionDetails) {
      return res.status(404).send("No such transaction");
    }

    const owedInfo = await getAllOwedForGroupTransactionWithMemberInfo(
      groupId,
      transactionId
    );

    if (!owedInfo) {
      return res.status(404).send("No owed info found");
    }

    const html = renderToHtml(
      <FullSelector
        groupId={groupId}
        transactionId={transactionId}
        transaction={transactionDetails}
        groupWithMembers={groupWithMember}
        owedInfo={owedInfo}
        splitType={splitType[0].type}
      />
    );

    res.send(html);
  }
);

router.post("/splitOptions/edit", async (req, res) => {
  const { splitType, memberId, groupId, transactionId } = req.body;

  if (!splitType) {
    console.log("Error: Required parameters are missing");
    return res.status(400).send("Required parameters are missing");
  }

  let memberList: string[];
  if (splitType === "equal") {
    const groupAndMembers = await getGroupWithMembers(groupId);
    if (!groupAndMembers) {
      console.log("No such group found");
      return res.status(404).send("No such group");
    }
    memberList = groupAndMembers.members.map((member) => member.id);
  } else {
    console.log("Split type is not equal, processing memberId");

    memberList = Array.isArray(memberId) ? memberId : [memberId];
  }

  const transactionState = await getGroupTransactionStateId(
    groupId,
    transactionId
  );

  const transaction = await getGroupTransactionWithSplitType(
    groupId,
    transactionId
  );

  if (!transactionState || !transaction) {
    console.log("No such transaction found");
    return res.status(404).send("No such transaction");
  }

  const allSplitTypes = await getSplitOptions();
  if (!allSplitTypes) {
    console.log("No split options found");
    return res.status(404).send("No split options found");
  }

  const selectedSplitType = allSplitTypes.find(
    (split) => split.type === splitType
  );

  if (!selectedSplitType) {
    console.log("No such split type found");
    return res.status(404).send("No such split type");
  }

  const updatedSplitOptions = await updateSplitType(
    transactionState.id,
    selectedSplitType.id
  );

  if (!updatedSplitOptions) {
    console.log("Failed to update split options");
    return res.status(500).send("Failed to update split options");
  }

  if (splitType === "percentage") {
    const { percentInput } = req.body;
    const normalizedPercentInput = Array.isArray(percentInput)
      ? percentInput
      : [percentInput];
    if (
      !normalizedPercentInput ||
      !Array.isArray(normalizedPercentInput) ||
      normalizedPercentInput.length === 0
    ) {
      return res.status(400).send("Percentage input is missing or invalid");
    }
    if (memberList.length !== normalizedPercentInput.length) {
      return res
        .status(400)
        .send("Mismatch between member IDs and percentage inputs");
    }

    const totalAmounts = normalizedPercentInput.map((percent, index) => {
      const amount =
        transaction.transaction.amount * (parseFloat(percent) / 100);
      return {
        memberId: memberList[index],
        amount: parseFloat(amount.toFixed(2)) * -1,
      };
    });

    await Promise.all(
      totalAmounts.map(async ({ memberId, amount }) => {
        return updateGroupTransactionToUserToGroup(
          groupId,
          transactionId,
          memberId,
          amount
        );
      })
    );
  } else if (splitType === "equal") {
    const equalShare = parseFloat(
      (transaction.transaction.amount / memberList.length).toFixed(2)
    );
    await Promise.all(
      memberList.map(async (member: string) => {
        if (member !== transaction.user.id) {
          await updateGroupTransactionToUserToGroup(
            groupId,
            transactionId,
            member,
            equalShare * -1
          );
        }
      })
    );
  } else if (splitType === "amount") {
    const { amountInput } = req.body;
    const normalizedAmountInput = Array.isArray(amountInput)
      ? amountInput
      : [amountInput];
    if (
      !normalizedAmountInput ||
      !Array.isArray(normalizedAmountInput) ||
      normalizedAmountInput.length === 0
    ) {
      return res.status(400).send("Amount input is missing or invalid");
    }
    if (memberList.length !== normalizedAmountInput.length) {
      return res
        .status(400)
        .send("Mismatch between member IDs and amount inputs");
    }

    const transactions = normalizedAmountInput.map((amount, index) => {
      return {
        memberId: memberList[index],
        amount: parseFloat(amount) * -1,
      };
    });

    await Promise.all(
      transactions.map(async ({ memberId, amount }) => {
        return updateGroupTransactionToUserToGroup(
          groupId,
          transactionId,
          memberId,
          amount
        );
      })
    );
  }

  const groupTransactions = await getTransactionsForGroup(groupId);
  if (!groupTransactions) {
    console.log("No transactions found for group");
    return res.status(404).send("No transactions found");
  }

  const groupMembers = await getGroupWithMembers(groupId);
  if (!groupMembers) {
    console.log("No members found in group");
    return res.status(404).send("No members found");
  }

  const owedPerMember = await Promise.all(
    groupTransactions
      .map(async (transaction) => {
        return (await getAllOwedForGroupTransactionWithTransactionId(
          groupId,
          transaction.id
        )) as ExtractFunctionReturnType<
          typeof getAllOwedForGroupTransactionWithTransactionId
        >;
      })
      .filter((owed) => owed !== null)
  );

  const userId = req.user!.id;

  const userToGroup = (await getUsersToGroup(groupId, userId))!;

  const currentUser = await findUser(req.user?.id as string);
  const accountId = await getAccountsForUser(req.user?.id as string);
  if (!accountId) {
    console.log("No account found for user");
    return res.status(404).send("No account found");
  }
  if (!currentUser) {
    console.log("No such user found");
    return res.status(404).send("No such user");
  }

  const html = renderToHtml(
    <ViewGroups
      groupId={groupId}
      transactions={groupTransactions}
      members={groupMembers.members}
      currentUser={currentUser}
      groupBudget={[]}
      owedPerMember={
        owedPerMember && owedPerMember.length > 0
          ? owedPerMember
          : [
              groupMembers.members.map((member) => ({
                transactionId: "",
                userId: member.id,
                amount: 0,
                groupTransactionToUsersToGroupsId: "",
                pending: null,
              })),
            ]
      }
      accountId={accountId[0].id}
      selectedDepositAccountId={userToGroup.depositAccountId}
    />
  );

  res.send(html);
});

// router.post("/initiate/transfer/sender", async (req, res) => {
//   const { transactionId, groupId, receiverIds } = req.body as {
//     [key: string]: string;
//   };
//   const receiverIdList = receiverIds.split(",");
//   const userId = req.user!.id;

//   const owedInfo = await getAllOwedForGroupTransactionWithMemberInfo(
//     groupId,
//     transactionId
//   );

//   const currentUser = owedInfo?.find((owed) => owed.user.id === userId);

//   if (!currentUser) {
//     return res.status(403).send("You need to be signed in to use this feature");
//   }

//   const parsedAmount = Math.floor(Math.abs(currentUser!.amount) * 100) / 100;

//   await createTransferForSender(
//     userId,
//     receiverIdList[0],
//     parsedAmount,
//     groupId,
//     owedInfo!.find((owed) => owed.user.id === userId)!.owedId
//   );

//   const receiver = await findUser(receiverIdList[0]);

//   await createNotificationWithWebsocket(
//     groupId,
//     `A request of $${parsedAmount.toFixed(2)} to ${
//       receiver!.firstName
//     } for an Interac e transfer has been sent to your email.`,
//     userId,
//     "groupInvite"
//   );

//   await createNotificationWithWebsocket(
//     groupId,
//     `${req.user!.firstName} has initiated a transfer of $${parsedAmount.toFixed(
//       2
//     )}. We'll notify you when the transfer is complete.`,
//     receiverIdList[0],
//     "groupInvite"
//   );

//   res.send(
//     renderToHtml(
//       <div
//         hx-get={`/groups/view/${groupId}`}
//         hx-trigger="load"
//         hx-swap="innerHTML"
//         hx-target="#app"
//         hx-push-url={`/groups/view/${groupId}`}
//       ></div>
//     )
//   );
// });

export const transferRouter = router;
