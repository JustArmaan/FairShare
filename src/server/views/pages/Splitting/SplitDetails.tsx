import type { UserSchema } from "../../../interface/types";
import type { Transaction } from "../../../services/transaction.service";
import { maxCompanyNameLength } from "../Groups/components/PendingItem";
import { formatDate } from "../transactions/components/Transaction";
import { OwedDetails } from "./components/OwedDetails";
import { SplitHeader } from "./components/SplitHeader";

// owed and not linked
// owed and linked
// owing and not settled
// owing and sent, not linked (pending)
// owing and sent, linked (pending)
// settled with no transaction
// settled with transaction (linked)
// settled with cash

// no linked transaction
// linked transaction

export const SplitDetails = (props: {
  transaction: Transaction;
  transactionOwner: { id: string; firstName: string };
  currentUser: UserSchema;
  amountOwed: number; // positive means you owe, negative means you're owed
  pending?: boolean;
  linkedTransactionAccountName?: string;
  groupId: string;
}) => {
  return (
    <div id="split-details" class="text-font-off-white">
      <div class="flex flex-row justify-between items-center mb-[1rem]">
        <img
          hx-get={`/groups/view/${props.groupId}`}
          hx-push-url={``}
          hx-swap="innerHTML"
          hx-target="#app"
          class="cursor-pointer hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          src="/icons/arrow_back_ios.svg"
        />
        {/* <img class="" src="/icons/threeDot.svg" />  not sure what this is for yet*/}
      </div>
      <SplitHeader transaction={props.transaction} />
      <OwedDetails
        transactionOwner={props.transactionOwner}
        amountOwed={props.amountOwed}
        pending={props.pending}
        currentUser={props.currentUser}
        transaction={props.transaction}
        linkedTransactionAccountName={props.linkedTransactionAccountName}
      />
      <div class="p-2 pt-3 bg-second-black-background rounded-md mt-4">
        <div class="bg-primary-black p-2 h-32 rounded-md">
          Placeholder Split Viewer!
        </div>
        <div class="flex flex-col mt-6">
          <p class="font-medium text-lg mb-2">Receipt Details:</p>
          <div class="bg-primary-black p-2 h-[400px] rounded-md">
            Placeholder Receipt!
          </div>
        </div>
      </div>
      <div class="fixed bottom-32 w-full left-0 flex flex-row justify-center">
        {!(props.amountOwed >= 0 && !props.pending) &&
          !(props.amountOwed < 0 && props.pending) && (
            <button
              hx-get={
                props.amountOwed < 0 && !props.pending
                  ? "/split/settle"
                  : props.amountOwed > 0 && props.pending
                    ? "Confirm"
                    : ""
              }
              hx-trigger="click"
              hx-target="#app"
              hx-swap="innerHTML"
              hx-push-url={
                props.amountOwed < 0 && !props.pending
                  ? "/split/settle"
                  : props.amountOwed > 0 && props.pending
                    ? "Confirm"
                    : ""
              }
              class="hover:-translate-y-0.5
            transition-transform bg-accent-blue text-font-off-white px-16
            py-3.5 rounded-lg hover:bg-blue-600 flex flex-row
            justify-center font-semibold drop-shadow-xl items-center rotate-[0.000001deg]"
            >
              <p class="text-lg">
                {props.amountOwed < 0 && !props.pending
                  ? "Settle"
                  : props.amountOwed > 0 && props.pending
                    ? "Confirm"
                    : ""}
              </p>
            </button>
          )}
      </div>
    </div>
  );
};
