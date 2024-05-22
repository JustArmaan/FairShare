import type {
  GroupTransactionWithSplitType,
  GroupWithMembers,
} from '../../../../services/group.service';
import type { OwedTransactionWithMember } from '../../../../services/owed.service';
import { SplittingSelector } from './SplittingSelector';

export const FullSelector = ({
  transactionId,
  groupId,
  transaction,
  groupWithMembers,
  owedInfo,
  splitType,
}: {
  transactionId: string;
  groupId: string;
  transaction: GroupTransactionWithSplitType;
  groupWithMembers: GroupWithMembers;
  owedInfo: OwedTransactionWithMember;
  splitType?: string;
}) => {
  return (
    <div
      id={`full-selector-${splitType ? splitType : transaction.type}`}
      class='animate-fade-in '
    >
      <div
        id='split-swapper'
        hx-get={`/transfer/splitTransaction/splitOptions/closed/${transactionId}/${groupId}/${
          splitType ? splitType : transaction.type
        }`}
        hx-trigger='load'
        hx-target='#split-swapper'
        hx-swap='innerHTML'
        class='flex py-2 hover:opacity-80 pointer-cursor justify-between text-left text-font-off-white rounded-lg mt-4 w-full animate-fade-in'
      ></div>
      <SplittingSelector
        splitType={splitType ? splitType : transaction.type}
        transaction={transaction}
        groupWithMembers={groupWithMembers}
        owedInfo={owedInfo}
      />
    </div>
  );
};
