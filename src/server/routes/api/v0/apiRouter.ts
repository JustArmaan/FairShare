import { getUser } from '@kinde-oss/kinde-node-express';
import { Router } from 'express';
import { getLinkToken } from '../../../plaid/plaid';

const router = Router();

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

export const apiRouterV0 = router;
