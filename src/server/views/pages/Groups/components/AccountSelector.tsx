import type { Account } from '../../../../services/account.service';

export const AccountSelector = (props: {
  selectedAccount: Account | false;
  accounts: Account[];
}) => {
  return (
    <div class="rounded-lg p-4 bg-primary-black text-xl flex flex-col">
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
          <div class="drop-shadow-md rounded-xl bg-primary-faded-black">
            <p class="mx-6 py-3">Tap to select an institution</p>
          </div>
          {props.accounts.map((account) => (
            <div class="bg-primary-faded-black rounded-lg my-2 p-2">
              <p>
                Name:
                {account.name &&
                  (account.name.length > 20
                    ? account.name.slice(0, 20) + '...'
                    : account.name)}
              </p>
              <p>
                Balance:{' '}
                <span class="font-semibold">
                  {parseFloat(account.balance!).toFixed(2)}
                </span>
              </p>
            </div>
          ))}
        </>
      )}
      <button
        class={`${
          props.selectedAccount ? 'bg-accent-blue' : 'border-accent-blue'
        } border-2 py-1.5 w-full rounded-lg mt-4 font-semibold hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform`}
      >
        {props.selectedAccount ? 'Change Account' : 'Cancel'}
      </button>
    </div>
  );
};
