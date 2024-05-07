import express from 'express';
import { renderToHtml } from 'jsxte';
import { GroupPage } from '../views/pages/Group/GroupPage';
import { env } from '../../../env';
import { getUser } from '@kinde-oss/kinde-node-express';
import {
  getGroupWithMembers,
  getGroupsForUserWithMembers,
} from '../services/group.service';

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
  if (!req.user) {
    return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
  }
  const group = await getGroupWithMembers(req.params.groupId);
  if (!group) return res.status(404).send("No such group");
  const { id } = req.user;

});

export const groupRouter = router;
