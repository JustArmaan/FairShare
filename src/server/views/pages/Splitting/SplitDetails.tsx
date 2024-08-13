import type { UserSchema } from "../../../interface/types";
import type { Transaction } from "../../../services/transaction.service";

export const SplitDetails = (props: {
  title: string;
  transaction: Transaction;
  transactionOwner: { id: string; firstName: string };
  date: string;
  currentUser: UserSchema;
  amountOwed: number; // positive means you owe, negative means you're owed
}) => {
  return (
    <div id="split-details">
      <div>
        <h1>{props.title}</h1>
        <p>Total: ${props.transaction.amount}</p>
        <p>{props.transaction.timestamp}</p>
      </div>
      <div>
        <p>
          Paid by:{" "}
          {props.transactionOwner.id === props.currentUser.id
            ? `You ($${props.transaction.amount})`
            : `${props.transactionOwner.firstName} ($${props.transactionOwner.firstName})`}
        </p>
        <button class="flex flex-row items-center">
          <img src="somesvg.svg" />
          <p>link transaction</p>
        </button>
      </div>
    </div>
  );
};
