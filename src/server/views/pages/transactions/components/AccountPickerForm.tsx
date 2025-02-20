import type { AccountSchema } from "../../../../services/plaid.service";
import type { CashAccount } from "../../../../services/transaction.service";

export const AccountPickerForm = (props: {
  accounts: AccountSchema[];
  selectedAccountId: string;
  groupId?: string;
  itemId: string;
  cashAccount?: CashAccount | null;
}) => {
  return (
    <div class="picker-container">
      <div class="h-screen w-screen fixed top-0 left-0 bg-card-black opacity-80"></div>
      <div class="fixed bottom-0 left-0 right-0 z-[999999] p-5 rounded-t-2xl shadow-lg bg-card-black">
        <form class="flex flex-col mb-0 mt-3 justify-center text-font-off-white  border-b-primary-dark-grey">
          <div class="bg-primary-black rounded-xl">
            {props.accounts.map((account, index) => (
              <>
                <div
                  class="w-full flex justify-between p-4 hover:opacity-80 cursor-pointer"
                  hx-get={
                    props.groupId
                      ? `/groups/addTransaction/${account.id}/${props.groupId}/${props.itemId}`
                      : `/transactions/page/${props.itemId}/${account.id}`
                  }
                  hx-swap="innerHTML"
                  hx-target="#app"
                  hx-push-url={
                    props.groupId
                      ? `/groups/addTransaction/${account.id}/${props.groupId}`
                      : `/transactions/page/${account.id}`
                  }
                >
                  <label class="" for={account.name}>
                    {account.name}
                  </label>
                  <input
                    type="radio"
                    id={account.name}
                    name="selectedAccount"
                    value={account.name}
                    class="radio-picker w-6 h-6 cursor-pointer"
                    checked={account.id === props.selectedAccountId}
                  />
                </div>
                {index !== props.accounts.length - 1 && (
                  <div class="w-full h-px bg-primary-dark-grey rounded mb-2 opacity-75"></div>
                )}
              </>
            ))}{" "}
            {props.cashAccount && (
              <>
                <div class="w-full h-px bg-primary-dark-grey rounded mb-2 opacity-75"></div>
                <div
                  class="w-full flex justify-between p-4 hover:opacity-80 cursor-pointer"
                  hx-get={
                    props.groupId
                      ? `/groups/addTransaction/${props.cashAccount.id}/${props.groupId}/${props.itemId}?cashAccount=true`
                      : `/transactions/page/${props.itemId}/${props.cashAccount.id}?cashAccount=true`
                  }
                  hx-swap="innerHTML"
                  hx-target="#app"
                  hx-push-url={
                    props.groupId
                      ? `/groups/addTransaction/${props.cashAccount.id}/${props.groupId}?cashAccount=true`
                      : `/transactions/page/${props.cashAccount.id}?cashAccount=true`
                  }
                >
                  <label class="" for={props.cashAccount.id}>
                    Manually Added Tranasactions
                  </label>
                  <input
                    type="radio"
                    id={props.cashAccount.id}
                    name="selectedAccount"
                    value={props.cashAccount.id}
                    class="radio-picker w-6 h-6 cursor-pointer"
                    checked={props.cashAccount.id === props.selectedAccountId}
                  />
                </div>
              </>
            )}
          </div>
          <button
            class="text-accent-blue mt-4  py-2 cursor-pointer bg-primary-black rounded-xl font-semibold text-lg"
            hx-trigger="click"
            hx-get="/empty"
            hx-target=".picker-container"
            hx-swap="outerHTML"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
