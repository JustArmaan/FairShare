import express from 'express';
import { renderToHtml } from 'jsxte';
import TransactionDetailsPage from '../views/pages/transactions/TransactionDetails';
import {
  getTransaction,
  getTransactionLocation,
  getTransactionsForUser,
  searchTransactions,
  getTransactionsByMonth,
} from '../services/transaction.service';
import Transaction from '../views/pages/transactions/components/Transaction';
import TransactionsPage from '../views/pages/transactions/TransactionList';
import { getUser } from './authRouter';
import { env } from '../../../env';

const router = express.Router();

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

const iconColors = [
  'bg-accent-red',
  'bg-accent-blue',
  'bg-accent-green',
  'bg-accent-yellow',
];

router.get('/page', getUser, async (req, res) => {
  if (!req.user) {
    return res.set('HX-Redirect', `${env.baseUrl}/login`).send();
  }
  try {
    const transactions = await getTransactionsForUser(req.user!.id, 999999);

    const html = renderToHtml(
      <TransactionsPage transactions={transactions} cardDetails={cardHtml} />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get('/details/:transactionId', async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const transaction = await getTransaction(transactionId);

    if (!transaction) return res.status(404).send('404');

    const html = renderToHtml(
      <TransactionDetailsPage transaction={transaction} />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.post('/search', getUser, async (req, res) => {
  try {
    const userId = req.user!.id;
    const query = req.body.search;
    const transactions = await searchTransactions(userId, query);

    const html = renderToHtml(
      <div>
        {transactions.map((transaction, categoryIndex) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={iconColors[categoryIndex % iconColors.length]}
          />
        ))}
      </div>
    );

    res.send(html);
  } catch (error) {
    console.error('Error searching transactions:', error);
    res.status(500).send('Error searching transactions');
  }
});

router.post('/date', getUser, async (req, res) => {
  try {
    const userId = req.user!.id;
    let month = req.body.month;
    const year = req.body.year;

    month = month.padStart(2, '0');

    const transactions = await getTransactionsByMonth(userId, year, month);

    const html = renderToHtml(
      <div>
        {transactions.map((transaction, categoryIndex) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={iconColors[categoryIndex % iconColors.length]}
          />
        ))}
      </div>
    );

    res.send(html);
  } catch (error) {
    console.error('Error getting transactions by month:', error);
    res.status(500).send('Error getting transactions by month');
  }
});

router.get('/location/:transactionId', async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const transaction = await getTransactionLocation(transactionId);

    if (!transaction) return res.status(404).send('404');

    const location = {
      lat: transaction.latitude,
      lng: transaction.longitude,
    };

    res.json(location);
  } catch (error) {
    console.error(error);
  }
});

export const transactionRouter = router;
