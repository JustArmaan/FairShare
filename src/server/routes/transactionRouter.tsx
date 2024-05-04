import express from 'express';
import { renderToHtml } from 'jsxte';
import TransactionDetailsPage from '../views/pages/transactions/TransactionDetails';
import {
  getTransaction,
  getTransactionsForUser,
} from '../services/transaction.service';
import TransactionsPage from '../views/pages/transactions/Transactions';
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

router.get('/page', async (req, res) => {
  try {
    const transactions = await getTransactionsForUser(req.user!.id, 4); // Could this be undefined

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
      <TransactionDetailsPage
        transaction={transaction}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

export const transactionRouter = router;
