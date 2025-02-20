import { type GroupMembersTransactions } from "../../../services/group.service";

export const GroupTransactionsListPage = (props: {
  group: GroupMembersTransactions;
}) => {
  return (
    <div
      class="animate-fade-in"
      hx-push-url={`/groups/transactions/${props.group.id}`}
    >
      <div class="flex justify-start w-fit items-center mb-1">
        <a
          hx-get={`/groups/view/${props.group.id}`}
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          hx-push-url={`/groups/view/${props.group.id}`}
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
          <p class="text-font-off-white text-semibold">{`Viewing Transactions for group <strong>${props.group.name}</strong>`}</p>
        </div>
        <div
          class="transactions-container flex flex-col my-8"
          hx-get={`/groups/getTransactions/${
            props.group.id
          }/?url=${`/groups/view/${props.group.id}`}`}
          hx-swap="innerHTML"
          hx-trigger="load"
          hx-target=".transactions-container"
        ></div>
      </div>
      <div class="mb-12"></div>
    </div>
  );
};
