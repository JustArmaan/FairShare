import { Router } from 'express';
import { getAccessToken, getLinkToken } from '../../../plaid/plaid';
import { findUser, updateUser } from '../../../services/user.service';
import { getUser } from '../../authRouters';

const router = Router();

router.get('/connected', getUser, async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'Not logged in.',
      data: null,
    });
  }

  const databaseUser = await findUser(req.user.id);
  return res.json({
    error: null,
    data: { connected: databaseUser?.plaidAccessToken !== null },
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
    const { access_token } = await getAccessToken(publicToken as string);
    await updateUser(req.user.id, { plaidAccessToken: access_token });
    res.status(200).send();
  } catch (error) {
    return res.json({ error: error, data: null });
  }
});

export const apiRouterV0 = router;
