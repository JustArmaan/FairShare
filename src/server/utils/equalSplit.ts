import { updateOwedForGroupTransaction } from "../services/group.service";
import { type UserGroupSchema } from "../routes/groups/groupRouter"; 
import { type GroupWithEqualSplitTypeTransactionsAndMembers } from "../services/group.service";
import { createGroupNotificationWithWebsocket } from "./createNotification";

export async function splitEqualTransactions(
  equalSplitGroupTransactions: GroupWithEqualSplitTypeTransactionsAndMembers,
  groupId: string,
  groupWithMembers: UserGroupSchema
) {
  for (const transaction of equalSplitGroupTransactions) {
    const equalSplitAmount =
      transaction.transaction.amount / groupWithMembers.members.length;
    groupWithMembers.members.forEach(async (member) => {
      if (member.id !== transaction.transactionOwner.id) {
        const newMemberUpdate = await updateOwedForGroupTransaction(
          groupId,
          member.id,
          transaction.transaction.id,
          equalSplitAmount * -1
        );
        await createGroupNotificationWithWebsocket(
          groupId,
          "groupInvite",
          member.id,
          `You owe ${
            transaction.transactionOwner.firstName
          } $${equalSplitAmount.toFixed(2)}`
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
