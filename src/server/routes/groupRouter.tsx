import express from 'express';
import { GroupPage } from '../views/pages/Groups/GroupPage';
import { renderToHtml } from 'jsxte';
import { getUser } from './authRouter.ts';
import {
  checkUserInGroup,
  deleteMemberByGroup,
  getCategory,
  getGroupTransactions,
  getGroupWithMembersAndTransactions,
  getGroupsAndAllMembersForUser,
  getTransactionsForGroup,
  transactionSumForGroup,
  type GroupMembersTransactions,
} from '../services/group.service';
import { findUser, getUserByEmailOnly } from '../services/user.service.ts';
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
import { getTransactionsForUser } from '../services/transaction.service.ts';
import { AddTransaction } from '../views/pages/Groups/components/AddTransaction.tsx';
import {
  getAccountWithTransactions,
  getAccountsForUser,
} from '../services/plaid.service';
import type { ExtractFunctionReturnType } from '../services/user.service';
import { GroupTransactionsListPage } from '../views/pages/Groups/TransactionsListGroupsPage.tsx';

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

router.get('/page', getUser, async (req, res) => {
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

router.get('/view/:groupId', getUser, async (req, res) => {
  try {
    const userId = req.user!.id;
    const currentUser = await findUser(userId);

    if (!currentUser) throw new Error('No such user');

    const group = await getGroupWithMembers(req.params.groupId);

    if (!group) return res.status(404).send('No such group');

    const transactions = await getTransactionsForGroup(group.id);
    const sum = await transactionSumForGroup(group.id);

    const html = renderToHtml(
      <ViewGroups
        groupId={group.id}
        transactions={transactions}
        members={group.members}
        currentUser={currentUser}
        groupBudget={groupBudget}
        transactionSum={sum}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get('/create', getUser, async (req, res) => {
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

router.get('/addMember', getUser, async (req, res) => {
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

router.get('/addMember/:groupId', getUser, async (req, res) => {
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

router.post('/create', getUser, async (req, res) => {
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

router.get('/edit', getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
    }
    const groups = await getGroupsAndAllMembersForUser(req.user.id);
    const html = renderToHtml(<GroupPage groups={groups ? groups : []} edit />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

export type UserGroupSchema = NonNullable<
  Awaited<ReturnType<typeof getGroupWithMembers>>
>;

router.get('/edit/:groupId', getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
    }

    const currentUser = await findUser(req.user.id);

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

router.get('/addTransaction/:groupId', getUser, async (req, res) => {
  try {
    const accounts = await getAccountsForUser(req.user!.id);
    if (!accounts) throw new Error('no accounts for user!');

    const groupTransactions = await getGroupTransactions(req.params.groupId);

    const accountsWithTransactions = (await Promise.all(
      accounts.map(
        async (account) => await getAccountWithTransactions(account.id)
      )
    )) as ExtractFunctionReturnType<typeof getAccountWithTransactions>[];
    const currentUser = req.user;
    const html = renderToHtml(
      <AddTransaction
        currentUser={currentUser!}
        groupId={req.params.groupId}
        accounts={accountsWithTransactions ? accountsWithTransactions : []}
        selectedAccountId={accountsWithTransactions[2].id}
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

router.post('/edit/:groupId', getUser, async (req, res) => {
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

    if (!currentGroup) {
      return res.status(404).send('Group not found');
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

router.get('/transactions/:groupId', getUser, async (req, res) => {
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

export const groupRouter = router;
