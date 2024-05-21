import { and, eq } from "drizzle-orm";
import { getDB } from "../database/client";
import { groupTransactionToUsersToGroups } from "../database/schema/groupTransactionToUsersToGroups";
import { transactionState } from "../database/schema/groupTransactionState";
import { transactionsToGroups } from "../database/schema/transactionsToGroups";
import { usersToGroups } from "../database/schema/usersToGroups";
import type { ExtractFunctionReturnType } from "./user.service";
import { v4 as uuid } from "uuid";

type Owed = ExtractFunctionReturnType<typeof getOwed>;

const db = getDB();

export async function createOwed(group: Omit<Owed, "id">) {
  try {
    await db
      .insert(groupTransactionToUsersToGroups)
      .values({ ...group, id: uuid() });
  } catch (e) {
    console.log(e, "at createOwed");
  }
}

async function getOwed(id: string) {
  try {
    const results = await db
      .select()
      .from(groupTransactionToUsersToGroups)
      .where(eq(groupTransactionToUsersToGroups.id, id));
    return results[0];
  } catch (e) {
    return null;
  }
}

export async function getAllOwedForGroupTransaction(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select()
      .from(transactionsToGroups)
      .innerJoin(
        transactionState,
        eq(transactionsToGroups.id, transactionState.groupTransactionId)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          transactionState.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
        )
      )
      .innerJoin(
        usersToGroups,
        eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
      )
      .where(
        and(
          eq(transactionsToGroups.transactionId, transactionId),
          eq(transactionsToGroups.groupsId, groupId)
        )
      );

    return [
      ...results.map((result) => ({
        amount: result.groupTransactionToUsersToGroups.amount,
        userId: result.usersToGroups.userId,
      })),
    ];
  } catch (e) {
    console.error(e, "at getOwed");
    return null;
  }
}

export async function getAllOwedForGroupTransactionWithTransactionId(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select()
      .from(transactionsToGroups)
      .innerJoin(
        transactionState,
        eq(transactionsToGroups.id, transactionState.groupTransactionId)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          transactionState.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
        )
      )
      .innerJoin(
        usersToGroups,
        eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
      )
      .where(
        and(
          eq(transactionsToGroups.transactionId, transactionId),
          eq(transactionsToGroups.groupsId, groupId)
        )
      );

    return [
      ...results.map((result) => ({
        amount: result.groupTransactionToUsersToGroups.amount,
        userId: result.usersToGroups.userId,
        transactionId: result.transactionsToGroups.transactionId,
      })),
    ];
  } catch (e) {
    console.error(e, "at getOwed");
    return null;
  }
}
