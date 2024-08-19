import type { UserSchema } from "../../../../interface/types";
import type { Transaction } from "../../../../services/transaction.service";

export const OwedDetails = (props: {
  transaction: Transaction;
  transactionOwner: { id: string; firstName: string };
  currentUser: UserSchema;
  amountOwed: number; // positive means you owe, negative means you're owed
  pending?: boolean;
  linkedTransactionAccountName?: string;
}) => {
  return (
    <div class="rounded-md bg-primary-black px-4 py-2">
      <p class="font-semibold text-lg">
        Paid by:{" "}
        {props.transactionOwner.id === props.currentUser.id
          ? `You ($${props.transaction.amount.toFixed(2)})`
          : `${props.transactionOwner.firstName} ($${props.transaction.amount.toFixed(2)})`}
      </p>
      {props.linkedTransactionAccountName && props.amountOwed >= 0 ? (
        <p class="">
          {props.amountOwed < 0 && props.pending
            ? "Transferred"
            : props.amountOwed === 0
              ? "Settled"
              : ""}{" "}
          with {props.linkedTransactionAccountName}
        </p>
      ) : props.amountOwed > 0 ? (
        <button class="flex flex-row items-center">
          <img class="mr-1 h-[18px]" src="/icons/link-transaction.svg" />
          <p class="text-font-grey">link transaction</p>
        </button>
      ) : props.amountOwed === 0 ? (
        <p class="text-font-grey">Settled</p>
      ) : (
        <p>
          <i>Not Settled</i>
        </p>
      )}
      <div class="flex flex-row items-center">
        <img
          class="h-[18px] mr-2"
          src={`/icons/balance-scale-${props.pending ? "blue" : props.amountOwed > 0 ? "green" : props.amountOwed === 0 ? "grey" : "red"}.svg`}
        />
        <p
          class={
            props.pending
              ? "text-accent-blue"
              : props.amountOwed > 0
                ? "text-positive-number"
                : props.amountOwed === 0
                  ? "text-font-grey"
                  : "text-negative-number"
          }
        >
          {props.pending && props.amountOwed < 0
            ? "You've Transferred"
            : props.pending && props.amountOwed > 0
              ? "You've Been Transferred"
              : props.amountOwed > 0
                ? "You're Owed: "
                : props.amountOwed === 0
                  ? "Bill Settled"
                  : "You Owe:"}{" "}
          <span class="font-semibold">
            ${Math.abs(props.amountOwed).toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
};
