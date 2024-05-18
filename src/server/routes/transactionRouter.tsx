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
import TransactionsPage from '../views/pages/transactions/TransactionPage';
import { getUser } from './authRouter';
import { env } from '../../../env';
import {
  getAccountWithTransactions,
  getAccountsForUser,
  getItem,
} from '../services/plaid.service';
import { TransactionList } from '../views/pages/transactions/components/TransactionList';
import { AccountPickerForm } from '../views/pages/transactions/components/AccountPickerForm';
import {
  addTransactionsToGroup,
  deleteTransactionFromGroup,
  getGroupWithMembers,
  getTransactionsToGroup,
  getUsersToGroup,
} from '../services/group.service';
import {
  createOwed,
  getAllOwedForGroupTransaction,
} from '../services/owed.service';
import { getAccountTypeById } from '../services/accountType.service';
import { getAccount } from '../services/account.service';
import { tr } from '@faker-js/faker';

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
  const html = renderToHtml(<TransactionList account={account} />);
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
    const account = await getAccount(transaction.accountId);

    if (!transaction || !account) return res.status(404).send('404');

    const accountType = await getAccountTypeById(
      account.accountTypeId ? account.accountTypeId : 'Unknown'
    );

    const item = await getItem(account.itemId);
    if (!item) return res.status(404).send('404');

    const html = renderToHtml(
      <TransactionDetailsPage
        transaction={transaction}
        accountType={accountType ? accountType : 'Unknown'}
        institution={item.institutionName ? item.institutionName : 'Unknown'}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.post('/search/:selectedAccountId', getUser, async (req, res) => {
  try {
    const query = req.body.search;
    const accountId = req.params.selectedAccountId;
    const transactions = await searchTransactions(accountId, query);

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

router.post('/date/:selectedAcoountId', getUser, async (req, res) => {
  try {
    const userId = req.user!.id;
    const accountId = req.params.selectedAcoountId;
    let month = req.body.month;
    const year = req.body.year;
    const reset = req.body.reset;

    let transactions;

    if (reset) {
      transactions = await getTransactionsForUser(userId, 999999);
    }

    month = month.padStart(2, '0');

    transactions = await getTransactionsByMonth(accountId, year, month);

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
  // sorry jeremy ^^^^
  const { checked, transactionId, groupId } = req.query as {
    [key: string]: string;
  };

  const transaction = await getTransaction(transactionId);
  console.log(transaction);
  // add/remove the transaction to group relationship

  const { members } = (await getGroupWithMembers(groupId))!;
  if (checked === 'false') {
    await addTransactionsToGroup(transaction.id, groupId);

    await Promise.all(
      members.map(async (member) => {
        const owedPerMember = transaction.amount / members.length;
        return await createOwed({
          usersToGroupsId: (await getUsersToGroup(groupId, member.id))!.id,
          transactionsToGroupsId: (await getTransactionsToGroup(
            groupId,
            transactionId
          ))!.id,
          amount:
            member.id === req.user!.id
              ? owedPerMember * (members.length - 1)
              : -1 * owedPerMember,
        });
      })
    );
  } else if (checked === 'true') {
    const allTransactions = await getAllOwedForGroupTransaction(
      groupId,
      transaction.id
    );
    if (allTransactions!.some((transaction) => transaction.amount === 0)) {
      return res
        .status(400)
        .send("Can't remove transaction that is being settled");
    } else {
      await deleteTransactionFromGroup(transaction.id, groupId as string);
    }
  }

  const html = renderToHtml(
    <Transaction
      tailwindColorClass={transaction.category.color}
      transaction={transaction}
      checked={!(checked === 'true')}
      route="AddTransaction"
      groupId={groupId as string}
    />
  );
  res.send(html);
});

export const transactionRouter = router;
