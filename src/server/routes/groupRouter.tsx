import express from 'express';
import { GroupPage } from '../views/pages/Groups/GroupPage';
import { renderToHtml } from 'jsxte';
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
} from '../services/group.service';
import {
  findUser,
  getUserByEmailOnly,
  updateUser,
} from '../services/user.service.ts';
import { AddedMember } from '../views/pages/Groups/components/Member.tsx';
import {
  createGroup,
  addMember,
  getGroupWithMembers,
  updateGroup,
} from '../services/group.service.ts';
import { env } from '../../../env.ts';
import CreateGroup from '../views/pages/Groups/components/CreateGroup.tsx';
import { EditGroupPage } from '../views/pages/Groups/components/EditGroup.tsx';
import { ViewGroups } from '../views/pages/Groups/components/ViewGroup.tsx';
import { AddTransaction } from '../views/pages/Groups/components/AddTransaction.tsx';
import {
  getAccountWithTransactions,
  getAccountsForUser,
} from '../services/plaid.service';
import type { ExtractFunctionReturnType } from '../services/user.service';
import { GroupTransactionsListPage } from '../views/pages/Groups/TransactionsListGroupsPage.tsx';
import {
  getAllOwedForGroupTransactionWithMemberInfo,
  getAllOwedForGroupTransactionWithTransactionId,
  getGroupIdAndTransactionIdForOwed,
} from '../services/owed.service.ts';
import { TransactionList } from '../views/pages/transactions/components/TransactionList.tsx';
import { AccountPickerForm } from '../views/pages/transactions/components/AccountPickerForm.tsx';
import Transaction from '../views/pages/transactions/components/Transaction.tsx';
import { getTransaction } from '../services/transaction.service.ts';
import { ViewAndPayPage } from '../views/pages/Groups/ViewAndPayPage.tsx';
import { InstitutionDropDown } from '../views/pages/Groups/components/InstitutionDropDown.tsx';
import {
  getAccountWithItem,
  getAccountsWithItemsForUser,
} from '../services/account.service.ts';
import { AccountSelector } from '../views/pages/Groups/components/AccountSelector.tsx';

const router = express.Router();

const icons = [
  {
    id: '2707335e-ad80-458a-a1e6-fb25300e5621',
    name: 'Heart',
    icon: './groupIcons/heart.svg',
  },
  {
    id: '2707335e-ad80-458a-a1e6-fb25300e5622',
    name: 'Star',
    icon: './groupIcons/star.svg',
  },
  {
    id: '2707335e-ad80-458a-a1e6-fb25300e5623',
    name: 'Drink',
    icon: './groupIcons/drink.svg',
  },
  {
    id: '2707335e-ad80-458a-a1e6-fb25300e5624',
    name: 'Diamond',
    icon: './groupIcons/diamond.svg',
  },
  {
    id: '2707335e-ad80-458a-a1e6-fb25300e5625',
    name: 'Food',
    icon: './groupIcons/food.svg',
  },
  {
    id: '2707335e-ad80-458a-a1e6-fb25300e5626',
    name: 'Crown',
    icon: './groupIcons/crown.svg',
  },
  {
    id: '2707335e-ad80-458a-a1e6-fb25300e5627',
    name: 'Gift',
    icon: './groupIcons/gift.svg',
  },
];

router.get('/page', async (req, res) => {
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

router.get('/view/:groupId', async (req, res) => {
  try {
    const userId = req.user!.id;
    const currentUser = await findUser(userId);

    if (!currentUser) throw new Error('No such user');

    const group = await getGroupWithMembers(req.params.groupId);

    if (!group) return res.status(404).send('No such group');

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

    const account = await getAccountsForUser(userId);
    const accountId = account ? account[0].id : '';
    console.log(group.id, userId);
    const { depositAccountId } = (await getUsersToGroup(group.id, userId))!;

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
                  transactionId: '',
                  userId: member.id,
                  amount: 0,
                  groupTransactionToUsersToGroupsId: '',
                  pending: true,
                })),
              ]
        }
        accountId={accountId}
        selectedDepositAccountId={depositAccountId}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get('/confirm-transaction', async (req, res) => {
  const { owedId } = req.query as {
    [key: string]: string;
  };
  await setGroupTransactionStatePending(owedId, null);
  const groupId = await getGroupIdFromOwed(owedId);
  const html = renderToHtml(
    <div
      hx-get={`/groups/view/${groupId}`}
      hx-swap="innerHTML"
      hx-trigger="load"
      hx-target="#app"
    />
  );
  res.send(html);
});

