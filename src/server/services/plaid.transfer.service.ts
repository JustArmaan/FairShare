import { getDB } from '../database/client';
import { groupTransfer } from '../database/schema/groupTransfer';
import { eq } from 'drizzle-orm';
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
    console.error(error);
    return null;
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

    const sender = await findUser(transfer.senderUserId);
    const receiver = await findUser(transfer.receiverUserId);

    await createNotificationForUserInGroups(groupId, sender!.id, {
      message: `Your transfer to ${
        receiver!.firstName
      } has been started. Please check your email at ${
        sender!.email
      } to confirm.`,
      timestamp: new Date().toISOString(),
      route: null,
    });
    /*
    const groupTransaction = await getGroupTransactionToUserToGroupById(
      transfer.groupTransactionToUsersToGroupsId
    );

    await createNotificationForUserInGroups(
      groupId,
      receiver!.id,
      {
        message: `Your transfer to ${recieverName?.user.firstName} has been started`,
        timestamp: new Date().toISOString(),
        route: null,
      }
    );
    const notif2 = await createNotificationForUserInGroups(
      groupId,
      recieverName!.user.id,
      {
        message: `${senderName?.user.firstName} has sent you ${Math.abs(
          groupTransaction![0].amount
        ).toFixed(2)}`,
        timestamp: new Date().toISOString(),
        route: null,
      }
    );
    */
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
