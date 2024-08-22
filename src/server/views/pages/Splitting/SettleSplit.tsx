import type { OwedStatus } from "../../../database/seed";
import type { UserSchema } from "../../../interface/types";
import type { Transaction } from "../../../services/transaction.service";
import { OwedDetails } from "./components/OwedDetails";
import { SplitController } from "./components/SplitController";
import { SplitHeader } from "./components/SplitHeader";
import type { GroupTransactionDetails } from "./SplitDetails";

export const SettleSplit = (props: {
  transaction: Transaction;
  transactionOwner: {
    id: string;
    firstName: string;
    lastName: string | null;
    color: string;
  };
  currentUser: UserSchema;
  amountOwed: number; // positive means you owe, negative means you're owed
  pending?: boolean;
  linkedTransactionAccountName?: string;
  groupId: string;
  owedId: string;
  linkTransferActive?: boolean;
  results: GroupTransactionDetails;
  owedStatus: OwedStatus[number];
}) => {
  console.log(props.results, "at settlesplit");
  return (
    <div class="text-font-off-white">
      <div class="flex flex-row justify-between items-center mb-[1rem]">
        <img
          hx-get={`/split/view?owedId=${props.owedId}&groupId=${props.groupId}`}
          hx-push-url={`/split/view?owedId=${props.owedId}&groupId=${props.groupId}`}
          hx-swap="innerHTML"
          hx-target="#app"
          class="cursor-pointer hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          src="/icons/arrow_back_ios.svg"
        />
      </div>
      <SplitHeader transaction={props.transaction} />
      <OwedDetails
        transaction={props.transaction}
        transactionOwner={props.transactionOwner}
        currentUser={props.currentUser}
        amountOwed={props.amountOwed}
        pending={props.pending}
        linkedTransactionAccountName={props.linkedTransactionAccountName}
        results={props.results}
        owedStatus={props.owedStatus}
      />
      <SplitController
        user={props.transactionOwner}
        transactionOwnerName={props.transactionOwner.firstName}
        amount={props.amountOwed}
        owedId={props.owedId}
      />
    </div>
  );
};
