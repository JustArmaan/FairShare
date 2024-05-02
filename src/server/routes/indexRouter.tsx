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
const router = express.Router();

router.get('/home', async (_, res) => {
  setTimeout(async () => {
    const transactions = await getTransactionsForUser(31, 4);
    const mappedTransactions = transactions.map((item) => {
      return {
        ...item.transactions,
        category: item.categories,
      };
    });

    const html = renderToHtml(<Overview transactions={mappedTransactions} />);
    res.send(html);
  }, 0); // Delay in milliseconds
});

router.get('/transactions', async (_, res) => {
  try {
    const cardHtml = {
      bankLogo: '/cardAssets/scotiabank.svg',
      bankName: 'ScotiaBank',
      cardNumber: '8763 2736 9873 ****',
      cardHolder: 'John Doe',
      expiryDate: '10/28',
      primaryColor: 'primary-red',
      textColor: 'font-off-white',
      accentColor1: 'accent-yellow',
      accentColor2: 'accent-red',
    };

    const transactions = await getTransactionsForUser(31);
    const mappedTransactions = transactions.map((item) => {
      return {
        ...item.transactions,
        category: item.categories,
      };
    });

    const html = renderToHtml(
      <TransactionsPage
        transactions={mappedTransactions}
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
