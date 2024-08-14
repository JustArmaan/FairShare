import { ReceiptForm } from "./components/ReceiptForm";
import type {
  Receipt,
  ReceiptLineItems,
} from "../../../services/receipt.service";

export const AddReceiptManuallyPage = (props: {
  transactionsDetails?: Receipt;
  receiptItems?: ReceiptLineItems;
}) => {
  const { transactionsDetails, receiptItems } = props;

  return (
    <div class="bg-primary-black-page w-full h-fit">
      {transactionsDetails && receiptItems ? (
        <ReceiptForm
          transactionsDetails={transactionsDetails}
          receiptItems={receiptItems}
        />
      ) : (
        <ReceiptForm />
      )}
    </div>
  );
};
