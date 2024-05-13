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

interface PlaidTransaction {
  category: string[];
  account_id: string;
  amount: number;
  datetime: string;
  location: {
  };
  merchant_name: string;
  logo_url: string;
  pending: boolean;
}

async function addTransaction(transaction: PlaidTransaction) {

}

async function modifyTransaction(transaction: Partial<PlaidTransaction>)
