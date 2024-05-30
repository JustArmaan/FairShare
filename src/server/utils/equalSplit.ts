import { updateOwedForGroupTransaction } from '../services/group.service';
import type { Transaction } from '../services/transaction.service';
import { createNotificationWithWebsocket } from './createNotification';
import { type UserGroupSchema } from '../routes/groupRouter';
import { type GroupWithEqualSplitTypeTransactionsAndMembers } from '../services/group.service';

export async function splitEqualTransactions(
  equalSplitGroupTransactions: GroupWithEqualSplitTypeTransactionsAndMembers,
  groupId: string,
  groupWithMembers: UserGroupSchema
) {
  for (const transaction of equalSplitGroupTransactions) {
    const equalSplitAmount =
      transaction.transaction.amount / groupWithMembers.members.length;
    console.log(equalSplitAmount, 'equalSplitAmount');
    groupWithMembers.members.forEach(async (member) => {
      if (member.id !== transaction.transactionOwner.id) {
        const newMemberUpdate = await updateOwedForGroupTransaction(
          groupId,
          member.id,
          transaction.transaction.id,
          equalSplitAmount * -1
        );
        await createNotificationWithWebsocket(
          groupId,
          `You owe ${
            transaction.transactionOwner.firstName
          } $${equalSplitAmount.toFixed(2)}`,
          member.id,
          'groupInvite'
        );
      } else if (member.id === transaction.transactionOwner.id) {
        await updateOwedForGroupTransaction(
          groupId,
          member.id,
          transaction.transaction.id,
          equalSplitAmount * (groupWithMembers.members.length - 1)
        );
      }
    });
  }
}
