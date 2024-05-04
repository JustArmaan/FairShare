import { faker } from "@faker-js/faker";
import { getDB } from "./client";
import { categories } from "./schema/category";
import { createTransaction } from "../services/transaction.service";

const db = getDB();

export async function seedFakeTransactions(
  userId: string,
  numberOfTransactions: number
) {
  try {
    const allCategoryIds = await db
      .select({ id: categories.id })
      .from(categories);

    for (let i = 0; i < numberOfTransactions; i++) {
      const transactionData = {
        userId: userId,
        categoryId: faker.helpers.arrayElement(allCategoryIds),
        company: faker.company.name(),
        amount: parseFloat(faker.finance.amount({ min: 1, max: 200, dec: 2 })),
        timestamp: faker.date
          .recent({ days: 80, refDate: new Date() })
          .toISOString(),
        address: faker.location.streetAddress({ useFullAddress: true }),
      };

      await createTransaction(
        transactionData.userId,
        transactionData.categoryId.id,
        transactionData.company,
        transactionData.amount,
        transactionData.timestamp,
        transactionData.address
      );

      console.log("seeding complette");
    }
  } catch (error) {
    console.error("Seeding transactions failed:", error);
  }
}
