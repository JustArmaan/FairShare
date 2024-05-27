import { Router } from 'express';
import { getAccessToken, getLinkToken } from '../../../plaid/link';
import {
  addItemToUser,
  getAccountsForUser,
  getItemsForUser,
} from '../../../services/plaid.service';
import { getUser } from '../../authRouter';
import { syncTransactionsForUser } from '../../../plaid/sync';

const router = Router();

router.get('/connected', getUser, async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'Not logged in.',
      data: null,
    });
  }

  const items = await getItemsForUser(req.user.id);
  const connected = items.length > 0;
  return res.json({
    error: null,
    data: { connected },
  });
});

router.get('/has-accounts', getUser, async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'Not logged in.',
      data: null,
    });
  }

  const accounts = await getAccountsForUser(req.user.id);
  // console.log(accounts);
  const connected = accounts && accounts.length > 0;
  return res
    .set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    })
    .json({
      error: null,
      data: { connected },
    });
});

router.post('/sync', getUser, async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'Not logged in.',
      data: null,
    });
  }

  if (
    req.body.webhook_code === 'SYNC_UPDATES_AVAILABLE' ||
    req.body.webhook_code === 'DEFAULT_UPDATE' ||
    req.body.webhook_code === 'NEW_ACCOUNTS_AVAILABLE'
  ) {
    console.log('synced up');
    syncTransactionsForUser(req.user.id);
  }
  return res.status(200).send();
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
  // console.log(req.body, 'body');

  if (!publicToken) {
    return res.json({ error: 'Missing public token.', data: null });
  }

  try {
    const { access_token, item_id } = await getAccessToken(
      publicToken as string
    );
    await addItemToUser(req.user.id, {
      id: item_id as string,
      plaidAccessToken: access_token,
      nextCursor: null,
      institutionName: null,
    });
    console.log('added!');
    res.status(200).send();
  } catch (error) {
    return res.json({ error: error, data: null });
  }
});

interface SyncResponse {
  environment: string;
  historical_update_complete: boolean;
  initial_update_complete: boolean;
  item_id: string;
  webhook_code: string;
  webhook_type: string;
}

export const apiRouterV0 = router;
