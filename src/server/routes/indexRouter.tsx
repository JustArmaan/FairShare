import express from 'express';
import { renderToHtml } from 'jsxte';
import { TransactionsPage } from '../views/pages/transactions/Transactions';
import { env } from '../../../env';
import { debug_getTransactionsForAnyUser } from '../services/transaction.service';
import { text } from 'stream/consumers';
import type { tr } from '@faker-js/faker';
import { Overview } from '../views/pages/Overview/Overview';
import { Header } from '../views/components/Header';
import { Nav } from '../views/components/Navigation';
import { Default } from '../views/components/Default';
import { Menu } from '../views/components/Menu';
import { TransactionDetailsPage } from '../views/pages/transactions/TransactionDetails';
import { getUser } from '@kinde-oss/kinde-node-express';
const router = express.Router();

export type Transactions = Awaited<
  ReturnType<typeof debug_getTransactionsForAnyUser>
>;

const cardHtml = {
  bankLogo: '/cardAssets/scotiabank.svg',
  bankName: 'ScotiaBank',
  cardNumber: '8763 **** **** ****',
  cardHolder: 'John Doe',
  expiryDate: '10/28',
  primaryColor: 'card-red',
  textColor: 'font-off-white',
  accentColor1: 'accent-yellow',
  accentColor2: 'accent-red',
};

router.get('/callback', async (req, res) => {
  res.redirect('/');
});

router.get('/home', getUser, async (req, res) => {
  // @ts-ignore
  if (!req.user) {
    return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
  }
  // @ts-ignore
  console.log(req.user, 'hi');
  const transactions = await debug_getTransactionsForAnyUser(4);

  const userDetails = {
    userName: 'John Doe',
    totalAmount: '8,987.34',
    cardsAmount: ['3,411.12', '5,223.52'],
  };

  const html = renderToHtml(
    <Overview transactions={transactions} userDetails={userDetails} />
  );
  res.send(html);
});

router.get('/transactionDetails/:transactionId', async (req, res) => {
  const transactions = await debug_getTransactionsForAnyUser(4);
  const transaction = transactions.find(
    (transaction) =>
      transaction.transactions.id === parseInt(req.params.transactionId)
  );
  if (!transaction) return res.status(404).send('404');

  const html = renderToHtml(
    <TransactionDetailsPage transaction={transaction} />
  );
  res.send(html);
});

router.get('/menu', async (_, res) => {
  const html = renderToHtml(<Menu />);
  res.send(html);
});

router.get('/transactions', async (_, res) => {
  try {
    const transactions = await debug_getTransactionsForAnyUser();

    const html = renderToHtml(
      <TransactionsPage transactions={transactions} cardDetails={cardHtml} />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get('/header', (req, res) => {
  try {
    const html = renderToHtml(<Header />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get('/nav', (req, res) => {
  try {
    const html = renderToHtml(<Nav />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

export const indexRouter = router;
