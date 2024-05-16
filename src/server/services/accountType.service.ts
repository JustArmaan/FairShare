import { eq } from "drizzle-orm";
import { getDB } from "../database/client";
import { accountType } from "../database/schema/accountType";

const db = getDB();

export async function getAccountTypeIdByName(name: string) {
  try {
    const results = await db
      .select({ id: accountType.id })
      .from(accountType)
      .where(eq(accountType.type, name));

    return results[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAccountTypeById(id: string) {
  try {
    const results = await db
      .select({ type: accountType.type })
      .from(accountType)
      .where(eq(accountType.id, id));

    return results[0].type;
  } catch (error) {
    console.error(error);
    return null;
  }
}
