import express from 'express';
import { renderToHtml } from 'jsxte';
import { BreakdownPage } from '../views/pages/Breakdown/BreakdownPage';
import { getTransactionsForUser } from '../services/transaction.service';
import { getUser } from './authRouter';
import { getAccountWithTransactions } from '../services/plaid.service';

const router = express.Router();

router.get('/page/:accountId', getUser, async (req, res) => {
  const result = await getAccountWithTransactions(req.params.accountId);
  if (!result) throw new Error('404');
  const html = renderToHtml(
    <BreakdownPage
      transactions={result.transactions}
      accountName={result.name}
    />
  );

  res.send(html);
});

export const breakdownRouter = router;
