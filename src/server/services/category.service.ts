import { eq } from 'drizzle-orm';
import { getDB } from '../database/client';
import { categories } from '../database/schema/category';

const db = getDB();

export async function getCategoryIdByName(name: string) {
  try {
    const results = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, name));

    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}
