import { getCategoryIdByName } from '../services/category.service';
import {
  createTransaction,
  updateTransaction,
} from '../services/transaction.service';
import { getItemsForUser, type Item } from '../services/user.service';
import { plaidRequest } from './link';

export async function syncTransactions(userId: string) {
  const items = await getItemsForUser(userId);
  items.forEach(syncTransaction);
}

async function syncTransaction({ item }: { item: Item }) {
  const count = 500;
  let cursor: string | undefined = undefined;

  while (true) {
    const response = await plaidRequest('/transactions/sync', {
      access_token: item.plaidAccessToken,
      cursor: cursor,
      count,
    });
    const { added } = response;
    const addPromises = added.map(addTransaction);
    await Promise.all(addPromises);
  }
}

interface Location {
  address: string;
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

interface PlaidTransactionGeneral {
  personal_finance_category: { primary: string };
  account_id: string;
  amount: number;
  datetime: string;
  merchant_name: string;
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

function locationToAddress(location: Location) {
  return `${location.address},  ${location.city}, ${location.region}, ${location.country}`;
}

async function addTransaction(transaction: AddedPlaidTransaction) {
  const categoryId = await getCategoryIdByName(
    transaction.personal_finance_category.primary
  );
  if (!categoryId) throw new Error('No such category!');
  createTransaction({
    address: locationToAddress(transaction.location),
    accountId: transaction.account_id,
    categoryId: categoryId.id,
    company: transaction.merchant_name,
    amount: transaction.amount,
    timestamp: transaction.datetime,
    latitude: transaction.location.lat,
    longitude: transaction.location.lon,
  });
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
    accountId: transaction.account_id ? transaction.account_id : undefined,
    categoryId: categoryId ? categoryId.id : undefined,
    company: transaction.merchant_name ? transaction.merchant_name : undefined,
    amount: transaction.amount ? transaction.amount : undefined,
    timestamp: transaction.datetime ? transaction.datetime : undefined,
    latitude: transaction.location.lat ? transaction.location.lat : undefined,
    longitude: transaction.location.lon ? transaction.location.lon : undefined,
  });
}

async function deleteTransaction(transaction: { transaction_id: string }) { }
