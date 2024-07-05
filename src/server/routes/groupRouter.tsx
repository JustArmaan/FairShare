import express from "express";
import { GroupPage } from "../views/pages/Groups/GroupPage";
import { renderToHtml } from "jsxte";
import {
  checkUserInGroup,
  deleteMemberByGroup,
  getGroupTransactions,
  getGroupWithMembersAndTransactions,
  getGroupsAndAllMembersForUser,
  getTransactionsForGroup,
  type GroupMembersTransactions,
  getUsersToGroup,
  updateUsersToGroup,
  setGroupTransactionStatePending,
  getGroupIdFromOwed,
  getUserTotalOwedForGroup,
  changeMemberTypeInGroup,
  getGroupOwner,
} from "../services/group.service";
import { findUser, getUserByEmailOnly } from "../services/user.service.ts";
import { AddedMember } from "../views/pages/Groups/components/Member.tsx";
import {
  createGroup,
  addMember,
  getGroupWithMembers,
  updateGroup,
} from "../services/group.service.ts";
import CreateGroup from "../views/pages/Groups/components/CreateGroup.tsx";
import {
  EditGroupPage,
  colors,
} from "../views/pages/Groups/components/EditGroup.tsx";
import { ViewGroups } from "../views/pages/Groups/components/ViewGroup.tsx";
import { AddTransaction } from "../views/pages/Groups/components/AddTransaction.tsx";
import {
  getAccountWithTransactions,
  getAccountsForUser,
  getItem,
  getItemsForUser,
} from "../services/plaid.service";
import type { ExtractFunctionReturnType } from "../services/user.service";
import { GroupTransactionsListPage } from "../views/pages/Groups/TransactionsListGroupsPage.tsx";
import {
  getAllOwedForGroupTransactionWithMemberInfo,
  getAllOwedForGroupTransactionWithTransactionId,
  getGroupIdAndTransactionIdForOwed,
} from "../services/owed.service.ts";
import { TransactionList } from "../views/pages/transactions/components/TransactionList.tsx";
import { AccountPickerForm } from "../views/pages/transactions/components/AccountPickerForm.tsx";
import Transaction from "../views/pages/transactions/components/Transaction.tsx";
import { getTransaction } from "../services/transaction.service.ts";
import { ViewAndPayPage } from "../views/pages/Groups/ViewAndPayPage.tsx";
import { InstitutionDropDown } from "../views/pages/Groups/components/InstitutionDropDown.tsx";
import {
  getAccountWithItem,
  getAccountsWithItemsForUser,
} from "../services/account.service.ts";
import { AccountSelector } from "../views/pages/Groups/components/AccountSelector.tsx";
import { deleteNotificationForUserInGroup } from "../services/notification.service.ts";
import { createNotificationWithWebsocket } from "../utils/createNotification.ts";
import SelectIcon from "../views/pages/Groups/components/SelectIcon.tsx";
import { AddMembersPage } from "../views/pages/Groups/AddMemberPage.tsx";

const router = express.Router();

const icons = [
  {
    id: "2707335e-ad80-458a-a1e6-fb25300e5621",
    name: "Heart",
    icon: "/groupIcons/heart.svg",
  },
  {
    id: "2707335e-ad80-458a-a1e6-fb25300e5622",
    name: "Star",
    icon: "/groupIcons/star.svg",
  },
  {
    id: "2707335e-ad80-458a-a1e6-fb25300e5623",
    name: "Drink",
    icon: "/groupIcons/drink.svg",
  },
  {
    id: "2707335e-ad80-458a-a1e6-fb25300e5624",
    name: "Diamond",
    icon: "/groupIcons/diamond.svg",
  },
  {
    id: "2707335e-ad80-458a-a1e6-fb25300e5625",
    name: "Food",
    icon: "/groupIcons/food.svg",
  },
  {
    id: "2707335e-ad80-458a-a1e6-fb25300e5626",
    name: "Crown",
    icon: "/groupIcons/crown.svg",
  },
  {
    id: "2707335e-ad80-458a-a1e6-fb25300e5627",
    name: "Gift",
    icon: "/groupIcons/gift.svg",
  },
];

const createIcons = [
  {
    name: "Books",
    icon: "/createGroupIcons/book.svg",
  },
  {
    name: "Dentist",
    icon: "/createGroupIcons/dentists.svg",
  },
  {
    name: "Education",
    icon: "/createGroupIcons/education.svg",
  },
  {
    name: "Entertainment",
    icon: "/createGroupIcons/entertainment.svg",
  },
  {
    name: "Food",
    icon: "/createGroupIcons/food.svg",
  },
  {
    name: "Healthcare",
    icon: "/createGroupIcons/healthcare.svg",
  },
  {
    name: "Home",
    icon: "/createGroupIcons/home.svg",
  },
  {
    name: "Shopping",
    icon: "/createGroupIcons/shopping.svg",
  },
  {
    name: "Hydro",
    icon: "/createGroupIcons/hydro.svg",
  },
  {
    name: "Utilities",
    icon: "/createGroupIcons/utilities.svg",
  },
  {
    name: "Medicine",
    icon: "/createGroupIcons/medicine.svg",
  },
  {
    name: "Wifi",
    icon: "/createGroupIcons/wifi.svg",
  },
];

