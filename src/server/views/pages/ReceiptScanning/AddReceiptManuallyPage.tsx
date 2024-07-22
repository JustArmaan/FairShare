import { ReceiptForm } from "./components/ReceiptForm";
import type { ReceiptData } from "./components/ReceiptForm";

const fakeReceiptData: ReceiptData = {
  storeName: "Tech Gadgets Store",
  storeAddress: "1234 Silicon Valley Blvd, Tech City, CA 94025",
  date: "2024-07-22",
  transactionId: "TXN1234567890",
  items: [
    {
      name: "Wireless Mouse",
      price: 29.99,
      quantity: 2,
    },
    {
      name: "Mechanical Keyboard",
      price: 89.99,
      quantity: 1,
    },
    {
      name: "USB-C Hub",
      price: 49.99,
      quantity: 1,
    },
    {
      name: "Laptop Stand",
      price: 34.99,
      quantity: 1,
    },
    {
      name: "Noise Cancelling Headphones",
      price: 199.99,
      quantity: 1,
    },
  ],
  total: 434.94,
  tax: 34.79,
  tip: 20.0,
  fees: 5.0,
};

export const AddReceiptManuallyPage = (props: {}) => {
  return (
    <div class="bg-primary-black-page w-full h-fit">
        Hello
      <ReceiptForm />
    </div>
  );
};
