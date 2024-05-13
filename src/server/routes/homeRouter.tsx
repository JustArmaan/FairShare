import express from 'express';
import { renderToHtml } from 'jsxte';
import { getTransactionsForUser } from '../services/transaction.service';
import { Overview } from '../views/pages/Overview/Overview';
import { getUser } from './authRouter';
import { syncTransactionsForUser } from '../plaid/sync';
const router = express.Router();

router.get('/page', getUser, async (req, res) => {
  try {
    const user = req.user!;
    syncTransactionsForUser(user.id).then(() => console.log("we did it"));
    const transactions = await getTransactionsForUser(user.id, 4);

    const userDetails = {
      userName: user.firstName,
      totalAmount: '8,987.34',
      cardsAmount: ['3,411.12', '5,223.52'],
    };

    const html = renderToHtml(
      <Overview transactions={transactions} userDetails={userDetails} />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

export const homeRouter = router;
