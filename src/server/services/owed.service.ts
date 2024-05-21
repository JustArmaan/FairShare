import { and, eq } from 'drizzle-orm';
import { getDB } from '../database/client';
import { groupTransactionToUsersToGroups } from '../database/schema/groupTransactionToUsersToGroups';
import { transactionsToGroups } from '../database/schema/transactionsToGroups';
import { usersToGroups } from '../database/schema/usersToGroups';
import type { ExtractFunctionReturnType } from './user.service';
import { v4 as uuid } from 'uuid';
import { users } from '../database/schema/users';
import { groups } from '../database/schema/group';
import { groupTransactionState } from '../database/schema/groupTransactionState';

type Owed = ExtractFunctionReturnType<typeof getOwed>;

const db = getDB();

export async function createOwed(group: Omit<Owed, 'id'>) {
  try {
    await db
      .insert(groupTransactionToUsersToGroups)
      .values({ ...group, id: uuid() });
  } catch (e) {
    console.log(e, 'at createOwed');
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

export async function getGroupIdAndTransactionIdForOwed(owedId: string) {
  try {
    const results = await db
      .select({
        groupId: transactionsToGroups.groupsId,
        transactionId: transactionsToGroups.transactionId,
      })
      .from(groupTransactionToUsersToGroups)
      .innerJoin(
        groupTransactionState,
        eq(
          groupTransactionState.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
        )
      )
      .innerJoin(
        transactionsToGroups,
        eq(groupTransactionState.groupTransactionId, transactionsToGroups.id)
      )
      .where(eq(groupTransactionToUsersToGroups.id, owedId));
    return results[0];
  } catch (e) {
    console.error(e, 'at getGroupIdAndTransactionForOwed');
    return null;
  }
}

export async function getAllOwedForGroupTransactionWithMemberInfo(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select({ user: users, amount: groupTransactionToUsersToGroups.amount })
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          transactionsToGroups.id,
          groupTransactionToUsersToGroups.transactionsToGroupsId
        )
      )
      .innerJoin(
        usersToGroups,
        eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
      )
      .innerJoin(users, eq(usersToGroups.userId, users.id))
      .where(
        and(
          eq(transactionsToGroups.transactionId, transactionId),
          eq(transactionsToGroups.groupsId, groupId)
        )
      );

    return [
      ...results.map((result) => ({
        ...result,
      })),
    ];
  } catch (e) {
    console.error(e, 'at getOwed');
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
        groupTransactionToUsersToGroups,
        eq(
          transactionsToGroups.id,
          groupTransactionToUsersToGroups.transactionsToGroupsId
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
    console.error(e, 'at getOwed');
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
        groupTransactionToUsersToGroups,
        eq(
          transactionsToGroups.id,
          groupTransactionToUsersToGroups.transactionsToGroupsId
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
        groupTransactionToUsersToGroupsId:
          result.groupTransactionToUsersToGroups.id,
      })),
    ];
  } catch (e) {
    console.error(e, 'at getOwed');
    return null;
  }
}
