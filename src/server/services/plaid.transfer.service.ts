import { getDB } from '../database/client';
import { groupTransfer } from '../database/schema/groupTransfer';
import { eq, or } from 'drizzle-orm';
import { findUser, type ExtractFunctionReturnType } from './user.service';
import { usersToGroups } from '../database/schema/usersToGroups';
import { groupTransactionToUsersToGroups } from '../database/schema/groupTransactionToUsersToGroups';
import { groupTransferStatus } from '../database/schema/groupTransferStatus';
import { v4 as uuidv4 } from 'uuid';
import { createNotificationForUserInGroups } from './notification.service';
import { getUserInfoFromAccount } from './account.service';
import { getGroupTransactionToUserToGroupById } from './group.service';
import { transactionsToGroups } from '../database/schema/transactionsToGroups';
import { groupTransactionState } from '../database/schema/groupTransactionState';
import { groups } from '../database/schema/group';

const db = getDB();

export async function getGroupTransferById(id: string) {
  try {
    const result = await db
      .select()
      .from(groupTransfer)
      .where(eq(groupTransfer.id, id));
    return result[0];
  } catch (error) {
    console.error(error, 'at getGroupTransferById');
    return null;
  }
}

export async function getGroupTransferByTransactionId(
  vopayTransactionId: string
) {
  try {
    const result = await db
      .select()
      .from(groupTransfer)
      .limit(1)
      .where(
        or(
          eq(groupTransfer.senderVopayTransferId, vopayTransactionId),
          eq(groupTransfer.receiverVopayTransferId, vopayTransactionId)
        )
      );
    return result[0];
  } catch (e) {
    console.error(e, 'at getGroupTransferByOwedId');
  }
}

export async function getGroupTransferByOwedId(owedId: string) {
  try {
    const result = await db
      .select({ id: groupTransfer.id })
      .from(groupTransfer)
      .limit(1)
      .where(eq(groupTransfer.groupTransactionToUsersToGroupsId, owedId));
    return result[0].id;
  } catch (e) {
    console.error(e, 'at getGroupTransferByOwedId');
  }
}

export type GroupTransfer = ExtractFunctionReturnType<
  typeof getGroupTransferById
>;

export async function createGroupTransfer(
  transfer: Omit<GroupTransfer, 'id'>,
  groupId: string
) {
  try {
    await db
      .insert(groupTransfer)
      .values({ id: uuidv4(), ...transfer } as GroupTransfer);
  } catch (err) {
    console.error(err);
  }
}

export async function getGroupTransfer(groupId: string) {
  try {
    const groupTransferResult = db
      .select()
      .from(usersToGroups)
      .where(eq(usersToGroups.groupId, groupId))
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
      )
      .innerJoin(
        groupTransfer,
        eq(
          groupTransfer.groupTransactionToUsersToGroupsId,
          groupTransactionToUsersToGroups.id
        )
      )
      .innerJoin(
        groupTransferStatus,
        eq(groupTransfer.groupTransferReceiverStatusId, groupTransferStatus.id)
      );

    return groupTransferResult;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTransferStatusById(id: string) {
  try {
    const result = await db
      .select()
      .from(groupTransferStatus)
      .where(eq(groupTransferStatus.id, id));
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserGroupTransaction(
  groupId: string,
  transactionId: string
) {
  try {
    const result = await db
      .select({
        groupTransactionToUsersToGroups: groupTransactionToUsersToGroups,
      })
      .from(groups)
      .where(eq(groups.id, groupId))
      .innerJoin(
        transactionsToGroups,
        eq(transactionsToGroups.transactionId, transactionId)
      )
      .innerJoin(
        groupTransactionState,
        eq(groupTransactionState.groupTransactionId, transactionsToGroups.id)
      )
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(
          groupTransactionToUsersToGroups.groupTransactionStateId,
          groupTransactionState.id
        )
      );
    return result[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAllTransferStatuses() {
  try {
    const result = await db.select().from(groupTransferStatus);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateGroupTransfer(
  id: string,
  newGroupTransfer: Omit<Partial<GroupTransfer>, 'id'>
) {
  try {
    await db
      .update(groupTransfer)
      .set(newGroupTransfer)
      .where(eq(groupTransfer.id, id));
  } catch (error) {
    console.error(error);
  }
}

export async function getSenderTransferStatus(senderUserId: string) {
  try {
    const result = await db
      .select()
      .from(groupTransfer)
      .where(eq(groupTransfer.senderUserId, senderUserId))
      .innerJoin(
        groupTransferStatus,
        eq(groupTransfer.groupTransferSenderStatusId, groupTransferStatus.id)
      );
    return result;
  } catch (error) {
    console.error(error);
  }
}