router.get(
  '/pay/:groupTransactionToUsersToGroupsId/:groupId',
  async (req, res) => {
    const result = await getGroupIdAndTransactionIdForOwed(
      req.params.groupTransactionToUsersToGroupsId
    );
    // console.log("Result from getGroupIdAndTransactionIdForOwed:", result);

    if (!result) {
      return res.status(404).send('Group ID and Transaction ID not found');
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
router.get('/account-selector/select', async (req, res) => {
  const { id } = req.user!;
  const {
    accountId,
    isDepositAccount: isDepositAccountParamater,
    groupId,
  } = req.query as { [key: string]: string };
  const accounts = await getAccountsWithItemsForUser(id);
  const selectedAccount =
    accountId && accountId !== '' ? await getAccountWithItem(accountId) : null;

  const isDepositAccount = isDepositAccountParamater === 'true';
  console.log(isDepositAccountParamater, groupId);
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
router.get('/account-selector/institution-drop-down/', async (req, res) => {
  const { id } = req.user!;
  const { open: openParam, selected: selectedItemId } = req.query as {
    [key: string]: string;
  };
  console.log(openParam, 'param');
  const open = openParam === 'true';
  console.log(open);
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

router.get('/create', async (req, res) => {
  try {
    const { id } = req.user!;

    let databaseUser = await findUser(id);
    if (!databaseUser) throw new Error('failed to create user');

    const html = renderToHtml(
      <CreateGroup
        icons={icons}
        currentUser={{ ...databaseUser, type: 'Owner' }}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get('/addMember', async (req, res) => {
  try {
    const email = req.query.addEmail as string;
    const member = await getUserByEmailOnly(email);

    if (!member) {
      return res.status(400).send('User not found.');
    }

    let content;

    if (!member) {
      return res.status(400).send('User not found.');
    } else {
      content = <AddedMember user={{ ...member, type: 'Invited' }} />;
    }
    const html = renderToHtml(content);
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get('/addMember/:groupId', async (req, res) => {
  try {
    const email = req.query.addEmail as string;
    const member = await getUserByEmailOnly(email);

    if (!member) {
      return res.status(400).send('User not found.');
    }

    const inGroup = await checkUserInGroup(
      member.id,
      req.params.groupId as string
    );

    let content;

    if (inGroup) {
      return res.status(400).send('User is already in the group.');
    }
    const group = await getGroupWithMembers(req.params.groupId);

    if (!group) return res.status(404).send('No such group');

    if (!member) {
      return res.status(400).send('User not found.');
    } else {
      content = (
        <AddedMember user={{ ...member, type: 'Invited' }} groupId={group.id} />
      );
    }
    const html = renderToHtml(content);
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.post('/create', async (req, res) => {
  try {
    const { id } = req.user!;
    if (!id) {
      return res.set('HX-Redirect', '/login').send();
    }

    const currentUser = await findUser(id);

    if (!currentUser) {
      return res.status(500).send('Failed to get user');
    }

    const {
      groupName,
      selectedCategoryId,
      memberEmails,
      temporaryGroup,
      selectedColor,
    } = req.body;

    if (
      !groupName ||
      groupName === '' ||
      !selectedCategoryId ||
      selectedCategoryId === '' ||
      !selectedColor ||
      selectedColor === ''
    ) {
      return res.status(400).send('Please fill out all fields.');
    }

    let isTemp = temporaryGroup === 'on';

    if (!temporaryGroup || temporaryGroup === '') {
      isTemp = false;
    }

    if (!selectedCategoryId) {
      return res.status(400).send('Category not found.');
    }

    const group = await createGroup(
      groupName,
      selectedColor,
      selectedCategoryId,
      isTemp.toString()
    );

    if (!group) {
      return res.status(500).send('Failed to create group.');
    }

    const groupMembers = memberEmails.split(',');
    if (groupMembers.includes('')) {
      if (currentUser) {
        groupMembers.push(currentUser.email);
      }
    }
    for (const memberEmail of groupMembers) {
      const user = await getUserByEmailOnly(memberEmail);
      if (user) {
        if (user.id !== currentUser.id) {
          await addMember(group.id, user.id, 'Invited');
        } else if (user.id === currentUser.id) {
          await addMember(group.id, user.id, 'Owner');
        }
      }
    }

    const allGroupsForCurrentUser = await getGroupsAndAllMembersForUser(
      currentUser.id
    );

    if (!allGroupsForCurrentUser) {
      return res.status(500).send('Failed to get groups for user.');
    }

    const html = renderToHtml(<GroupPage groups={allGroupsForCurrentUser} />);
    return res.status(200).send(html);
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred while creating the group.');
  }
});

router.get('/edit', async (req, res) => {
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

router.get('/edit/:groupId', async (req, res) => {
  try {
    const currentUser = await findUser(req.user!.id);

    if (!currentUser) {
      return res.status(500).send('Failed to get user');
    }

    const group = await getGroupWithMembers(req.params.groupId);
    if (!group) return res.status(404).send('No such group');

    const html = renderToHtml(
      <EditGroupPage icons={icons} currentUser={currentUser} group={group} />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get('/addTransaction/:accountId/:groupId', async (req, res) => {
  try {
    const accounts = await getAccountsForUser(req.user!.id);
    if (!accounts) throw new Error('no accounts for user!');

    const groupTransactions = await getGroupTransactions(req.params.groupId);

    const accountsWithTransactions = (await Promise.all(
      accounts.map(
        async (account) => await getAccountWithTransactions(account.id)
      )
    )) as ExtractFunctionReturnType<typeof getAccountWithTransactions>[];
    const selectedAccountId = req.params.accountId;
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
      />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.post('/edit/:groupId', async (req, res) => {
  try {
    const {
      groupName,
      selectedCategoryId,
      selectedColor,
      memberEmails,
      temporaryGroup,
    } = req.body;

    const isTemp = temporaryGroup === 'on';
    const currentGroup = await getGroupWithMembers(req.params.groupId);

    const currentMember = currentGroup!.members.find(
      (member) => req.user!.id === member.id
    );
    if (!currentGroup) {
      return res.status(404).send('Group not found');
    }

    if (currentMember?.type !== 'Owner') {
      res.status(403).send('Only the owner can edit a group.');
    }

    if (!req.user) {
      return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
    }

    const currentUser = await findUser(req.user.id);

    if (!currentUser) {
      return res.status(500).send('Failed to get user');
    }

    const updates: {
      name?: string;
      color?: string;
      icon?: string;
      temporary?: string;
    } = {};
    if (groupName !== currentGroup.name && groupName !== '')
      updates.name = groupName;
    if (selectedColor !== currentGroup.color && selectedColor !== '')
      updates.color = selectedColor;
    if (selectedCategoryId !== currentGroup.icon && selectedCategoryId !== '')
      updates.icon = selectedCategoryId;
    if (
      isTemp.toString() !== currentGroup.temporary &&
      isTemp.toString() !== ''
    )
      updates.temporary = isTemp.toString();

    const groupMembers = memberEmails
      ? memberEmails.split(',').map((email: string) => email.trim())
      : [];
    const existingEmails = new Set(
      currentGroup.members.map((member) => member.email)
    );
    const newMembers = groupMembers.filter(
      (email: string) => !existingEmails.has(email)
    );

    if (Object.keys(updates).length === 0 && newMembers.length === 0) {
      return res.status(400).send('No changes detected');
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
        return res.status(500).send('Failed to update group');
      }
    }

    for (const memberEmail of newMembers) {
      const user = await getUserByEmailOnly(memberEmail);
      if (user) {
        await addMember(currentGroup.id, user.id, 'Invited');
      } else {
        return res.status(400).send(`User with email ${memberEmail} not found`);
      }
    }

    const allGroupsForCurrentUser = await getGroupsAndAllMembersForUser(
      currentUser.id
    );

    if (!allGroupsForCurrentUser) {
      return res.status(500).send('Failed to get groups for user.');
    }

    const html = renderToHtml(<GroupPage groups={allGroupsForCurrentUser} />);
    return res.status(200).send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating the group');
  }
});

router.post('/deleteMember/:userID/:groupID', async (req, res) => {
  try {
    const userID = req.params.userID;
    const groupID = req.params.groupID;
    await deleteMemberByGroup(userID, groupID);
    res.status(204).send();
  } catch (error) {
    res.status(500).send('An error occured when removing a member');
  }
});

router.get('/transactions/:groupId', async (req, res) => {
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

router.get(
  '/transactionList/:accountId/:groupId',

  async (req, res) => {
    const account = await getAccountWithTransactions(req.params.accountId);
    const groupTransactions = await getGroupTransactions(req.params.groupId);
    if (!account) throw new Error('404');
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

router.get('/accountPicker/:accountId/:groupId', async (req, res) => {
  const accounts = await getAccountsForUser(req.user!.id);
  if (!accounts) throw new Error('Missing accounts for user');
  const html = renderToHtml(
    <AccountPickerForm
      accounts={accounts}
      selectedAccountId={req.params.accountId}
      groupId={req.params.groupId as string}
    />
  );
  res.send(html);
});

router.get('/getTransactions/:groupId/', async (req, res) => {
  const groupTransactions = await getGroupWithMembersAndTransactions(
    req.params.groupId
  );
  const html = renderToHtml(
    <>
      {groupTransactions &&
        groupTransactions.transactions.map((transaction) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={transaction.category.color}
          />
        ))}
    </>
  );
  res.send(html);
});

export const groupRouter = router;
