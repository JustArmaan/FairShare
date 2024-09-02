import type { Transaction } from "../../../../services/transaction.service";
import { maxCompanyNameLength } from "../../Groups/components/PendingItem";
import { formatDate } from "../../transactions/components/Transaction";

export const SplitHeader = (props: { transaction: Transaction }) => {
  return (
    <div class="flex flex-col items-center">
      <h1 class="text-font-off-white text-2xl">
        {maxCompanyNameLength(props.transaction.company!, 20)}
      </h1>
      <p class="text-font-off-white text-3xl font-semibold">
        Total: ${props.transaction.amount.toFixed(2)}
      </p>
      <p class="text-font-grey mb-[1rem]">
        {formatDate(props.transaction.timestamp!)}
      </p>
    </div>
  );
};
