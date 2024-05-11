import express from 'express';
import { renderToHtml } from 'jsxte';
import { BreakdownPage } from '../views/pages/Breakdown/BreakdownPage';
import { getTransactionsForUser } from '../services/transaction.service';
import { getUser } from '@kinde-oss/kinde-node-express';

const router = express.Router();

router.get('/page', getUser, async (req, res) => {
  const transactions = await getTransactionsForUser(req.user!.id, 4);
  const html = renderToHtml(<BreakdownPage transactions={transactions} />);

  res.send(html);
});

export const breakdownRouter = router;