router.get("/page", async (req, res) => {
  try {
    const groups = await getGroupsAndAllMembersForUser(req.user!.id);
    const html = renderToHtml(<GroupPage groups={groups ? groups : []} />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

const groupBudget = [
  {
    budgetGoal: 4000,
    spending: 1175,
  },
];

router.get("/view/:groupId", async (req, res) => {
  try {
    const userId = req.user!.id;
    const currentUser = await findUser(userId);

    if (!currentUser) throw new Error("No such user");

    const group = await getGroupWithMembers(req.params.groupId);

    if (!group) return res.status(404).send("No such group");

    const transactions = await getTransactionsForGroup(group.id);

    const owedPerMember = await Promise.all(
      transactions
        .map(async (transaction) => {
          return (await getAllOwedForGroupTransactionWithTransactionId(
            group.id,
            transaction.id
          )) as ExtractFunctionReturnType<
            typeof getAllOwedForGroupTransactionWithTransactionId
          >;
        })
        .filter((owed) => owed !== null)
    );

    const items = await getItemsForUser(req.user!.id);
    const defaultItem = items[0] && items[0].item;

    const account = await getAccountsForUser(userId, defaultItem.id);
    const accountId = account ? account[0].id : "";

    const html = renderToHtml(
      <ViewGroups
        groupId={group.id}
        transactions={transactions}
        members={group.members}
        currentUser={currentUser}
        groupBudget={groupBudget}
        owedPerMember={
          owedPerMember && owedPerMember.length > 0
            ? owedPerMember
            : [
                group.members.map((member) => ({
                  transactionId: "",
                  userId: member.id,
                  amount: 0,
                  groupTransactionToUsersToGroupsId: "",
                  pending: true,
                })),
              ]
        }
        accountId={accountId} // refactor me!
        selectedDepositAccountId={null}
        itemId={defaultItem.id}
        url={`/groups/view/${group.id}`}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
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
      <CreateGroup currentUser={{ ...databaseUser, type: "Owner" }} />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get("/addMember", async (req, res) => {
  try {
    const email = req.query.addEmail as string;
    const member = await getUserByEmailOnly(email);

    if (!member) {
      return res.status(400).send("User not found.");
    }

    let content;

    if (!member) {
      return res.status(400).send("User not found.");
    } else {
      content = <AddedMember user={{ ...member, type: "Invited" }} />;
    }
    const html = renderToHtml(content);
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get("/addMember/:groupId", async (req, res) => {
  try {
    const email = req.query.addEmail as string;
    const member = await getUserByEmailOnly(email);

    if (!member) {
      return res.status(400).send("User not found.");
    }

    const inGroup = await checkUserInGroup(
      member.id,
      req.params.groupId as string
    );

    let content;

    if (inGroup) {
      return res.status(400).send("User is already in the group.");
    }
    const group = await getGroupWithMembers(req.params.groupId);

    if (!group) return res.status(404).send("No such group");

    if (!member) {
      return res.status(400).send("User not found.");
    } else {
      content = (
        <AddedMember user={{ ...member, type: "Invited" }} groupId={group.id} />
      );
    }
    const html = renderToHtml(content);
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.post("/create", async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { id } = req.user!;

    const currentUser = await findUser(id);

    if (!currentUser) {
      return res.status(500).send("Failed to get user");
    }

    const { groupName, selectedIcon, temporaryGroup, selectedColor } = req.body;

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

    const html = renderToHtml(<GroupPage groups={allGroupsForCurrentUser} />);
    return res.status(200).send(html);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while creating the group.");
  }
});

router.get("/edit", async (req, res) => {
  try {
    const groups = await getGroupsAndAllMembersForUser(req.user!.id);
    const html = renderToHtml(<GroupPage groups={groups ? groups : []} edit />);
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

    const html = renderToHtml(
      <EditGroupPage icons={icons} currentUser={currentUser} group={group} />
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

router.post("/edit/:groupId", async (req, res) => {
  try {
    const {
      groupName,
      selectedCategoryId,
      selectedColor,
      memberEmails,
      temporaryGroup,
    } = req.body;

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
    if (selectedCategoryId !== currentGroup.icon && selectedCategoryId !== "")
      updates.icon = selectedCategoryId;
    if (
      isTemp.toString() !== currentGroup.temporary &&
      isTemp.toString() !== ""
    )
      updates.temporary = isTemp.toString();

    const groupMembers = memberEmails
      ? memberEmails.split(",").map((email: string) => email.trim())
      : [];
    const existingEmails = new Set(
      currentGroup.members.map((member) => member.email)
    );
    const newMembers = groupMembers.filter(
      (email: string) => !existingEmails.has(email)
    );

    if (Object.keys(updates).length === 0 && newMembers.length === 0) {
      return res.status(400).send("No changes detected");
    }

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

    for (const memberEmail of newMembers) {
      const user = await getUserByEmailOnly(memberEmail);
      if (user) {
        const invitedMember = await addMember(
          currentGroup.id,
          user.id,
          "Invited"
        );
        if (invitedMember) {
          await createNotificationWithWebsocket(
            currentGroup.id,
            `Invite from to join "${currentGroup.name}|Sent From ${user.firstName} ${currentUser.lastName}"`,
            user.id,
            "groupInvite",
            `/groups/${currentGroup.id}`
          );
        }
      } else {
        return res.status(400).send(`User with email ${memberEmail} not found`);
      }
    }

    const allGroupsForCurrentUser = await getGroupsAndAllMembersForUser(
      currentUser.id
    );

    if (!allGroupsForCurrentUser) {
      return res.status(500).send("Failed to get groups for user.");
    }

    const html = renderToHtml(<GroupPage groups={allGroupsForCurrentUser} />);
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

    if (!totalOwed) {
      return res.status(500).send("An error occured when removing a member");
    }
    if (totalOwed < 0) {
      return res
        .status(400)
        .send("You cannot remove a member that still owes money");
    }

    await deleteMemberByGroup(userID, groupID);
    res.status(204).send();
  } catch (error) {
    res.status(500).send("An error occurred when removing a member");
  }
});

router.get("/transactions/:groupId", async (req, res) => {
  const groupId = req.params.groupId;
  const groupWithTransactions = await getGroupWithMembersAndTransactions(
    groupId
  );
  const html = renderToHtml(
    <GroupTransactionsListPage
      group={groupWithTransactions as GroupMembersTransactions}
    />
  );
  res.send(html);
});

router.get(
  "/transactionList/:accountId/:groupId",

  async (req, res) => {
    const account = await getAccountWithTransactions(req.params.accountId);
    const groupTransactions = await getGroupTransactions(req.params.groupId);
    if (!account) throw new Error("404");
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
  }
);

router.get("/accountPicker/:itemId/:accountId/:groupId", async (req, res) => {
  const accounts = await getAccountsForUser(req.user!.id, req.params.itemId);
  if (!accounts) throw new Error("Missing accounts for user");
  const html = renderToHtml(
    <AccountPickerForm
      accounts={accounts}
      selectedAccountId={req.params.accountId}
      groupId={req.params.groupId as string}
      itemId={req.params.itemId}
    />
  );
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
            url={url}
          />
        ))}
    </>
  );
  res.send(html);
});

router.post("/member/:approval/:groupId/:notificationId", async (req, res) => {
  const { groupId, notificationId } = req.body;
  const userId = req.user!.id;
  const isApproved = req.params.approval === "accept";

  const user = await findUser(userId);

  const owner = await getGroupOwner(groupId);

  if (!owner) {
    return res.status(500).send("An error occured when accepting the invite");
  }

  if (isApproved) {
    await changeMemberTypeInGroup(userId, groupId, "Member");
    await deleteNotificationForUserInGroup(groupId, userId, notificationId);
    await createNotificationWithWebsocket(
      groupId,
      `${user?.firstName} has accepted the invite to join the group`,
      owner.userId,
      "groupInvite"
    );
  } else {
    await deleteMemberByGroup(userId, groupId);
    await deleteNotificationForUserInGroup(groupId, userId, notificationId);
    await createNotificationWithWebsocket(
      groupId,
      `${user?.firstName} has declined the invite to join the group`,
      owner.userId,
      "groupInvite"
    );
  }

  const html = renderToHtml(
    <div
      hx-get={`/groups/view/${groupId}`}
      hx-trigger="load"
      hx-target="#app"
      hx-swap="innerHTML"
      hx-push-url={`/groups/page/${groupId}`}
    />
  );
  res.send(html);
});

router.get("/selectIcon", async (req, res) => {
  const html = renderToHtml(
    <div
      id="select-group-icon"
      class="w-full h-fit bg-primary-black rounded-md mt-1 flex flex-col items-center"
    >
      <div
        id="select-group-icon"
        class="py-2 px-3  w-full h-fit flex justify-between"
      >
        <p class="text-primary-grey font-normal">Select Group Icon</p>
        <img
          hx-get="/groups/selectIconEmpty"
          hx-trigger="click"
          hx-swap="outerHTML"
          hx-target="#select-group-icon"
          src="/activeIcons/expand_more.svg"
          class="rotate-180"
        />
      </div>
      <hr class="border-t border-primary-dark-grey w-11/12 mx-auto px-2" />
      <SelectIcon icons={createIcons} colors={colors} />
    </div>
  );
  res.send(html);
});

router.get("/selectIconEmpty", async (req, res) => {
  const html = renderToHtml(
    <div
      id="select-group-icon"
      hx-get="/groups/selectIcon"
      hx-trigger="click"
      hx-swap="outerHTML"
      hx-target="#select-group-icon"
      class="py-2 px-3  w-full h-fit flex justify-between bg-primary-black rounded-md mt-1"
    >
      <p class="text-primary-grey font-normal">Select Group Icon</p>
      <img src="/activeIcons/expand_more.svg" />
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
  const html = renderToHtml(
    <AddMembersPage group={group} currentUser={currentUser} />
  );
  res.send(html);
});

export const groupRouter = router;
