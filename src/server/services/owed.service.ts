import { and, eq, ne } from 'drizzle-orm';
import { getDB } from '../database/client';
import { groupTransactionToUsersToGroups } from '../database/schema/groupTransactionToUsersToGroups';
import { transactionsToGroups } from '../database/schema/transactionsToGroups';
import { usersToGroups } from '../database/schema/usersToGroups';
import type { ExtractFunctionReturnType } from './user.service';
import { v4 as uuid } from 'uuid';
import { users } from '../database/schema/users';
import { groupTransactionState } from '../database/schema/groupTransactionState';
import { splitType } from '../database/schema/splitType';

type Owed = ExtractFunctionReturnType<typeof getOwed>;

const db = getDB();

async function getGroupTransactionState(id: string) {
  try {
    const result = await db
      .select()
      .from(groupTransactionState)
      .where(eq(groupTransactionState.id, id));
    return result[0];
  } catch (e) {
    console.log(e, 'at getGroupTransactionState');
  }
}

type GroupTransactionState = ExtractFunctionReturnType<
  typeof getGroupTransactionState
>;

export async function createGroupTransactionState(
  newGroupTransactionState: Omit<GroupTransactionState, 'id' | 'splitTypeId'>
) {
  try {
    const equalSplit = await db
      .select()
      .from(splitType)
      .where(eq(splitType.type, 'equal'));

    return await db
      .insert(groupTransactionState)
      .values({
        ...newGroupTransactionState,
        id: uuid(),
        splitTypeId: equalSplit[0].id,
      })
      .returning();
  } catch (e) {
    console.log(e, 'at getGroupTransactionState');
  }
}

export async function createOwed(group: Omit<Owed, 'id'>) {
  try {
    await db
      .insert(groupTransactionToUsersToGroups)
      .values({ ...group, id: uuid() });
  } catch (e) {
    console.log(e, 'at createOwed');
  }
}

export async function getOwed(id: string) {
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
      .select({
        user: users,
        amount: groupTransactionToUsersToGroups.amount,
        owedId: groupTransactionToUsersToGroups.id,
      })
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(groupTransactionState.groupTransactionId, transactionsToGroups.id)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          groupTransactionState.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
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

export async function getAllOwedForGroupTransactionNotPendingWithMemberInfo(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select({
        user: users,
        amount: groupTransactionToUsersToGroups.amount,
        owedId: groupTransactionToUsersToGroups.id,
      })
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(groupTransactionState.groupTransactionId, transactionsToGroups.id)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          groupTransactionState.id,
          groupTransactionToUsersToGroups.groupTransactionStateId
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
          eq(transactionsToGroups.groupsId, groupId),
          eq(groupTransactionState.pending, false)
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

export type OwedTransactionWithMember = NonNullable<
  Awaited<ReturnType<typeof getAllOwedForGroupTransactionWithMemberInfo>>
>;

export async function getAllOwedForGroupTransaction(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select()
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(transactionsToGroups.id, groupTransactionState.groupTransactionId)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          transactionsToGroups.id,
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
        groupTransactionState,
        eq(transactionsToGroups.id, groupTransactionState.groupTransactionId)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          groupTransactionState.id,
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
        pending: result.groupTransactionState.pending,
        groupTransactionToUsersToGroupsId:
          result.groupTransactionToUsersToGroups.id,
      })),
    ];
  } catch (e) {
    console.error(e, 'at getOwed');
    return null;
  }
}

export async function getAllOwedForGroupPendingTransactionWithTransactionId(
  groupId: string,
  transactionId: string
) {
  try {
    const results = await db
      .select()
      .from(transactionsToGroups)
      .innerJoin(
        groupTransactionState,
        eq(transactionsToGroups.id, groupTransactionState.groupTransactionId)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          groupTransactionState.id,
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
          eq(transactionsToGroups.groupsId, groupId),
          eq(groupTransactionState.pending, true)
        )
      );

    return [
      ...results.map((result) => ({
        amount: result.groupTransactionToUsersToGroups.amount,
        userId: result.usersToGroups.userId,
        transactionId: result.transactionsToGroups.transactionId,
        pending: result.groupTransactionState.pending,
        groupTransactionToUsersToGroupsId:
          result.groupTransactionToUsersToGroups.id,
      })),
    ];
  } catch (e) {
    console.error(e, 'at getOwed');
    return null;
  }
}
