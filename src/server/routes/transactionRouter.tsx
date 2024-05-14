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
import {
  getAccountWithTransactions,
  getAccountsForUser,
} from '../services/plaid.service';
import type { ExtractFunctionReturnType } from '../services/user.service';
import AddButton from '../views/pages/transactions/components/AddButton';
import CheckButton from '../views/pages/transactions/components/CheckButton';

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

const fakeAccounts = [
  {
    id: 'acc-001',
    name: 'Checking Account',
    institutionId: 'inst-001',
    itemId: 'item-001',
    accountTypeId: 'type-01',
    balance: '2500.0',
    currencyCodeId: 'USD',
  },
  {
    id: 'acc-002',
    name: 'Savings Account',
    institutionId: 'inst-002',
    itemId: 'item-002',
    accountTypeId: 'type-02',
    balance: '8000.0',
    currencyCodeId: 'EUR',
  },
  {
    id: 'acc-003',
    name: 'Investment Account',
    institutionId: 'inst-003',
    itemId: 'item-003',
    accountTypeId: 'type-03',
    balance: '15000.0',
    currencyCodeId: 'CAN',
  },
];

router.get('/page/:selectedAccountId', getUser, async (req, res) => {
  try {
    const accounts = await getAccountsForUser(req.user!.id);
    if (!accounts) throw new Error('no accounts for user!');
    const accountsWithTransactions = (await Promise.all(
      accounts.map(
        async (account) => await getAccountWithTransactions(account.id)
      )
    )) as ExtractFunctionReturnType<typeof getAccountWithTransactions>[];

    const html = renderToHtml(
      <TransactionsPage
        accounts={accountsWithTransactions ? accountsWithTransactions : []}
        selectedAccountId={
          req.params.selectedAccountId !== 'debug'
            ? req.params.selectedAccountId
            : accountsWithTransactions[0].id
        }
      />
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
    const reset = req.body.reset;
    console.log(reset, 'reset');

    let transactions;

    if (reset) {
      transactions = await getTransactionsForUser(userId, 999999);
    }

    month = month.padStart(2, '0');

    transactions = await getTransactionsByMonth(userId, year, month);

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

router.get('/addButton', async (req, res) => {
  const { checked, transactionId } = req.query;

  const transaction = await getTransaction(transactionId as string);
  // add/remove the transaction to group relationship
  const html = renderToHtml(
    <Transaction
      tailwindColorClass={iconColors[1 % iconColors.length]}
      transaction={transaction}
      checked={!(checked === 'true')}
      route="AddTransaction"
    />
  );
  res.send(html);
});

router.get('/checkedButton', async (req, res) => {
  const value = req.query.added as string;
  if (value === undefined) {
    return res.status(404).send('add button value is undefined');
  }
  console.log(value);
  const html = renderToHtml(<CheckButton />);
  res.send(html);
});

export const transactionRouter = router;
