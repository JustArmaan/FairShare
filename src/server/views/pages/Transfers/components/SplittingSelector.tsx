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
  if (splitType === 'percentage') {
    return (
      <div class='w-full mt-4'>
        {groupWithMembers.members.map((member) => {
          const memberOwed = owedInfo.find(
            (owed) => owed.user.id === member.id
          );
          return (
            <div class='flex items-center justify-between p-3 bg-primary-black rounded-lg w-full mb-4'>
              <div class='flex flex-col items-center space-x-3 justify-center'>
                <div data-total-percent={transaction.transaction.amount}></div>
                <ProfileIcon user={member} />
                <p class='text-font-off-white text-xl mt-2'>
                  {member.firstName}
                </p>
              </div>
              <div class='flex flex-col items-end font-light'>
                <div class='flex items-center mb-2'>
                  <p class='text-font-off-white text-lg'>Enter a percent: </p>
                  <input
                    max='100'
                    min='0'
                    name='percent-input'
                    type='number'
                    class='percent-input cursor-default w-24 px-4 py-1.5 bg-accent-blue rounded-lg h-fit ml-2 text-font-off-white'
                  />
                  <input type='hidden' value={member.id} name='memberId' />
                </div>
                <div class='flex items-center'>
                  <p class='text-font-off-white text-lg'>Total Due: </p>
                  <div class='percent-total cursor-default text-center w-24 px-4 py-1.5 bg-accent-blue rounded-lg h-fit ml-2 text-font-off-white'>
                    $0.00
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (splitType === 'equal') {
    return (
      <div class='w-full mt-4'>
        {groupWithMembers.members.map((member) => {
          const memberOwed = owedInfo.find(
            (owed) => owed.user.id === member.id
          );
          const totalDue = memberOwed ? memberOwed.amount.toFixed(2) : "0.00";
          console.log(totalDue);
          return (
            <div class='flex items-center justify-between p-3 bg-primary-black rounded-lg w-full mb-4'>
              <div class='flex flex-col items-center space-x-3 justify-center'>
                <ProfileIcon user={member} />
                <p class='text-font-off-white text-xl mt-2'>
                  {member.firstName}
                </p>
              </div>
              <div class='flex flex-col items-end font-light'>
                <div class='flex items-center justify-center'>
                  <p class='text-font-off-white text-lg'>Total Due: </p>
                  <div class='amount-input cursor-default text-center w-24 px-4 py-1.5 bg-accent-blue rounded-lg h-fit ml-2 text-font-off-white'>
                    ${totalDue}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (splitType === 'amount') {
    return (
      <div class='w-full mt-4'>
        {groupWithMembers.members.map((member) => {
          const memberOwed = owedInfo.find(
            (owed) => owed.user.id === member.id
          );
          return (
            <div class='flex items-center justify-between p-3 bg-primary-black rounded-lg w-full mb-4'>
              <div class='flex flex-col items-center space-x-3 justify-center'>
                <div data-total-amount={transaction.transaction.amount}></div>
                <ProfileIcon user={member} />
                <p class='text-font-off-white text-xl mt-2'>
                  {member.firstName}
                </p>
              </div>
              <div class='flex flex-col items-end font-light'>
                <div class='flex items-center mb-2'>
                  <p class='text-font-off-white text-lg'>Enter an amount: </p>
                  <input
                    max={transaction.transaction.amount.toFixed(2)}
                    min='0'
                    name='amount-input'
                    type='number'
                    class='amount-input cursor-default w-24 px-4 py-1.5 bg-accent-blue rounded-lg h-fit ml-2 text-font-off-white'
                  />
                  <input type='hidden' value={member.id} name='memberId' />
                </div>
                <div class='flex items-center'>
                  <p class='text-font-off-white text-lg'>Total Due: </p>
                  <div class='amount-total cursor-default text-center w-24 px-4 py-1.5 bg-accent-blue rounded-lg h-fit ml-2 text-font-off-white'>
                    $0.00
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
