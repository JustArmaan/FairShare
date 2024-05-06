import { getDB } from "../database/client";
import { groups } from "../database/schema/group";
import { eq } from "drizzle-orm";

let db = getDB();

export async function getGroup(groupId: string) {
  try {
    const group = await db.select().from(groups).where(eq(groups.id, groupId));
    if (group) return group[0];
    return null;
  } catch (error) {
    console.error(error);
  }
}

export type GroupSchema = Awaited<ReturnType<typeof getGroup>>;
