import { Router } from 'express';
import { getAccessToken, getLinkToken } from '../../../integrations/plaid/link';
import {
  addItemToUser,
  getAccountsForUser,
  getItemsForUser,
} from '../../../services/plaid.service';
import { syncTransactionsForUser } from '../../../integrations/plaid/sync';
import { getUserByItemId } from '../../../services/user.service';
import crypto from 'crypto';
import { env } from '../../../../../env';

const router = Router();

router.get('/connected', async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'Not logged in.',
      data: null,
    });
  }

  const items = await getItemsForUser(req.user.id);
  console.log(items, 'itmes connected');
  const connected = items.length > 0;
  return res.json({
    error: null,
    data: { connected },
  });
});

router.get('/has-accounts', async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'Not logged in.',
      data: null,
    });
  }

  const accounts = await getAccountsForUser(req.user.id);
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

router.post('/sync', async (req, res) => {
  const { item_id } = req.body as { [key: string]: string };
  if (
    req.body.webhook_code === 'SYNC_UPDATES_AVAILABLE' ||
    req.body.webhook_code === 'DEFAULT_UPDATE' ||
    req.body.webhook_code === 'NEW_ACCOUNTS_AVAILABLE'
  ) {
    if (!item_id) return res.status(400).send();
    const { id } = (await getUserByItemId(item_id))!;
    await syncTransactionsForUser(id);
    console.log('synced up');
  }
  return res.status(200).send();
});

router.get('/sync', async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'Not logged in.',
      data: null,
    });
  }

  await syncTransactionsForUser(req.user.id);
  return res.status(200).send();
});

router.get('/plaid-token', async (req, res) => {
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

router.post('/plaid-public-token', async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'Not logged in.',
      data: null,
    });
  }

  const { publicToken } = req.body;
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

function calculateKey(apiSharedSecret: string, transactionID: string): string {
  return crypto
    .createHash('sha1')
    .update(apiSharedSecret + transactionID)
    .digest('hex');
}

router.post('/vopay-transactions-webhook', (req, res) => {
  try {
    const payload = req.body as {
      TransactionID: string;
      Status: string;
      ValidationKey: string;
    };
    // lifecycle: requested -> pending -> sent -> successful
    if (
      payload.ValidationKey !==
      calculateKey(env.vopaySharedSecret!, payload.TransactionID)
    )
      return res.status(404).send(); // simulate an empty route
    console.log(req.body, 'vopay transaction received');
  } catch (e) {
    console.error(e);
  }
});

export const apiRouterV0 = router;
