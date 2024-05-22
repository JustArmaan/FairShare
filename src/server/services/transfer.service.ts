import { getDB } from '../database/client';
import { transactionsToGroups } from '../database/schema/transactionsToGroups';
import { eq, and } from 'drizzle-orm';
import { groupTransactionState } from '../database/schema/groupTransactionState';
import { splitType } from '../database/schema/splitType';

const db = getDB();

export const updateGroupTransactionSplitType = async (
  groupId: string,
  splitTypeId: string,
  transactionId: string
) => {
  try {
    const groupTransactionStateId = await getGroupTransactionStateId(
      transactionId,
      groupId
    );

    if (!groupTransactionStateId) {
      return;
    }

    await db
      .update(groupTransactionState)
      .set({ splitTypeId: splitTypeId })
      .where(eq(groupTransactionState.id, groupTransactionStateId));
  } catch (e) {
    console.error(e, 'at updateGroupTransactionSplitType');
  }
};

const getGroupTransactionStateId = async (
  transactionId: string,
  groupId: string
) => {
  try {
    const result = await db
      .select({ groupTransactionStateId: groupTransactionState.id })
      .from(transactionsToGroups)
      .where(
        and(
          eq(transactionsToGroups.transactionId, transactionId),
          eq(transactionsToGroups.groupsId, groupId)
        )
      )
      .innerJoin(
        groupTransactionState,
        eq(transactionsToGroups.id, groupTransactionState.groupTransactionId)
      );
    return result[0].groupTransactionStateId[0];
  } catch (e) {
    console.error(e, 'at getGroupTransactionStateId');
  }
};

export function getSplitTypeById(splitTypeId: string) {
  try {
    const splitTypeResult = db
      .select()
      .from(splitType)
      .where(eq(splitType.id, splitTypeId));
    return splitTypeResult;
  } catch (e) {
    console.error(e, 'at getSplitTypeById');
  }
}
