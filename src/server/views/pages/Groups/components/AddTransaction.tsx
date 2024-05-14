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

export const AddTransaction =  (props: {
    currentUser: UserSchema
    groupId: string
    accounts: ExtractFunctionReturnType<typeof getAccountWithTransactions>[];
    selectedAccountId: string;
  }) => {
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
          <div id="transactionsContainer" class="mt-2">
        {props.accounts
          .find((account) => account.id === props.selectedAccountId)!
          .transactions.map((transaction, categoryIndex) => (
            <Transaction
              transaction={transaction}
              tailwindColorClass={iconColors[categoryIndex % iconColors.length]}
              route='AddTransaction'
              checked={false}
            />
          ))}
      </div>
        </div>
    )
  };
  
  export default AddTransaction;
  
