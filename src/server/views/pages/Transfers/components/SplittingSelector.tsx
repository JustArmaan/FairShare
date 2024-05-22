import {
  type GroupTransactionWithSplitType,
  type GroupWithMembers,
} from '../../../../services/group.service';
import type { OwedTransactionWithMember } from '../../../../services/owed.service';
import { ProfileIcon } from '../../../components/ProfileIcon';

export const SplittingSelector = ({
  transaction,
  groupWithMembers,
  owedInfo,
  splitType,
}: {
  transaction: GroupTransactionWithSplitType;
  groupWithMembers: GroupWithMembers;
  owedInfo: OwedTransactionWithMember;
  splitType: string;
}) => {
  if (splitType === 'equal') {
    return (
      <div class='w-full mt-4'>
        {groupWithMembers.members.map((member) => {
          const memberOwed = owedInfo.find(
            (owed) => owed.user.id === member.id
          );
          const totalDue = memberOwed ? memberOwed.amount.toFixed(2) : 0;

          return (
            <div class='flex items-center justify-between p-3 bg-primary-black rounded-lg w-full'>
              <div class='flex items-center space-x-3'>
                <ProfileIcon user={member} />
                <p class='text-font-off-white text-xl'>{member.firstName}</p>
              </div>
              <div>
                <p class='text-accent-blue text-lg'>Total Due: ${totalDue}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  //   if (transaction.type === 'percentage') {
  //     return (
  //     );
  //   }

  //     if (transaction.type === 'amount') {
  //         return (
  //         );
  //     }

  return null;
};
