import type { OwedStatus } from "../../../../database/seed";
import type { UserSchema } from "../../../../interface/types";
import type { Transaction } from "../../../../services/transaction.service";
import type { GroupTransactionDetails } from "../SplitDetails";

export const OwedDetails = (props: {
  transaction: Transaction;
  transactionOwner: { id: string; firstName: string };
  currentUser: UserSchema;
  amountOwed: number; // positive means you owe, negative means you're owed
  pending?: boolean;
  linkedTransactionAccountName?: string;
  owedStatus: OwedStatus[number];
  results: GroupTransactionDetails;
}) => {
  const currentUserResult = props.results.find(
    (result) => result.users.id === props.currentUser.id
  )!;

  const amountOwedSubtractingTransfers =
    currentUserResult.groupTransactionToUsersToGroups.amount -
    props.results
      .filter(
        (result) =>
          result.groupTransactionToUsersToGroupsStatus.status ===
          "awaitingConfirmation"
      )
      .reduce((acc, current) => {
        return acc + current.groupTransactionToUsersToGroups.amount * -1;
      }, 0);

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
      ) : props.amountOwed < 0 &&
        props.owedStatus === "awaitingConfirmation" ? (
        <button class="flex flex-row items-center">
          <p class="italic text-font-off-white">Awaiting Confirmation</p>
        </button>
      ) : props.amountOwed > 0 ? (
        <button class="flex flex-row items-center">
          <img class="mr-1 h-[18px]" src="/icons/link-transaction.svg" />
          <p class="text-font-grey">link transaction</p>
        </button>
      ) : props.amountOwed === 0 ? (
        <p class="text-font-grey">Settled</p>
      ) : (
        <p class="italic">Not Settled</p>
      )}
      {/*
      cases where:
      you're owed, no transfers
      you're owed, some transfers
      you're owed, all transfers sent, none settled
      you're owed, all settled

      you owe, settlek
      you owe, awaiting conf
      you owe, not sent
      */}
      {props.amountOwed > 0 ? ( // if you're owed, this can have multiple entries
        <div class="flex flex-col">
          {amountOwedSubtractingTransfers !== 0 && // this is the "you're owed" part
            props.results
              .filter((result) => result.users.id === props.currentUser.id)
              .map((result) => (
                <div class="flex flex-row items-center">
                  <img
                    class="h-[18px] mr-2"
                    src={`/icons/balance-scale-${result.groupTransactionToUsersToGroupsStatus.status === "awaitingConfirmation" ? "blue" : props.amountOwed === 0 ? "grey" : "green"}.svg`}
                  />
                  <p
                    class={
                      result.groupTransactionToUsersToGroupsStatus.status ===
                      "awaitingConfirmation"
                        ? "text-accent-blue"
                        : result.groupTransactionToUsersToGroups.amount === 0
                          ? "text-font-grey"
                          : "text-positive-number"
                    }
                  >
                    {result.groupTransactionToUsersToGroupsStatus.status ===
                    "awaitingConfirmation"
                      ? `${result.users.firstName} Transferred`
                      : result.groupTransactionToUsersToGroups.amount === 0
                        ? "Bill Settled"
                        : "You're Owed:"}{" "}
                    <span class="font-semibold">
                      ${Math.abs(amountOwedSubtractingTransfers).toFixed(2)}
                    </span>
                  </p>
                </div>
              ))}
          {props.results // only transfers awaiting confirmation
            .filter(
              (result) =>
                result.users.id !== props.currentUser.id &&
                result.groupTransactionToUsersToGroupsStatus.status ===
                  "awaitingConfirmation"
            )
            .map((result) => (
              <div class="flex flex-row items-center">
                <img
                  class="h-[18px] mr-2"
                  src={`/icons/balance-scale-${result.groupTransactionToUsersToGroupsStatus.status === "awaitingConfirmation" ? "blue" : props.amountOwed === 0 ? "grey" : "green"}.svg`}
                />
                <p
                  class={
                    result.groupTransactionToUsersToGroupsStatus.status ===
                    "awaitingConfirmation"
                      ? "text-accent-blue"
                      : result.groupTransactionToUsersToGroups.amount === 0
                        ? "text-font-grey"
                        : "text-positive-number"
                  }
                >
                  {result.groupTransactionToUsersToGroupsStatus.status ===
                  "awaitingConfirmation"
                    ? `${result.users.firstName} Transferred`
                    : result.groupTransactionToUsersToGroups.amount === 0
                      ? "Bill Settled"
                      : "You're Owed:"}{" "}
                  <span class="font-semibold">
                    $
                    {Math.abs(
                      result.groupTransactionToUsersToGroups.amount
                    ).toFixed(2)}
                  </span>
                </p>
              </div>
            ))}
        </div>
      ) : (
        // else we have three simple cases for a person owing
        <div class="flex flex-row items-center">
          <img
            class="h-[18px] mr-2"
            src={`/icons/balance-scale-${
              currentUserResult.groupTransactionToUsersToGroupsStatus.status ===
              "awaitingConfirmation"
                ? "blue"
                : props.amountOwed === 0
                  ? "grey"
                  : "red"
            }.svg`}
          />
          <p
            class={
              props.owedStatus === "awaitingConfirmation" &&
              props.amountOwed < 0
                ? "text-accent-blue"
                : props.amountOwed === 0
                  ? "text-font-grey"
                  : "text-negative-number"
            }
          >
            {props.owedStatus === "awaitingConfirmation" && props.amountOwed < 0
              ? "You've Transferred"
              : props.amountOwed === 0
                ? "Bill Settled"
                : "You Owe:"}{" "}
            <span class="font-semibold">
              ${Math.abs(props.amountOwed).toFixed(2)}
            </span>
          </p>{" "}
        </div>
      )}
    </div>
  );
};
