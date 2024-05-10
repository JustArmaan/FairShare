import express from 'express';
import { GroupPage } from '../views/pages/Groups/GroupPage';
import { renderToHtml } from 'jsxte';
import { getUser } from '@kinde-oss/kinde-node-express';
import {
  checkUserInGroup,
  deleteMemberByGroup,
  getCategories,
  getCategory,
  getGroupsAndAllMembersForUser,
} from '../services/group.service';
import { createUser, findUser } from '../services/user.service.ts';
import { AddedMember } from '../views/pages/Groups/components/Member.tsx';
import {
  createGroup,
  addMember,
  getGroupWithMembers,
  updateGroup,
} from '../services/group.service.ts';
import { getUserByEmail } from '../services/user.service.ts';
import { seedFakeTransactions } from '../database/seedFakeTransations.ts';
import { env } from '../../../env.ts';
import CreateGroup from '../views/pages/Groups/components/CreateGroup.tsx';
import { EditGroupPage } from '../views/pages/Groups/components/EditGroup.tsx';
import { ViewGroups } from '../views/pages/Groups/components/ViewGroup.tsx';
import { getTransactionsForUser } from '../services/transaction.service.ts';

const router = express.Router();

router.get('/page', getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
    }

    const groups = await getGroupsAndAllMembersForUser(req.user.id);
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
    if (!req.user) {
      return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
    }
    const userId = req.user.id;
    const [currentUser, transactions, group] = await Promise.all([
      findUser(userId),
      getTransactionsForUser(req.user.id, 4),
      getGroupWithMembers(req.params.groupId),
    ]);
    if (!currentUser) throw new Error('No such user');
    if (!group) return res.status(404).send('No such group');

    const html = renderToHtml(
      <ViewGroups
        groupId={group.id}
        transactions={transactions}
        members={group.members}
        currentUser={currentUser}
        groupBudget={groupBudget}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get('/create', getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
    }

    const { id, given_name, family_name } = req.user;

    let databaseUser = await findUser(id);
    if (!databaseUser) {
      await createUser({
        ...req.user,
        firstName: given_name,
        lastName: family_name,
      });
      await seedFakeTransactions(id, 20);
      databaseUser = await findUser(id);
      if (!databaseUser) throw new Error('failed to create user');
    }

    const allCategories = (await getCategories()) || [];

    const html = renderToHtml(
      <CreateGroup categories={allCategories} currentUser={databaseUser} />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get('/addMember', getUser, async (req, res) => {
  try {
    const email = req.query.addEmail as string;
    console.log(email)
    const member = await getUserByEmail(email);
    if (!member) {
      return res.status(400).send('User not found.');
    }

    const inGroup = await checkUserInGroup(
      member.id,
      req.query.groupId as string
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
      content = <AddedMember user={{ ...member, type: 'Invited' }} />;
    }
    let html = renderToHtml(content);
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.post('/create', getUser, async (req, res) => {
  try {
    const id = req.user?.id;
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

    const category = await getCategory(selectedCategoryId);

    if (!category) {
      return res.status(400).send('Category not found.');
    }

    const group = await createGroup(
      groupName,
      selectedColor,
      category.icon,
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
      const user = await getUserByEmail(memberEmail);
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

    const categories = await getCategories();
    if (!categories) return res.status(500).send('Failed to get categories');

    const group = await getGroupWithMembers(req.params.groupId);

    if (!group) return res.status(404).send('No such group');
    const html = renderToHtml(
      <EditGroupPage
        categories={categories}
        currentUser={currentUser}
        group={group}
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
      const user = await getUserByEmail(memberEmail);
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
  try{
    const userID = req.params.userID;
    const groupID = req.params.groupID;
    const deleteMembersByGroup = await deleteMemberByGroup(userID, groupID);

    if (!deleteMembersByGroup) {
      return res.status(500).send('Failed to delete member from group.');
    }
    console.log(userID, groupID)

  } catch (error){
    res.status(500).send('An error occured when removing a member')
  } 
})

/*
router.get('/transactions/:groupId', getUser, async (req, res) => {
  // unfinished
  if (!req.user) {
    return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
  }
  const group = await getGroupWithMembers(req.params.groupId);
  if (!group) return res.status(404).send('No such group');
  const { id } = req.user;
});
*/

export const groupRouter = router;
