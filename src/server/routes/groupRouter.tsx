import express from 'express';
import { GroupPage } from '../views/pages/Groups/GroupPage';
import { renderToHtml } from 'jsxte';
import { getUser } from '@kinde-oss/kinde-node-express';
import { getCategories } from '../services/group.service';
import { createUser, findUser } from '../services/user.service.ts';
import { AddedMember } from '../views/pages/Groups/components/Member.tsx';
import {
  createGroup,
  addMember,
  getGroupWithMembers,
  getGroupsForUserWithMembers,
} from '../services/group.service.ts';
import { getUserByEmail } from '../services/user.service.ts';
import { seedFakeTransactions } from '../database/seedFakeTransations.ts';
import { env } from '../../../env.ts';
import CreateGroup from '../views/pages/Groups/components/CreateGroup.tsx';

const router = express.Router();

router.get('/page', getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
    }

    const groups = await getGroupsForUserWithMembers(req.user.id);
    const html = renderToHtml(<GroupPage groups={groups ? groups : []} />);
    res.send(html);
  } catch (err) {
    console.error(err);
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
    const member = await getUserByEmail(email);
    let content;

    if (!member) {
      return res.status(400).send('User not found.');
    } else {
      content = (
        <AddedMember
          user={{
            type: 'member',
            id: member.email,
            firstName: member.firstName,
            email: member.email,
          }}
        />
      );
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
    const {
      groupName,
      selectedCategoryId,
      memberEmails,
      temporaryGroup,
      selectedColor,
    } = req.body;

    const isTemp = temporaryGroup === 'on';

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
    for (const memberEmail of groupMembers) {
      const user = await getUserByEmail(memberEmail);
      if (user) {
        await addMember(group.id, user.id);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

router.get('/edit', getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
    }
    const groups = await getGroupsForUserWithMembers(req.user.id);
    const html = renderToHtml(<GroupPage groups={groups ? groups : []} edit />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get('/transactions/:groupId', getUser, async (req, res) => {
  // unfinished
  if (!req.user) {
    return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
  }
  const group = await getGroupWithMembers(req.params.groupId);
  if (!group) return res.status(404).send('No such group');
  const { id } = req.user;
});

export const groupRouter = router;
