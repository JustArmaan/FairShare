import type { UserSchema } from '../../../../interface/types';
import { getAccountWithTransactions } from '../../../../services/plaid.service';
import type { ExtractFunctionReturnType } from '../../../../services/user.service';
import { Transaction } from '../../transactions/components/Transaction';

const iconColors = [
  'bg-accent-red',
  'bg-accent-blue',
  'bg-accent-green',
  'bg-accent-yellow',
  'bg-accent-purple',
];

export const AddTransaction = (props: {
  currentUser: UserSchema;
  groupId: string;
  accounts: ExtractFunctionReturnType<typeof getAccountWithTransactions>[];
  selectedAccountId: string;
  groupTransactionIds: string[];
}) => {
  function isChecked(transactionId: string, groupTransactionIds: string[]) {
    return groupTransactionIds.includes(transactionId);
  }
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex justify-start w-fit items-center mb-1">
        <a
          hx-get="/groups/page"
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          class="text-font-off-white text-4xl cursor-pointer"
        >
          <img
            src="/icons/arrow_back_ios.svg"
            alt="back arrow icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          />
        </a>
      </div>
      <div
        id="modal-bg"
        class="fixed inset-0 bg-primary-black bg-opacity-40 z-10 hidden"
      ></div>
      <div class="flex justify-start p-4">
        <div class="hidden rotate-90"></div>
        <div
          hx-get={`/groups/accountPicker/${props.selectedAccountId}/${props.groupId}`}
          hx-target=".account-selector-form"
          hx-swap="innerHTML"
          class="mb-2 flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer"
        >
          <p class="text-font-off-white mr-3 text-xl">Change Account</p>
          <img
            class="h-3"
            src="/images/right-triangle.svg"
            alt="triangle icon"
            id="account-select-image"
          />
        </div>
      </div>
      {/* <div id="transactionsContainer" class="mt-2">
        {props.accounts
          .find((account) => account.id === props.selectedAccountId)!
          .transactions.map((transaction, categoryIndex) => (
            <Transaction
              transaction={transaction}
              tailwindColorClass={iconColors[categoryIndex % iconColors.length]}
              route="AddTransaction"
              checked={isChecked(transaction.id, props.groupTransactionIds)}
              groupId={props.groupId}
            />
          ))}
          
      </div> */}
      <div
        id="transactionsContainer"
        class="mt-2"
        hx-get={`/groups/transactionList/${props.selectedAccountId}/${props.groupId}`}
        hx-swap="innerHTML"
        hx-trigger="load"
      ></div>
      <div class="account-selector-form" />
    </div>
  );
};

export default AddTransaction;
