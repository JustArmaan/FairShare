import express from 'express';
import { renderToHtml } from 'jsxte';
import { BreakdownPage } from '../views/pages/Breakdown/BreakdownPage';
import { debug_getTransactionsForAnyUser, getTransactionsForUser } from '../services/transaction.service';
import { env } from '../../../env';

const router = express.Router();

const examples = [
  {
    tailwindColorClass: 'bg-accent-red',
    percentage: 0.7,
    cost: 800,
    title: 'Food',
  },
  {
    tailwindColorClass: 'bg-accent-blue',
    percentage: 0.23,
    cost: 200,
    title: 'Rent',
  },
  {
    tailwindColorClass: 'bg-accent-green',
    percentage: 0.07,
    cost: 200,
    title: 'GPT-4',
  },
];

router.get('/page', async (req, res) => {
  if (!req.user) {
    return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
  }
  const transactions = await getTransactionsForUser(req.user.id, 4);
  const html = renderToHtml(<BreakdownPage transactions={transactions} />);

  res.send(html);
});

export const breakdownRouter = router;
