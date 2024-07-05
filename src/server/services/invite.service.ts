import { eq } from "drizzle-orm";
import { getDB } from "../database/client";
import { inviteShareLink } from "../database/schema/inviteLink";
import { v4 as uuidv4 } from "uuid";

const db = getDB();

export async function getInviteLinkById(id: string) {
  const result = await db
    .select()
    .from(inviteShareLink)
    .where(eq(inviteShareLink.id, id));

  return result[0];
}

export async function getInviteLinkByUsersToGroupsId(usersToGroupsId: string) {
  const result = await db
    .select()
    .from(inviteShareLink)
    .where(eq(inviteShareLink.usersToGroupsId, usersToGroupsId));

  return result[0];
}

export async function createInviteLink(usersToGroupsId: string) {
  const result = await db
    .insert(inviteShareLink)
    .values({
      id: uuidv4(),
      usersToGroupsId,
    })
    .returning();

  return result[0];
}
