import express from "express";
import { GroupPage } from "../../views/pages/Groups/GroupPage.tsx";
import { renderToHtml } from "jsxte";
import {
  deleteMemberByGroup,
  getGroupTransactions,
  getGroupWithMembersAndTransactions,
  getGroupsAndAllMembersForUser,
  type GroupMembersTransactions,
  getUsersToGroup,
  updateUsersToGroup,
  setGroupTransactionStatePending,
  getGroupIdFromOwed,
  getUserTotalOwedForGroup,
  changeMemberTypeInGroup,
  getGroupOwner,
  getUserTotalOwedForGroupWithOwingFlags,
  getUserToGroupFromUserToGroupId,
} from "../../services/group.service.ts";
import { findUser, getUserByEmailOnly } from "../../services/user.service.ts";
import {
  createGroup,
  addMember,
  getGroupWithMembers,
  updateGroup,
} from "../../services/group.service.ts";
import CreateGroup from "../../views/pages/Groups/components/CreateGroup.tsx";
import {
  EditGroupPage,
  colors,
} from "../../views/pages/Groups/components/EditGroup.tsx";
import { AddTransaction } from "../../views/pages/Groups/components/AddTransaction.tsx";
import {
  getAccountWithTransactions,
  getAccountsForUser,
  getCashAccountWithTransaction,
  getItem,
  type AccountSchema,
} from "../../services/plaid.service.ts";
import type { ExtractFunctionReturnType } from "../../services/user.service.ts";
import { GroupTransactionsListPage } from "../../views/pages/Groups/TransactionsListGroupsPage.tsx";
import {
  getAllOwedForGroupTransactionWithMemberInfo,
  getGroupIdAndTransactionIdForOwed,
  getResultsPerGroupTransaction,
} from "../../services/owed.service.ts";
import { TransactionList } from "../../views/pages/transactions/components/TransactionList.tsx";
import { AccountPickerForm } from "../../views/pages/transactions/components/AccountPickerForm.tsx";
import Transaction from "../../views/pages/transactions/components/Transaction.tsx";
import {
  getCashAccountForUser,
  getTransaction,
  type CashAccount,
} from "../../services/transaction.service.ts";
import { ViewAndPayPage } from "../../views/pages/Groups/ViewAndPayPage.tsx";
import { InstitutionDropDown } from "../../views/pages/Groups/components/InstitutionDropDown.tsx";
import {
  getAccountWithItem,
  getAccountsWithItemsForUser,
} from "../../services/account.service.ts";
import { AccountSelector } from "../../views/pages/Groups/components/AccountSelector.tsx";
import { deleteGroupInviteNotificationByNotificationId } from "../../services/notification.service.ts";
import {
  createGroupInviteWithWebsocket,
  createGroupNotificationWithWebsocket,
} from "../../utils/createNotification.ts";
import SelectIcon from "../../views/pages/Groups/components/SelectIcon.tsx";
import { AddMembersPage } from "../../views/pages/Groups/AddMemberPage.tsx";
import { getInviteLinkById } from "../../services/invite.service.ts";
import { env } from "../../../../env.ts";
import { getOrCreateInviteLink } from "../../utils/getOrCreateInviteLink.ts";
import { checkUserExistsInGroup } from "../../utils/userExistsInGroup.ts";
import GroupMembers from "../../views/pages/Groups/components/GroupMembers.tsx";
import { groupViewSubRouter } from "./groupView.tsx";
import { getOrCreateCashAccountForUser } from "../../utils/getOrCreateCashAccount.ts";
import Members from "../../views/pages/Groups/components/Members.tsx";

const router = express.Router();

