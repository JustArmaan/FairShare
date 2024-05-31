import { getDB } from './client';
import { users } from './schema/users';
import { transactions } from './schema/transaction';
import { memberType } from './schema/memberType';
import { categories } from './schema/category';
import { v4 as uuid } from 'uuid';
import { items } from './schema/items';
import { accountType } from './schema/accountType';
import { groupTransferStatus } from './schema/groupTransferStatus';
import { splitType } from './schema/splitType';

let db = getDB();

interface InsertedIdResult {
  insertedId: string;
}

const newCategoriesList = [
  {
    name: 'INCOME',
    displayName: 'Income',
    icon: '/icons/dollar-sign.svg',
    color: 'bg-category-color-0',
  },
  {
    name: 'TRANSFER_IN',
    displayName: 'Transfer In',
    icon: '/icons/dollar-sign.svg',
    color: 'bg-category-color-1',
  },
  {
    name: 'TRANSFER_OUT',
    displayName: 'Transfer Out',
    icon: '/icons/dollar-sign.svg',
    color: 'bg-category-color-2',
  },
  {
    name: 'LOAN_PAYMENTS',
    displayName: 'Loan Payments',
    icon: '/icons/dollar-sign.svg',
    color: 'bg-category-color-3',
  },
  {
    name: 'BANK_FEES',
    displayName: 'Bank Fees',
    icon: '/icons/dollar-sign.svg',
    color: 'bg-category-color-4',
  },
  {
    name: 'ENTERTAINMENT',
    displayName: 'Entertainment',
    icon: '/icons/entertainment.svg',
    color: 'bg-category-color-5',
  },
  {
    name: 'FOOD_AND_DRINK',
    displayName: 'Food and Drink',
    icon: '/icons/local_dining.svg',
    color: 'bg-accent-red',
  },
  {
    name: 'GENERAL_MERCHANDISE',
    displayName: 'General Merchandise',
    icon: '/icons/shopping-bag.svg',
    color: 'bg-accent-purple',
  },
  {
    name: 'HOME_IMPROVEMENT',
    displayName: 'Home Improvement',
    icon: '/icons/rent.svg',
    color: 'bg-category-color-8',
  },
  {
    name: 'RENT_AND_UTILITIES',
    displayName: 'Rent and Utilities',
    icon: '/icons/electricity.svg',
    color: 'bg-accent-red',
  },
  {
    name: 'TRAVEL',
    displayName: 'Travel',
    icon: '/icons/local_gas_station.svg',
    color: 'bg-category-color-10',
  },
  {
    name: 'TRANSPORTATION',
    displayName: 'Transportation',
    icon: '/icons/local_gas_station.svg',
    color: 'bg-category-color-11',
  },
  {
    name: 'GOVERNMENT_AND_NON_PROFIT',
    displayName: 'Government and Non Profit',
    icon: '/icons/government.svg',
    color: 'bg-accent-green',
  },
  {
    name: 'GENERAL_SERVICES',
    displayName: 'General Services',
    icon: '/icons/services.svg',
    color: 'bg-accent-yellow',
  },
  {
    name: 'PERSONAL_CARE',
    displayName: 'Personal Care',
    icon: '/icons/internet.svg',
    color: 'bg-category-color-14',
  },
  {
    name: 'MEDICAL',
    displayName: 'Medical',
    icon: '/icons/pharmacy.svg',
    color: 'bg-category-color-15',
  },
  {
    name: 'OTHER',
    displayName: 'Other',
    icon: '/icons/plus.svg',
    color: 'bg-category-color-16',
  },
];

const memberTypes = [
  { type: 'Owner' },
  { type: 'Invited' },
  { type: 'Member' },
  { type: 'Admin' },
];

const accountTypes = [
  { type: 'credit' },
  { type: 'depository' },
  { type: 'loan' },
  { type: 'other' },
];

const groupTransferStatusValues = [
  // keep parity with the interact vopay api status strings
  { status: 'pending' },
  { status: 'requested' },
  { status: 'failed' },
  { status: 'cancelled' },
  { status: 'successful' },
  { status: 'not-initiated' },
  { status: 'complete' },
] as const;

const splitTypes = [
  { type: 'percentage' },
  { type: 'amount' },
  { type: 'equal' },
];

console.log('Starting deletions');
(await db.select().from(categories)).length > 0 &&
  (await db.delete(categories));
console.log('Deleted all records from the categories table.');

(await db.select().from(transactions)).length > 0 &&
  (await db.delete(transactions));
console.log('Deleted all records from the transactions table.');

(await db.select().from(users)).length > 0 && (await db.delete(users));
console.log('Deleted all records from the users table.');

(await db.select().from(memberType)).length > 0 &&
  (await db.delete(memberType));
console.log('Deleted all records from the memberTypes table.');

(await db.select().from(groupTransferStatus)).length > 0 &&
  (await db.delete(groupTransferStatus));
console.log('Deleted all records from the groupTransferStatus table.');

(await db.select().from(items)).length > 0 && (await db.delete(items));
console.log('Deleted all items');

(await db.select().from(splitType)).length > 0 && (await db.delete(splitType));

try {
  await db.transaction(async (trx) => {
    console.log('Starting the seeding transaction.');

    /*
     const userIds = [];
     const numberOfUsers = 30;
     for (let i = 0; i < numberOfUsers; i++) {
       const userName = faker.person.firstName();
       const userEmail = faker.internet.email({ firstName: userName });
       console.log(`Inserting user with name: ${userName}`);
       const result = (await trx
         .insert(users)
         .values({ name: userName, email: userEmail })
         .returning({ insertedId: users.id })) as InsertedIdResult[];
       userIds.push(result[0].insertedId);
       console.log(`Inserted user with name: ${userName}`);
     }
     */

    const categoryIds = [];
    for (const cat of newCategoriesList) {
      const results = (await trx
        .insert(categories)
        .values({ ...cat, id: uuid() })
        .returning({ insertedId: categories.id })) as InsertedIdResult[];
      const result = results[0];
      categoryIds.push(result.insertedId);
    }
    console.log(`Inserted categories`);

    for (const type of accountTypes) {
      const typeId = uuid();
      await trx.insert(accountType).values({
        id: typeId,
        type: type.type,
      });
    }
    for (const type of memberTypes) {
      const typeId = uuid();
      await trx.insert(memberType).values({
        id: typeId,
        type: type.type,
      });
      console.log(`Inserted member type: ${type.type} with ID: ${typeId}`);
    }
    for (const status of groupTransferStatusValues) {
      const statusId = uuid();
      await trx.insert(groupTransferStatus).values({
        id: statusId,
        status: status.status,
      });
    }

    for (const splitTyped of splitTypes) {
      await trx.insert(splitType).values({
        id: uuid(),
        type: splitTyped.type,
      });
    }
    console.log('Seeding transaction complete.');
  });
} catch (error) {
  console.error('Seeding transaction failed:', error);
}
