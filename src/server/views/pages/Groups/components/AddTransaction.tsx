import type { UserSchema } from "../../../../interface/types";
import { getAccountWithTransactions } from "../../../../services/plaid.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";

export const AddTransaction = (props: {
  currentUser: UserSchema;
  groupId: string;
  accounts: ExtractFunctionReturnType<typeof getAccountWithTransactions>[];
  selectedAccountId: string;
  groupTransactionIds: string[];
}) => {
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex justify-start w-fit items-center mb-1">
        <a
          hx-get={`/groups/view/${props.groupId}`}
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
          hx-get={`/groups/accountPicker/${props.accounts.find((account) => account.id === props.selectedAccountId)!.itemId}/${props.selectedAccountId}/${props.groupId}`}
          hx-target=".account-selector-form"
          hx-swap="innerHTML"
          class="flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer"
        >
          <p class="text-font-off-white mr-3 text-xl">Change Account</p>
          <img
            class="h-3"
            src="/images/right-triangle.svg"
            alt="triangle icon"
          />
        </div>
      </div>
      <div
        id="errorContainer"
        class="text-accent-red bg-opacity-10 border border-accent-red p-4 rounded shadow hidden text-center mt-4"
      ></div>
      <div
        id="transactionsContainer"
        hx-get={`/groups/transactionList/${props.selectedAccountId}/${props.groupId}`}
        hx-swap="innerHTML"
        hx-trigger="load"
      ></div>
      <div class="account-selector-form" />
      <div class="mb-24"></div>
    </div>
  );
};

export default AddTransaction;
