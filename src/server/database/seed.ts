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
  { name: "Groceries", icon: "🍎" },
  { name: "Rent", icon: "🏠" },
  { name: "Phone", icon: "☎️" },
  { name: "Internet", icon: "🌐" },
  { name: "Transportation", icon: "🚗" },
  { name: "Entertainment", icon: "🎮" },
  { name: "Health", icon: "🏥" },
  { name: "Insurance", icon: "🛡️" },
  { name: "Utilities", icon: "💡" },
  { name: "Clothing", icon: "👚" },
  { name: "Education", icon: "📚" },
  { name: "Gifts", icon: "🎁" },
  { name: "Travel", icon: "✈️" },
  { name: "Eating Out", icon: "🍽️" },
  { name: "Other", icon: "🔧" },
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
