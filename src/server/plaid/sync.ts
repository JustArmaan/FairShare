import { createTransaction } from '../services/transaction.service';
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
  category: string[];
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
  location: Nullable<Location>
}

function locationToAddress(location: Location) {

}

async function addTransaction(transaction: AddedPlaidTransaction) {
  createTransaction({
    address: transaction.location
    accountId: transaction.account_id,

  })
}

async function modifyTransaction(transaction: ModifiedPlaidTransaction) {
}

async function deleteTransaction(transaction: { transaction_id: string }) {
}
