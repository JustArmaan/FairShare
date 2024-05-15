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

import MyAccountsPage from '../views/pages/transactions/MyAccountsPage';
import { getAccount } from '../services/account.service';
import Transaction from '../views/pages/transactions/components/Transaction';
import TransactionsPage from '../views/pages/transactions/TransactionPage';
import { getUser } from './authRouter';
import { env } from '../../../env';
import {
  getAccountWithTransactions,
  getAccountsForUser,

} from '../services/plaid.service';
import type { ExtractFunctionReturnType } from '../services/user.service';
import { TransactionList } from '../views/pages/transactions/components/TransactionList';
import { AccountPickerForm } from '../views/pages/transactions/components/AccountPickerForm';
import AddButton from '../views/pages/transactions/components/AddButton';
import CheckButton from '../views/pages/transactions/components/CheckButton';
import { addTransactionsToGroup, deleteTransactionFromGroup } from '../services/group.service';

const router = express.Router();

router.get('/accountPicker/:accountId', getUser, async (req, res) => {
  const accounts = await getAccountsForUser(req.user!.id);
  if (!accounts) throw new Error('Missing accounts for user');
  const html = renderToHtml(
    <AccountPickerForm
      accounts={accounts}
      selectedAccountId={req.params.accountId}
    />
  );
  res.send(html);
});

router.get('/transactionList/:accountId', getUser, async (req, res) => {
  const account = await getAccountWithTransactions(req.params.accountId);
  if (!account) throw new Error('404');
  const html = renderToHtml(
    <TransactionList transactions={account.transactions} />
  );
  res.send(html);
});

router.get('/page/:selectedAccountId', getUser, async (req, res) => {
  try {
    const accounts = await getAccountsForUser(req.user!.id);
    if (!accounts) throw new Error('no accounts for user!');

    const html = renderToHtml(
      <TransactionsPage
        accounts={accounts}
        selectedAccountId={
          req.params.selectedAccountId !== 'debug'
            ? req.params.selectedAccountId
            : accounts[0].id
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
        {transactions.map((transaction) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={transaction.category.color}
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
        {transactions.map((transaction) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={transaction.category.color}
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
      tailwindColorClass={transaction.category.color}
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
  // Here after server works, I need to either call addTransactionsToGroup or deleteTransactionFromGroup, pass transactionId and groupId!!!
  
  if (value === "true") {
    const added = await addTransactionsToGroup(transactionId, groupId);
    if (added) {
      console.log('Transaction added to group successfully.');
    } else {
      console.log('Failed to add transaction to group.');
    }
  } else if (value === "false") {
    const deleted = await deleteTransactionFromGroup(transactionId, groupId);
    if (deleted) {
      console.log("Transaction deleted from group");
    } else {
      console.log("Failed to delete transaction");
    }
  }
  const html = renderToHtml(<CheckButton />);
  res.send(html);
});

export const transactionRouter = router;
