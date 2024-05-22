import {
  type GroupTransactionWithSplitType,
  type GroupWithMembers,
} from '../../../../services/group.service';

export const SplittingSelector = ({
  transaction,
  groupWithMembers,
}: {
  transaction: GroupTransactionWithSplitType;
  groupWithMembers: GroupWithMembers;
}) => {
  if (transaction.type === 'equal') {
    return (
      <div>
        {groupWithMembers.members.map((member, index) => (
          <div class='flex justify-between items-center w-full'>
            <p class='text-font-off-white text-xl'>{member.firstName}</p>
            <input
              type='text'
              class='bg-primary-black text-font-off-white text-xl w-24 h-8 rounded-lg'
              placeholder='0.00'
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
};
