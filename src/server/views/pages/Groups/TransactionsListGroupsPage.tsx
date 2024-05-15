import { type GroupMembersTransactions } from '../../../services/group.service';
import Transaction from '../transactions/components/Transaction';

export const GroupTransactionsListPage = (props: {
  group: GroupMembersTransactions;
}) => {
  console.log('start', props.group, 'props.group');
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex justify-start w-fit items-center mb-1">
        <a
          hx-get={`/groups/view/${props.group.id}`}
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
      <div class="flex flex-col my-8">
        <div class="flex justify-start">
          <p class="text-font-off-white text-semibold">{`Viewing Transactions for group ${props.group.name}`}</p>
          {/* What the heck is going on with the type here */}
        </div>
        <div class="transactions-container flex flex-col my-8">
          {props.group.transactions.map((transaction) => (
            <Transaction
              transaction={transaction}
              tailwindColorClass={transaction.category.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