const createIcons = [
  {
    name: "House",
    icon: "/createGroupIcons/house.svg",
  },
  {
    name: "People",
    icon: "/createGroupIcons/people.svg",
  },
  {
    name: "Night",
    icon: "/createGroupIcons/nightlife.svg",
  },
  {
    name: "Food",
    icon: "/createGroupIcons/food.svg",
  },
  {
    name: "Entertainment",
    icon: "/createGroupIcons/confirmation.svg",
  },
  {
    name: "Travel",
    icon: "/createGroupIcons/airplane.svg",
  },
  {
    name: "Water",
    icon: "/createGroupIcons/water.svg",
  },
  {
    name: "Shopping",
    icon: "/createGroupIcons/cart.svg",
  },
  {
    name: "Gas",
    icon: "/createGroupIcons/gas.svg",
  },
  {
    name: "Star",
    icon: "/createGroupIcons/star.svg",
  },
  {
    name: "Flower",
    icon: "/createGroupIcons/flower.svg",
  },
  {
    name: "Bunny",
    icon: "/createGroupIcons/bunny.svg",
  },
];

router.get("/page", async (req, res) => {
  try {
    const groups = await getGroupsAndAllMembersForUser(req.user!.id);
    const groupsNoInvited = groups.map((group) => {
      group.members = group.members.filter(
        (member) => member.type !== "Invited"
      );
      return group;
    });

    const groupsWithOwed = await Promise.all(
      groupsNoInvited.map(async (group) => {
        let owed = await getUserTotalOwedForGroupWithOwingFlags(
          req.user!.id,
          group.id
        );
        if (owed === null) {
          owed = { owedAmount: 0, flags: { owed: false, owing: false } };
        }
        return { ...group, ...owed };
      })
    );
    const html = renderToHtml(
      <GroupPage groups={groupsWithOwed ? groupsWithOwed : []} />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get("/confirm-transaction", async (req, res) => {
  const { owedId } = req.query as {
    [key: string]: string;
  };
  await setGroupTransactionStatePending(owedId, null);
  const groupId = await getGroupIdFromOwed(owedId);

  if (!groupId) {
    return res.status(404).send("Group ID not found");
  }

  const html = renderToHtml(
    <div
      hx-get={`/groups/view/${groupId}`}
      hx-swap="innerHTML"
      hx-trigger="load"
      hx-target="#app"
      hx-push-url={`/groups/view/${groupId}`}
    />
  );
  res.send(html);
});

router.get(
  "/pay/:groupTransactionToUsersToGroupsId/:groupId",
  async (req, res) => {
    const result = await getGroupIdAndTransactionIdForOwed(
      req.params.groupTransactionToUsersToGroupsId
    );

    if (!result) {
      return res.status(404).send("Group ID and Transaction ID not found");
    }

    const { groupId, transactionId } = result;
    const owed = await getAllOwedForGroupTransactionWithMemberInfo(
      groupId,
      transactionId
    );
    const transaction = await getTransaction(transactionId);
    const accounts = await getAccountsWithItemsForUser(req.user!.id);
    // const selectedAccount = wait for schema
    const html = renderToHtml(
      <ViewAndPayPage
        owed={owed!}
        transaction={transaction}
        accounts={accounts!}
        groupId={req.params.groupId}
      />
    );

    return res.send(html);
  }
);

// should be a post
router.get("/account-selector/select", async (req, res) => {
  const { id } = req.user!;
  const {
    accountId,
    isDepositAccount: isDepositAccountParamater,
    groupId,
  } = req.query as { [key: string]: string };
  const accounts = await getAccountsWithItemsForUser(id);
  const selectedAccount =
    accountId && accountId !== "" ? await getAccountWithItem(accountId) : null;

  const isDepositAccount = isDepositAccountParamater === "true";
  const usersToGroup = groupId && (await getUsersToGroup(groupId, id));
  if (usersToGroup && isDepositAccount && accountId !== "null") {
    await updateUsersToGroup(usersToGroup.id, { depositAccountId: accountId });
  }

  const html = renderToHtml(
    <AccountSelector
      selectedAccount={selectedAccount!}
      accounts={accounts!}
      isDepositAccount={isDepositAccount ? true : undefined}
      groupId={groupId}
    />
  );
  res.send(html);
});

// should be a post
router.get("/account-selector/institution-drop-down/", async (req, res) => {
  const { id } = req.user!;
  const { open: openParam, selected: selectedItemId } = req.query as {
    [key: string]: string;
  };
  const open = openParam === "true";
  const accounts = await getAccountsWithItemsForUser(id);
  const items = accounts!.map((account) => account.item);

  const html = renderToHtml(
    <InstitutionDropDown
      open={open}
      items={items}
      selectedItem={items.find((item) => selectedItemId === item.id)!}
    />
  );

  res.send(html);
});

router.get("/create", async (req, res) => {
  try {
    const { id } = req.user!;

    let databaseUser = await findUser(id);
    if (!databaseUser) throw new Error("failed to create user");

    const html = renderToHtml(
      <CreateGroup
        currentUser={{ ...databaseUser, type: "Owner" }}
        icons={createIcons}
        colors={colors}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.post("/addMember/:groupId", async (req, res) => {
  try {
    const email = req.body.emailOrPhone as string;
    const currentUser = await findUser(req.user!.id);

    if (!currentUser) {
      return res.status(500).send("Failed to get user");
    }

    const member = await getUserByEmailOnly(email);

    if (!member) {
      return res.status(400).send("User not found.");
    }

    const inGroup = await checkUserExistsInGroup(
      req.params.groupId as string,
      member.id
    );

    if (inGroup) {
      return res.status(400).send("User is already in the group.");
    }

    const currentGroup = await getGroupWithMembers(req.params.groupId);

    if (!currentGroup) {
      return res.status(404).send("No such group");
    }

    await addMember(req.params.groupId, member.id, "Invited");

    await createGroupInviteWithWebsocket(
      req.params.groupId,
      member.id,
      "groupInvite",
      req.user!.id
    );

    const group = await getGroupWithMembers(req.params.groupId);

    if (!group) return res.status(404).send("No such group");

    const content = (
      <GroupMembers
        memberDetails={group.members}
        currentUser={currentUser}
        groupId={group.id}
      />
    );

    const html = renderToHtml(content);
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred when adding a member");
  }
});

router.post("/create", async (req, res) => {
  const { id } = req.user!;

  const currentUser = await findUser(id);

  if (!currentUser) {
    return res.status(500).send("Failed to get user");
  }

  const { groupName, selectedIcon, temporaryGroup, selectedColor } = req.body;

  if (selectedColor.includes("primary-dark-grey")) {
    return res.status(400).send("Please select a color.");
  }

  if (
    !groupName ||
    groupName === "" ||
    !selectedIcon ||
    selectedIcon === "" ||
    !selectedColor ||
    selectedColor === ""
  ) {
    return res.status(400).send("Please fill out all fields.");
  }

  let isTemp = temporaryGroup === "on";

  if (!temporaryGroup || temporaryGroup === "") {
    isTemp = false;
  }

  if (!selectedIcon) {
    return res.status(400).send("Category not found.");
  }

  const group = await createGroup(
    groupName,
    selectedColor,
    selectedIcon,
    isTemp.toString()
  );

  if (!group) {
    return res.status(500).send("Failed to create group.");
  }

  await addMember(group.id, currentUser.id, "Owner");

  const allGroupsForCurrentUser = await getGroupsAndAllMembersForUser(
    currentUser.id
  );

  if (!allGroupsForCurrentUser) {
    return res.status(500).send("Failed to get groups for user.");
  }

  const groupsWithOwed = await Promise.all(
    allGroupsForCurrentUser.map(async (group) => {
      let owed = await getUserTotalOwedForGroupWithOwingFlags(
        req.user!.id,
        group.id
      );
      if (owed === null) {
        owed = { owedAmount: 0, flags: { owed: false, owing: false } };
      }
      return { ...group, ...owed };
    })
  );

  const html = renderToHtml(<GroupPage groups={groupsWithOwed} />);
  return res.status(200).send(html);
});

router.get("/edit", async (req, res) => {
  try {
    const groups = await getGroupsAndAllMembersForUser(req.user!.id);
    const groupsWithOwed = await Promise.all(
      groups.map(async (group) => {
        let owed = await getUserTotalOwedForGroupWithOwingFlags(
          req.user!.id,
          group.id
        );
        if (owed === null) {
          owed = { owedAmount: 0, flags: { owed: false, owing: false } };
        }
        return { ...group, ...owed };
      })
    );
    const html = renderToHtml(<GroupPage groups={groupsWithOwed} edit />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

export type UserGroupSchema = NonNullable<
  Awaited<ReturnType<typeof getGroupWithMembers>>
>;

router.get("/edit/:groupId", async (req, res) => {
  try {
    const currentUser = await findUser(req.user!.id);

    if (!currentUser) {
      return res.status(500).send("Failed to get user");
    }

    const group = await getGroupWithMembers(req.params.groupId);
    if (!group) return res.status(404).send("No such group");

    const userToGroup = await getUsersToGroup(group.id, currentUser.id);

    if (!userToGroup) {
      return res.status(404).send("User not found in group");
    }

    const inviteToken = await getOrCreateInviteLink(userToGroup.id);
    const shareLink = `${env.baseUrl}/groups/invite/${inviteToken.id}`;

    const html = renderToHtml(
      <EditGroupPage
        currentUser={currentUser}
        group={group}
        inviteShareLink={shareLink}
        icons={createIcons}
      />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get("/addTransaction/:accountId/:groupId/:itemId", async (req, res) => {
  try {
    const item = await getItem(req.params.itemId);

    if (!item) {
      return res.status(404).send("Item not found");
    }

    const accounts = await getAccountsForUser(req.user!.id, item.id);
    if (!accounts) throw new Error("no accounts for user!");

    const groupTransactions = await getGroupTransactions(req.params.groupId);

    const accountsWithTransactions = (await Promise.all(
      accounts.map(
        async (account) => await getAccountWithTransactions(account.id)
      )
    )) as ExtractFunctionReturnType<typeof getAccountWithTransactions>[];
    let selectedAccountId = req.params.accountId;
    if (selectedAccountId === "default") {
      const defaultAccount = accountsWithTransactions.find(
        (account) => account.itemId === req.params.itemId
      );
      if (defaultAccount) {
        selectedAccountId = defaultAccount.id;
      }
    }

    const currentUser = req.user;
    const html = renderToHtml(
      <AddTransaction
        currentUser={currentUser!}
        groupId={req.params.groupId}
        accounts={accountsWithTransactions ? accountsWithTransactions : []}
        selectedAccountId={selectedAccountId}
        groupTransactionIds={
          groupTransactions?.map((transaction) => transaction.transactionId) ??
          []
        }
        itemId={req.params.itemId}
      />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get("/addTransaction/:accountId/:groupId", async (req, res) => {
  try {
    const { accountId, groupId } = req.params;

    // Get or create cash account for user
    const cashAccount = await getOrCreateCashAccountForUser(req.user!.id);
    if (!cashAccount) {
      return res.status(500).send("No cash account found");
    }

    const accountsWithTransactions = [
      await getCashAccountWithTransaction(cashAccount.account_id),
    ];

    let selectedAccountId = accountId;
    if (selectedAccountId === "default") {
      selectedAccountId = cashAccount.id;
    }

    const groupTransactions = await getGroupTransactions(groupId);
    const currentUser = req.user;

    const html = renderToHtml(
      <AddTransaction
        currentUser={currentUser!}
        groupId={groupId}
        // @ts-ignore
        accounts={accountsWithTransactions ? accountsWithTransactions : []}
        selectedAccountId={selectedAccountId}
        groupTransactionIds={
          groupTransactions?.map((transaction) => transaction.transactionId) ??
          []
        }
        itemId={null}
      />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing the request.");
  }
});

router.post("/edit/:groupId", async (req, res) => {
  try {
    const { groupName, selectedColor, temporaryGroup, selectedIcon } = req.body;

    if (selectedColor.includes("primary-dark-grey")) {
      return res.status(400).send("Please select a color.");
    }

    const isTemp = temporaryGroup === "on";
    const currentGroup = await getGroupWithMembers(req.params.groupId);

    const currentMember = currentGroup!.members.find(
      (member) => req.user!.id === member.id
    );
    if (!currentGroup) {
      return res.status(404).send("Group not found");
    }

    if (currentMember?.type !== "Owner") {
      res.status(403).send("Only the owner can edit a group.");
    }

    const currentUser = await findUser(req.user!.id);

    if (!currentUser) {
      return res.status(500).send("Failed to get user");
    }

    const updates: {
      name?: string;
      color?: string;
      icon?: string;
      temporary?: string;
    } = {};
    if (groupName !== currentGroup.name && groupName !== "")
      updates.name = groupName;
    if (selectedColor !== currentGroup.color && selectedColor !== "")
      updates.color = selectedColor;
    if (selectedIcon !== currentGroup.icon && selectedIcon !== "")
      updates.icon = selectedIcon;
    if (
      isTemp.toString() !== currentGroup.temporary &&
      isTemp.toString() !== ""
    )
      updates.temporary = isTemp.toString();

    if (Object.keys(updates).length > 0) {
      const updatedGroup = await updateGroup(
        req.params.groupId,
        updates.name,
        updates.color,
        updates.icon,
        updates.temporary
      );

      if (!updatedGroup) {
        return res.status(500).send("Failed to update group");
      }
    }

    const allGroupsForCurrentUser = await getGroupsAndAllMembersForUser(
      currentUser.id
    );

    if (!allGroupsForCurrentUser) {
      return res.status(500).send("Failed to get groups for user.");
    }

    const groupsWithOwed = await Promise.all(
      allGroupsForCurrentUser.map(async (group) => {
        let owed = await getUserTotalOwedForGroupWithOwingFlags(
          req.user!.id,
          group.id
        );
        if (owed === null) {
          owed = { owedAmount: 0, flags: { owed: false, owing: false } };
        }
        return { ...group, ...owed };
      })
    );

    const html = renderToHtml(<GroupPage groups={groupsWithOwed} />);
    return res.status(200).send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the group");
  }
});

router.post("/deleteMember/:userID/:groupID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const groupID = req.params.groupID;

    const totalOwed = await getUserTotalOwedForGroup(userID, groupID);

    if (totalOwed === null || totalOwed === undefined) {
      return res.status(500).send("An error occured when removing a member");
    }

    if (totalOwed < 0) {
      return res
        .status(400)
        .send("You cannot remove a member that still owes money");
    }

    await deleteMemberByGroup(userID, groupID);

    const html = renderToHtml(
      <div
        hx-get={`/groups/groupMembers/${groupID}`}
        hx-trigger="load"
        hx-swap="innerHTML"
        hx-target="#groupMembers"
      ></div>
    );

    res.send(html);
  } catch (error) {
    res.status(500).send("An error occurred when removing a member");
  }
});

router.get("/transactions/:groupId", async (req, res) => {
  const groupId = req.params.groupId;
  const groupWithTransactions =
    await getGroupWithMembersAndTransactions(groupId);
  const html = renderToHtml(
    <GroupTransactionsListPage
      group={groupWithTransactions as GroupMembersTransactions}
    />
  );
  res.send(html);
});

router.get("/transactionList/:accountId/:groupId", async (req, res) => {
  let account = await getAccountWithTransactions(req.params.accountId);

  if (!account) {
    const cashAccount = await getOrCreateCashAccountForUser(req.user!.id);
    if (!cashAccount) {
      return res.status(500).send("Failed to create or retrieve cash account");
    }
    // @ts-ignore
    account = await getCashAccountWithTransaction(cashAccount.account_id);
    if (!account) {
      return res.status(500).send("Failed to retrieve cash account details");
    }
  }

  const groupTransactions = await getGroupTransactions(req.params.groupId);
  const groupTransactionIds = groupTransactions
    ? groupTransactions.map(
        (transaction) => transaction.transactionId as string
      )
    : [];

  const html = renderToHtml(
    <TransactionList
      account={account}
      route="AddTransaction"
      groupId={req.params.groupId}
      groupTransactionIds={groupTransactionIds}
    />
  );
  res.send(html);
});

router.get("/accountPicker/:itemId/:accountId/:groupId", async (req, res) => {
  const accounts = await getAccountsForUser(req.user!.id, req.params.itemId);
  if (!accounts) throw new Error("Missing accounts for user");

  const cashAccount = await getCashAccountForUser(req.user!.id);

  const props: {
    accounts: AccountSchema[];
    selectedAccountId: string;
    groupId: string;
    itemId: string;
    cashAccount?: CashAccount | null;
  } = {
    accounts,
    selectedAccountId: req.params.accountId,
    groupId: req.params.groupId,
    itemId: req.params.itemId,
  };

  if (cashAccount) {
    props.cashAccount = cashAccount;
  } else {
    props.cashAccount = null;
  }

  const html = renderToHtml(<AccountPickerForm {...props} />);
  res.send(html);
});

router.get("/getTransactions/:groupId", async (req, res) => {
  const groupTransactions = await getGroupWithMembersAndTransactions(
    req.params.groupId
  );
  const url = req.query.url as string;
  const html = renderToHtml(
    <>
      {groupTransactions &&
        groupTransactions.transactions.map((transaction) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={transaction.category.color}
            groupId={req.params.groupId}
            route="ViewBillSplit"
            url={url}
          />
        ))}
    </>
  );
  res.send(html);
});

router.post(
  "/member/:approval/:userToGroupId/:notificationId",
  async (req, res) => {
    const { userToGroupId, notificationId } = req.body;
    const userId = req.user!.id;
    const isApproved = req.params.approval === "accept";

    const userToGroup = await getUserToGroupFromUserToGroupId(userToGroupId);

    if (!userToGroup) {
      return res.status(404).send("User not found in group");
    }

    let groupId = userToGroup.groupId;

    const user = await findUser(userId);

    const owner = await getGroupOwner(groupId);

    if (!owner) {
      return res.status(500).send("An error occured when accepting the invite");
    }

    if (isApproved) {
      await changeMemberTypeInGroup(userId, groupId, "Member");
      await deleteGroupInviteNotificationByNotificationId(notificationId);
      await createGroupNotificationWithWebsocket(
        groupId,
        "groupInvite",
        owner.userId,
        user!.id,
        `${user!.firstName} has accepted the invite to join the group`
      );

      const html = renderToHtml(
        <div
          hx-get={`/groups/view/${groupId}`}
          hx-trigger="load"
          hx-target="#app"
          hx-swap="innerHTML"
          hx-push-url={`/groups/view/${groupId}`}
        />
      );
      return res.send(html);
    } else {
      await deleteMemberByGroup(userId, groupId);
      await deleteGroupInviteNotificationByNotificationId(notificationId);
      await createGroupNotificationWithWebsocket(
        groupId,
        "groupInvite",
        owner.userId,
        user!.id,
        `${user?.firstName} has declined the invite to join the group`
      );

      const html = renderToHtml(
        <div
          hx-get="/notification/page"
          hx-target="#app"
          hx-trigger="load"
          hx-swap="innerHTML"
        />
      );
      return res.send(html);
    }
  }
);

router.get("/selectIcon", async (req, res) => {
  const selectedIcon = req.query.selectedIcon as string;
  const selectedColor = req.query.selectedColor as string;
  const html = renderToHtml(
    <SelectIcon
      icons={createIcons}
      colors={colors}
      selectedIcon={selectedIcon}
      selectedColor={selectedColor}
    />
  );
  res.send(html);
});

router.get("/selectIconEmpty", async (req, res) => {
  const html = renderToHtml(
    <div
      id="select-group-icon-container"
      hx-get="/groups/selectIcon"
      hx-trigger="click"
      hx-swap="outerHTML"
      hx-target="#select-group-icon-container"
      class="py-2 px-3  w-full h-fit flex justify-between bg-primary-black rounded-md mt-1 animate-fade-in min-height-[50px]"
    >
      <p class="text-primary-grey font-normal">Select Group Icon</p>
      <img
        src="/activeIcons/expand_more.svg"
        class="cursor-pointer w-[24px] aspect-square"
      />
    </div>
  );
  res.send(html);
});

router.get("/addMembers/:groupId", async (req, res) => {
  const groupId = req.params.groupId;
  const group = await getGroupWithMembers(groupId);
  const userId = req.user!.id;
  const currentUser = await findUser(userId);
  if (!currentUser) throw new Error("No such user");
  if (!group) {
    return res.status(404).send("Group not found");
  }

  const userToGroup = await getUsersToGroup(groupId, userId);

  if (!userToGroup) {
    return res.status(404).send("User not found in group");
  }

  const inviteToken = await getOrCreateInviteLink(userToGroup.id);
  const shareLink = `${env.baseUrl}/groups/invite/${inviteToken.id}`;

  const html = renderToHtml(
    <AddMembersPage
      group={group}
      currentUser={currentUser}
      inviteShareLink={shareLink}
    />
  );
  res.send(html);
});

router.get("/invite/:inviteTokenId", async (req, res) => {
  const inviteTokenId = req.params.inviteTokenId;
  const currentUserId = req.user!.id;

  const inviteToken = await getInviteLinkById(inviteTokenId);
  const currentUser = await findUser(currentUserId);

  if (!inviteToken) {
    return res.status(404).send("Invite link not found");
  }

  if (!currentUser) {
    return res.status(404).send("you need to make an account to join a group");
  }

  const userToGroup = await getUserToGroupFromUserToGroupId(
    inviteToken.usersToGroupsId
  );

  if (!userToGroup) {
    return res
      .status(404)
      .send(
        "There seems to be something wrong with the invite you received. Please contact the group owner."
      );
  }

  const userAlreadyInGroup = await checkUserExistsInGroup(
    userToGroup.groupId,
    currentUserId
  );

  if (userAlreadyInGroup) {
    return res.status(400).send("You are already in the group");
  }

  const newMember = await addMember(
    userToGroup.groupId,
    currentUserId,
    "Member"
  );

  if (!newMember) {
    return res.status(500).send("Failed to add member to group");
  }

  const html = renderToHtml(
    <div
      hx-get={`/groups/view/${userToGroup.groupId}`}
      hx-target="#app"
      hx-swap="innerHTML"
      hx-trigger="load"
    ></div>
  );

  res.send(html);
});

router.get("/groupMembers/:groupId", async (req, res) => {
  const groupWithMembers = await getGroupWithMembers(req.params.groupId);
  const currentUser = req.user;

  if (!groupWithMembers) {
    return res.status(404).send("Group not found");
  }

  if (!currentUser) {
    return res.status(404).send("User not found");
  }

  const html = renderToHtml(
    <GroupMembers
      memberDetails={groupWithMembers.members}
      currentUser={currentUser}
      groupId={groupWithMembers.id}
    />
  );

  res.send(html);
});

router.get("/updateIcon", async (req, res) => {
  const { icon, color, temporary } = req.query;

  let selectedIcon = icon;
  let selectedColor = color;

  if (!icon || icon === "null") {
    selectedIcon = createIcons[0].icon;
  }

  if (!color || color === "null") {
    selectedColor = "primary-dark-grey";
  }

  const borderClass =
    temporary === "true"
      ? `border-[3px] border-dashed border-${selectedColor}`
      : `bg-${selectedColor}`;

  const textColor =
    temporary === "true" ? `text-${selectedColor}` : "text-card-black";

  const html = renderToHtml(`
    <div class="${borderClass} rounded-sm h-[3.875rem] aspect-square flex items-center justify-center">
      <div class="${textColor}">
        <img custom-color class="w-[1.87rem] h-[1.87rem]" src="${selectedIcon}" alt="Selected Icon"/>
      </div>
    </div>
  `);

  res.send(html);
});

router.get("/members/:groupId", async (req, res) => {
  const results = await getResultsPerGroupTransaction(req.params.groupId);
  const { members } = (await getGroupWithMembers(req.params.groupId))!;

  const html = renderToHtml(
    <Members
      memberDetails={members}
      currentUser={req.user!}
      resultPerGroupTransaction={results}
    />
  );

  return res.send(html);
});

router.use("/view", groupViewSubRouter);

export const groupRouter = router;
