import { getDB } from '../database/client';
import { groupTransfer } from '../database/schema/groupTransfer';
import { eq } from 'drizzle-orm';
import { type ExtractFunctionReturnType } from './user.service';
import { usersToGroups } from '../database/schema/usersToGroups';
import { groupTransactionToUsersToGroups } from '../database/schema/groupTransactionToUsersToGroups';
import { groupTransferStatus } from '../database/schema/groupTransferStatus';
import { v4 as uuidv4 } from 'uuid';

const db = getDB();

export async function getGroupTransferById(id: string) {
  try {
    const result = await db
      .select()
      .from(groupTransfer)
      .where(eq(groupTransfer.id, id));
    return result[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export type GroupTransfer = ExtractFunctionReturnType<
  typeof getGroupTransferById
>;

export async function createGroupTransfer(transfer: Omit<GroupTransfer, 'id'>) {
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

export async function getUserGroupTransaction(groupId: string) {
  try {
    const result = await db
      .select()
      .from(usersToGroups)
      .where(eq(usersToGroups.groupId, groupId))
      .innerJoin(
        groupTransactionToUsersToGroups,
        eq(usersToGroups.id, groupTransactionToUsersToGroups.usersToGroupsId)
      );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTransferStatusByName(name: string) {
  try {
    const result = await db
      .select()
      .from(groupTransferStatus)
      .where(eq(groupTransferStatus.status, name));
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateGroupTransferToReceive(
  id: string,
  receiverStatusId: string,
  senderStatusId: string,
  senderCompletedTimestamp: string | null
) {
  try {
    await db
      .update(groupTransfer)
      .set({
        groupTransferReceiverStatusId: receiverStatusId,
        groupTransferSenderStatusId: senderStatusId,
        senderCompletedTimestamp: senderCompletedTimestamp,
      })
      .where(eq(groupTransfer.id, id));
  } catch (error) {
    console.error(error);
  }
}

export async function getSenderTransferStatus(senderAccountId: string) {
  try {
    const result = await db
      .select()
      .from(groupTransfer)
      .where(eq(groupTransfer.senderAccountId, senderAccountId))
      .innerJoin(
        groupTransferStatus,
        eq(groupTransfer.groupTransferSenderStatusId, groupTransferStatus.id)
      );
    return result;
  } catch (error) {
    console.error(error);
  }
}
