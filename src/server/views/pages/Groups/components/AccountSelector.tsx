import type { AccountWithItem } from '../../../../services/account.service';
import { InstitutionDropDown } from './InstitutionDropDown';

export const AccountSelector = (props: {
  selectedAccount: AccountWithItem | null;
  accounts: AccountWithItem[];
}) => {
  /*
  const items = props.accounts.reduce(
    (items, account) => {
      const index = items.findIndex((item) => item.id === account.item.id);
      if (index === -1) {
        items.push(account.item);
      }
      return items;
    },
    [] as AccountWithItem['item'][]
  ); */

  return (
    <div
      class="rounded-lg p-4 bg-primary-black text-xl flex flex-col animate-fade-in"
      id="accountSelector"
    >
      <input
        type="hidden"
        value={props.selectedAccount?.id}
        name="selectedAccountId"
      />
      {props.selectedAccount ? (
        <>
          <p>
            Name:{' '}
            {props.selectedAccount.name.length > 20
              ? props.selectedAccount.name.slice(0, 20) + '...'
              : props.selectedAccount.name}
          </p>
          <p class="mt-4">
            Type: <span class="font-semibold">Debit</span>
          </p>
          <p>
            Balance:{' '}
            <span class="font-semibold">
              {props.selectedAccount.balance
                ? parseFloat(props.selectedAccount.balance).toFixed(2)
                : (0).toFixed(2)}
            </span>
          </p>
        </>
      ) : (
        <>
          {/*
          <div
            hx-get={`/groups/account-selector/institution-drop-down?open=false&selected=`}
            hx-swap="outerHTML"
            hx-trigger="load"
          /> */}
          <div class="flex flex-row overflow-x-scroll items-start w-full relative">
            {props.accounts.map((account) => (
              <div class="py-6 bg-primary-faded-black rounded-lg my-2 drop-shadow-xl w-[80%] min-w-[80%] px-8 mx-4 flex flex-col justify-center">
                <p class="mb-1">
                  Name:{' '}
                  <span class="font-semibold">
                    {account.name &&
                      (account.name.length > 20
                        ? account.name.slice(0, 20) + '...'
                        : account.name)}
                  </span>
                </p>
                <p class="mb-6">
                  Balance:{' '}
                  <span class="font-semibold">
                    ${parseFloat(account.balance!).toFixed(2)}
                  </span>
                </p>
                <button
                  hx-get={`/groups/account-selector/select?accountId=${account.id}`}
                  hx-trigger="click"
                  hx-swap="outerHTML"
                  hx-target="#accountSelector"
                  class="bg-accent-blue py-2 w-full rounded-lg mt-4 font-semibold hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform"
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {props.selectedAccount && (
        <button
          hx-get={`/groups/account-selector/select?accountId=`}
          hx-trigger="click"
          hx-swap="outerHTML"
          hx-target="#accountSelector"
          class={`${'bg-accent-blue'} border-2 py-1.5 w-full rounded-lg mt-4 font-semibold hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform`}
        >
          Change Account
        </button>
      )}
    </div>
  );
};
