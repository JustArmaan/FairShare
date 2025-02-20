import { getDB } from "./client";
import { users } from "./schema/users";
import { transactions } from "./schema/transaction";
import { memberType } from "./schema/memberType";
import { categories } from "./schema/category";
import { v4 as uuid } from "uuid";
import { items } from "./schema/items";
import { accountType } from "./schema/accountType";
import { splitType } from "./schema/splitType";
import { groups } from "./schema/group";
import { accounts } from "./schema/accounts";
import { notifications } from "./schema/notifications";
import { groupInvite } from "./schema/groupInvite";
import { genericNotification } from "./schema/genericNotification";
import { groupNotification } from "./schema/groupNotification";
import { notificationType } from "./schema/notificationType";
import { groupTransactionToUsersToGroupsStatus } from "./schema/groupTransactionToUsersToGroupStatus";

const db = getDB();

interface InsertedIdResult {
  insertedId: string;
}

const owedStatus = ["notSent", "awaitingConfirmation", "confirmed"] as const;

export type OwedStatus = typeof owedStatus;

const newCategoriesList = [
  {
    name: "INCOME",
    displayName: "Income",
    icon: "/categoryIcons/income.svg",
    color: "bg-category-color-12",
  },
  {
    name: "TRANSFER_IN",
    displayName: "Transfer In",
    icon: "/categoryIcons/transfer_in.svg",
    color: "bg-category-color-6",
  },
  {
    name: "TRANSFER_OUT",
    displayName: "Transfer Out",
    icon: "/categoryIcons/transfer_out.svg",
    color: "bg-category-color-5",
  },
  {
    name: "LOAN_PAYMENTS",
    displayName: "Loan Payments",
    icon: "/categoryIcons/loan_payments.svg",
    color: "bg-category-color-16",
  },
  {
    name: "BANK_FEES",
    displayName: "Bank Fees",
    icon: "/categoryIcons/bank_fees.svg",
    color: "bg-category-color-15",
  },
  {
    name: "ENTERTAINMENT",
    displayName: "Entertainment",
    icon: "/categoryIcons/entertainment.svg",
    color: "bg-category-color-4",
  },
  {
    name: "FOOD_AND_DRINK",
    displayName: "Food and Drink",
    icon: "/categoryIcons/food_and_drink.svg",
    color: "bg-category-color-0",
  },
  {
    name: "GENERAL_MERCHANDISE",
    displayName: "General Merchandise",
    icon: "/categoryIcons/general_merchandise.svg",
    color: "bg-category-color-2",
  },
  {
    name: "HOME_IMPROVEMENT",
    displayName: "Home Improvement",
    icon: "/categoryIcons/home_improvement.svg",
    color: "bg-category-color-13",
  },
  {
    name: "RENT_AND_UTILITIES",
    displayName: "Rent and Utilities",
    icon: "/categoryIcons/rent_and_utilities.svg",
    color: "bg-category-color-10",
  },
  {
    name: "TRAVEL",
    displayName: "Travel",
    icon: "/categoryIcons/travel.svg",
    color: "bg-category-color-9",
  },
  {
    name: "TRANSPORTATION",
    displayName: "Transportation",
    icon: "/categoryIcons/transportation.svg",
    color: "bg-category-color-3",
  },
  {
    name: "GOVERNMENT_AND_NON_PROFIT",
    displayName: "Government and Non Profit",
    icon: "/categoryIcons/government_and_non_profit.svg",
    color: "bg-category-color-14",
  },
  {
    name: "GENERAL_SERVICES",
    displayName: "General Services",
    icon: "/categoryIcons/general_services.svg",
    color: "bg-category-color-8",
  },
  {
    name: "PERSONAL_CARE",
    displayName: "Personal Care",
    icon: "/categoryIcons/personal_care.svg",
    color: "bg-category-color-7",
  },
  {
    name: "MEDICAL",
    displayName: "Medical",
    icon: "/categoryIcons/medical.svg",
    color: "bg-category-color-11",
  },
  {
    name: "OTHER",
    displayName: "Other",
    icon: "/categoryIcons/other.svg",
    color: "bg-category-color-1",
  },
];

const memberTypes = [
  { type: "Owner" },
  { type: "Invited" },
  { type: "Member" },
  { type: "Admin" },
];

const accountTypes = [
  { type: "credit" },
  { type: "depository" },
  { type: "loan" },
  { type: "other" },
  { type: "cash" },
];

const notificationTypes = [
  { type: "generic" },
  { type: "group" },
  { type: "invite" },
];

const splitTypes = [
  { type: "percentage" },
  { type: "amount" },
  { type: "equal" },
];

console.log("Starting deletions");
(await db.select().from(categories)).length > 0 &&
  (await db.delete(categories));
console.log("Deleted all records from the categories table.");
(await db.select().from(transactions)).length > 0 &&
  (await db.delete(transactions));
console.log("Deleted all records from the transactions table.");
(await db.select().from(users)).length > 0 && (await db.delete(users));
console.log("Deleted all records from the users table.");
(await db.select().from(memberType)).length > 0 &&
  (await db.delete(memberType));
console.log("Deleted all records from the memberTypes table.");
console.log("Deleted all records from the groupTransferStatus table.");
(await db.select().from(items)).length > 0 && (await db.delete(items));
console.log("Deleted all items");
(await db.select().from(splitType)).length > 0 && (await db.delete(splitType));
(await db.select().from(groups)).length > 0 && (await db.delete(groups));
(await db.select().from(accounts)).length > 0 && (await db.delete(accounts));
(await db.select().from(groupTransactionToUsersToGroupsStatus)).length > 0 &&
  (await db.delete(groupTransactionToUsersToGroupsStatus));
(await db.select().from(accountType)).length > 0 &&
  (await db.delete(accountType));
(await db.select().from(notifications)).length > 0 &&
  (await db.delete(notifications));
(await db.select().from(groupInvite)).length > 0 &&
  (await db.delete(groupInvite));
(await db.select().from(genericNotification)).length > 0 &&
  (await db.delete(genericNotification));
(await db.select().from(groupNotification)).length > 0 &&
  (await db.delete(groupNotification));
(await db.select().from(notificationType)).length > 0 &&
  (await db.delete(notificationType));

try {
  await db.transaction(async (trx) => {
    console.log("Starting the seeding transaction.");

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

    for (const status of owedStatus) {
      const statusId = uuid();
      await trx.insert(groupTransactionToUsersToGroupsStatus).values({
        id: statusId,
        status,
      });
    }

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
    for (const type of notificationTypes) {
      const typeId = uuid();
      await trx.insert(notificationType).values({
        id: typeId,
        type: type.type,
      });
    }

    for (const splitTyped of splitTypes) {
      await trx.insert(splitType).values({
        id: uuid(),
        type: splitTyped.type,
      });
    }
    console.log("Seeding transaction complete.");
  });
} catch (error) {
  console.error("Seeding transaction failed:", error);
}
