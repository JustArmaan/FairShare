import express from 'express';
import { renderToHtml } from 'jsxte';
import { TransactionsPage } from '../views/pages/transactions/Transactions';
import { env } from '../../../env';
import { getTransactionsForUser } from '../services/transaction.service';
import { text } from 'stream/consumers';
import type { tr } from '@faker-js/faker';
import { Overview } from '../views/pages/Overview/Overview';
import { Header } from '../views/components/Header';
import { Nav } from '../views/components/Navigation';
import { Default } from '../views/components/Default';
import { Menu } from '../views/components/Menu';
const router = express.Router();

export type Transactions = Awaited<ReturnType<typeof getTransactionsForUser>>;

router.get('/home', async (_, res) => {
  const transactions = await getTransactionsForUser(15, 4);

  const html = renderToHtml(<Overview transactions={transactions} />);
  res.send(html);
});

router.get('/menu', async (_, res) => {
  const html = renderToHtml(<Menu />);
  res.send(html);
});

router.get('/transactions', async (_, res) => {
  try {
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

    const transactions = await getTransactionsForUser(15);

    const html = renderToHtml(
      <TransactionsPage
        transactions={transactions}
        cardDetails={cardHtml}
      />
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
