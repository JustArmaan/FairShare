import { addAccount, getAccount } from '../services/account.service';
import { getAccountTypeIdByName } from '../services/accountType.service';
import { getCategoryIdByName } from '../services/category.service';
import {
  createTransactions,
  deleteTransactions,
  updateTransaction,
} from '../services/transaction.service';
import {
  getItemsForUser,
  updateItem,
  type Item,
} from '../services/plaid.service';
import { plaidRequest } from './link';

export async function syncTransactionsForUser(userId: string) {
  const items = await getItemsForUser(userId);
  items.forEach(syncTransaction);
}

async function syncTransaction({ item }: { item: Item }) {
  const count = 500;
  let cursor: string | undefined = item.nextCursor
    ? item.nextCursor
    : undefined;

  let accountsAdded = false;
  while (true) {
    const response = (await plaidRequest('/transactions/sync', {
      access_token: item.plaidAccessToken,
      cursor,
      count,
    })) as {
      accounts: {
        account_id: string;
        balances: {
          available: number | null;
          current: number | null;
          iso_currency_code: string | null;
          limit: number | null;
        };
        name: string;
        type: string;
      }[];
      added: AddedPlaidTransaction[];
      removed: { transaction_id: string }[];
      modified: ModifiedPlaidTransaction[];
      next_cursor: string;
      has_more: boolean;
    };
    const { accounts } = response;
    if (!accountsAdded) {
      await Promise.all(
        accounts.map(async (account) => {
          const accountTypeId = await getAccountTypeIdByName(account.type);
          if (!accountTypeId) return;
          const acc = await getAccount(account.account_id);
          if (!acc) {
            await addAccount({
              id: account.account_id,
              name: account.name,
              accountTypeId: accountTypeId.id,
              balance: (account.balances.available ||
                account.balances.current)!.toString(),
              currencyCodeId: null, // account.balances.iso_currency_code,
              itemId: item.id,
            });
          }
        })
      );
      accountsAdded = true;
    }
    const { added, modified, removed, next_cursor, has_more } = response;
    await addTransactions(added);
    await Promise.all(modified.map(modifyTransaction));
    if (removed.length > 0) {
      await deleteTransactions(
        removed.map((removed) => removed.transaction_id)
      );
    }
    if (!has_more) {
      updateItem(item.id, {
        nextCursor: next_cursor,
      });
      break;
    }
    cursor = next_cursor;
  }
}

interface PlaidTransactionGeneral {
  personal_finance_category: { primary: string };
  account_id: string;
  amount: number;
  date: string;
  datetime: string | null;
  merchant_name: string | null;
  name: string;
  logo_url: string;
  pending: boolean;
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface AddedPlaidTransaction extends PlaidTransactionGeneral {
  location: Location;
}

interface ModifiedPlaidTransaction extends Nullable<PlaidTransactionGeneral> {
  location: Nullable<Location>;
}

interface Location {
  address: string;
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

async function addTransactions(transactions: AddedPlaidTransaction[]) {
  const newTransactions = await Promise.all(
    transactions.map(async (transaction) => {
      const categoryId = await getCategoryIdByName(
        transaction.personal_finance_category.primary
      );
      if (!categoryId) throw new Error('No such category!');
      const locationIsNull = Object.values(transaction.location).some(
        (value) => value === null
      );
      return {
        address: locationIsNull
          ? null
          : `${transaction.location.address!},  ${transaction.location
            .city!}, ${transaction.location.region!}, ${transaction.location
              .country!}`,
        accountId: transaction.account_id,
        categoryId: categoryId.id,
        company: transaction.merchant_name
          ? transaction.merchant_name
          : transaction.name,
        amount: transaction.amount,
        timestamp: transaction.datetime
          ? transaction.datetime
          : transaction.date,
        latitude: transaction.location.lat,
        longitude: transaction.location.lon,
        pending: transaction.pending,
      };
    })
  );
  newTransactions.length > 0 && createTransactions(newTransactions);
}

async function modifyTransaction(transaction: ModifiedPlaidTransaction) {
  let categoryId: { id: string } | undefined | null = undefined;
  if (transaction.personal_finance_category) {
    categoryId = await getCategoryIdByName(
      transaction.personal_finance_category.primary
    );
    if (!categoryId) throw new Error('No such category!');
  }

  updateTransaction({
    // address: transaction.location ? locationToAddress(transaction.location) : undefined,
    accountId: transaction.account_id!,
    categoryId: categoryId ? categoryId.id : undefined,
    company: transaction.merchant_name
      ? transaction.merchant_name
      : transaction.name
        ? transaction.name
        : undefined,
    amount: transaction.amount ? transaction.amount : undefined,
    timestamp: transaction.datetime
      ? transaction.datetime
      : transaction.date
        ? transaction.date
        : undefined,
    latitude: transaction.location.lat ? transaction.location.lat : undefined,
    longitude: transaction.location.lon ? transaction.location.lon : undefined,
  });
}
