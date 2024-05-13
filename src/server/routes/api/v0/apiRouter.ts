import { Router } from 'express';
import { getAccessToken, getLinkToken } from '../../../plaid/plaid';
import {
  addItemToUser,
  getItemsForUser,
  updateUser,
} from '../../../services/user.service';
import { getUser } from '../../authRouter';

const router = Router();

router.get('/connected', getUser, async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'Not logged in.',
      data: null,
    });
  }

  const items = await getItemsForUser(req.user.id);
  console.log(items, 'items');
  const connected = items.length > 0;
  console.log(connected);
  return res.json({
    error: null,
    data: { connected },
  });
});

router.get('/plaid-token', getUser, async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'Not logged in.',
      data: null,
    });
  }

  const token = await getLinkToken(req.user);
  res.json({
    error: null,
    data: token,
  });
});

router.post('/plaid-public-token', getUser, async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'Not logged in.',
      data: null,
    });
  }

  const { publicToken } = req.body;
  console.log(req.body, 'body');

  if (!publicToken) {
    return res.json({ error: 'Missing public token.', data: null });
  }

  try {
    const { access_token, item_id } = await getAccessToken(
      publicToken as string
    );
    console.log('running add code');
    await addItemToUser(req.user.id, {
      id: item_id as string,
      plaidAccessToken: access_token,
    });
    console.log('added!');
    res.status(200).send();
  } catch (error) {
    return res.json({ error: error, data: null });
  }
});

export const apiRouterV0 = router;
