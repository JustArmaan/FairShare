import { faker } from '@faker-js/faker';
import { getDB } from './client';
import { categories } from './schema/category';
import { transactions } from './schema/transaction';
import {
  type Transaction,
  createTransaction,
} from '../services/transaction.service';

const db = getDB();

export async function seedFakeTransactions(
  userId: string,
  numberOfTransactions: number
) {
  try {
    const allCategoryIds = await db
      .select({ id: categories.id })
      .from(categories);

    console.log('ttempting to seed transaction for ', userId);
    for (let i = 0; i < numberOfTransactions; i++) {
      const transactionData: Omit<Transaction, 'id'> = {
        userId: userId,
        categoryId: faker.helpers.arrayElement(allCategoryIds).id,
        company: faker.company.name(),
        amount: parseFloat(faker.finance.amount({ min: 1, max: 200, dec: 2 })),
        timestamp: faker.date
          .recent({ days: 80, refDate: new Date() })
          .toISOString(),
        address: faker.location.streetAddress({ useFullAddress: true }),
        latitude: faker.location.latitude({ min: 24, max: 60 }),
        longitude: faker.location.longitude({ min: -125, max: -66 }),
      };

      await createTransaction(transactionData);
    }
    console.log('seeding complete');
  } catch (error) {
    console.error('Seeding transactions failed:', error);
  }
}

// await db.delete(transactions);
// seedFakeTransactions("kp_1f69766a544b4f1e8ab2e4c795757fd9", 30);
