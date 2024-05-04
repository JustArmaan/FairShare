import express from 'express';
import { renderToHtml } from 'jsxte';
import { env } from '../../../env';
import { getTransactionsForUser } from '../services/transaction.service';
import { Overview } from '../views/pages/Overview/Overview';
import { getUser } from '@kinde-oss/kinde-node-express';
import { createUser, findUser } from '../services/user.service';
import { seedFakeTransactions } from '../database/seedFakeTransations';
const router = express.Router();

router.get('/page', getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
    }

    const { id, given_name, family_name, email, picture } = req.user;
    const databaseUser = await findUser(id);
    if (!databaseUser) {
      await createUser(id, given_name, family_name, email, picture);
      await seedFakeTransactions(id, 20);
    }
    const transactions = await getTransactionsForUser(req.user.id, 4);

    const userDetails = {
      userName: 'John Doe',
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
