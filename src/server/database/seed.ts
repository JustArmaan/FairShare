import { getDB } from "./client";
import { users } from "./schema/users";
import { transactions } from "./schema/transaction";
import { memberType } from "./schema/memberType";
import { categories } from "./schema/category";
import { v4 as uuid } from "uuid";

let db = getDB();

interface InsertedIdResult {
  insertedId: string;
}

const categoriesList = [
  { name: "Groceries", icon: "/icons/groceries.svg" },
  { name: "Rent", icon: "/icons/rent.svg" },
  { name: "Phone", icon: "/icons/internet.svg" },
  { name: "Internet", icon: "/icons/internet.svg" },
  { name: "Gas", icon: "/icons/local_gas_station.svg" },
  { name: "Car Maintenance", icon: "/icons/car-maintenance.svg" },
  { name: "Entertainment", icon: "/icons/entertainment.svg" },
  { name: "Health", icon: "/icons/pharmacy.svg" },
  { name: "Electricity", icon: "/icons/electricity.svg" },
  { name: "Water", icon: "/icons/water.svg" },
  { name: "Gas", icon: "/icons/gas.svg" },
  { name: "Shopping", icon: "/icons/shopping-bag.svg" },
  { name: "Education", icon: "/icons/education.svg" },
  { name: "School Supplies", icon: "/icons/school-supplies.svg" },
  { name: "Food", icon: "/icons/food.svg" },
  { name: "Eating Out", icon: "/icons/local_dining.svg" },
  { name: "Tickets", icon: "/icons/tickets.svg" },
  { name: "Dentist", icon: "/icons/dentist.svg" },
  { name: "Deposit", icon: "/icons/dollar-sign.svg" },
  { name: "Other", icon: "/icons/plus.svg" },
];

const memberTypes = [
  { type: "Owner" },
  { type: "Invited" },
  { type: "Member" },
  { type: "Admin" },
];

// await db.delete(transactions);
// console.log("Deleted all records from the transactions table.");

await db.delete(categories);
console.log("Deleted all records from the categories table.");

// await db.delete(users);
// console.log("Deleted all records from the users table.");

await db.delete(memberType);
console.log("Deleted all records from the memberTypes table.");

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
    for (const cat of categoriesList) {
      const results = (await trx
        .insert(categories)
        .values({ ...cat, id: uuid() })
        .returning({ insertedId: categories.id })) as InsertedIdResult[];
      const result = results[0];
      categoryIds.push(result.insertedId);
    }
    console.log(`Inserted categories`);

    for (const type of memberTypes) {
      const typeId = uuid();
      await trx.insert(memberType).values({
        id: typeId,
        type: type.type,
      });
      console.log(`Inserted member type: ${type.type} with ID: ${typeId}`);
    }
    console.log("Seeding transaction complete.");
  });
} catch (error) {
  console.error("Seeding transaction failed:", error);
}
