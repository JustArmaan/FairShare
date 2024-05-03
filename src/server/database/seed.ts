import { faker } from "@faker-js/faker";
import { getDB } from "./client";
import { users } from "./schema/users";
import { transactions } from "./schema/transaction";
import { categories } from "./schema/category";

let db = getDB();

interface InsertedIdResult {
  insertedId: number;
}

const categoriesList = [
  { name: "Groceries", icon: "./icons/groceries.svg" },
  { name: "Rent", icon: "./icons/rent.svg" },
  { name: "Phone", icon: "./icons/internet.svg" },
  { name: "Internet", icon: "./icons/internet.svg" },
  { name: "Gas", icon: "./icons/local_gas_station.svg" },
  { name: "Car Maintenance", icon: "./icons/car-maintenance.svg" },
  { name: "Entertainment", icon: "./icons/entertainment.svg" },
  { name: "Health", icon: "./icons/pharmacy.svg" },
  { name: "Electricity", icon: "./icons/electricity.svg" },
  { name: "Water", icon: "./icons/water.svg" },
  { name: "Gas", icon: "./icons/gas.svg" },
  { name: "Shopping", icon: "./icons/shopping-bag.svg" },
  { name: "Education", icon: "./icons/education.svg" },
  { name: "School Supplies", icon: "./icons/school-supplies.svg" },
  { name: "Food", icon: "./icons/food.svg" },
  { name: "Eating Out", icon: "./icons/local_dining.svg" },
  { name: "Tickets", icon: "./icons/tickets.svg" },
  { name: "Dentist", icon: "./icons/dentist.svg" },
  { name: "Deposit", icon: "./icons/dollar-sign.svg" },
  { name: "Other", icon: "./icons/plus" },
];

await db.delete(transactions);
console.log("Deleted all records from the transactions table.");

await db.delete(categories);
console.log("Deleted all records from the categories table.");

await db.delete(users);
console.log("Deleted all records from the users table.");

try {
  await db.transaction(async (trx) => {
    console.log("Starting the seeding transaction.");

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

    const categoryIds = [];
    for (const cat of categoriesList) {
      const results = (await trx
        .insert(categories)
        .values(cat)
        .returning({ insertedId: categories.id })) as InsertedIdResult[];
      const result = results[0];
      categoryIds.push(result.insertedId);
      console.log(`Inserted category with ID: ${result.insertedId}`);
    }

    for (const userId of userIds) {
      const numTransactions = Math.floor(Math.random() * 25) + 1;
      for (let i = 0; i < numTransactions; i++) {
        await trx.insert(transactions).values({
          userId: userId,
          categoryId: faker.helpers.arrayElement(categoryIds),
          company: faker.company.name(),
          amount: parseFloat(
            faker.finance.amount({ min: 100, max: 2000, dec: 2 })
          ),
          timestamp: faker.date.recent().toISOString(),
        });
      }
    }
    console.log("Seeding transaction complete.");
  });
} catch (error) {
  console.error("Seeding transaction failed:", error);
}
