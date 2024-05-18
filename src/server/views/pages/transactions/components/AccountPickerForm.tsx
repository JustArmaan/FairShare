import type { AccountSchema } from '../../../../services/plaid.service';

export const AccountPickerForm = (props: {
  accounts: AccountSchema[];
  selectedAccountId: string;
  groupId?: string;
}) => {
  return (
    <div class="picker-container">
      <div class="h-screen w-screen fixed top-0 left-0 bg-card-black opacity-80"></div>
      <div class="fixed bottom-0 left-0 right-0 z-20 p-5 rounded-t-2xl shadow-lg bg-card-black">
        <form class="flex flex-col mb-0 mt-3 justify-center text-font-off-white  border-b-primary-dark-grey">
          <div class="bg-primary-black rounded-xl">
            {props.accounts.map((account, index) => (
              <>
                <div
                  class="w-full flex justify-between p-4 hover:opacity-80 cursor-pointer"
                  hx-get={
                    props.groupId // Add the missing declaration of the variable 'isGroupTransacrion'
                      ? `/groups/addTransaction/${account.id}/${props.groupId}`
                      : `/transactions/page/${account.id}`
                  }
                  hx-swap="innerHTML"
                  hx-target="#app"
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
            ))}
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
