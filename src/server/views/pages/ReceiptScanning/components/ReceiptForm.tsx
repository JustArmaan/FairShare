interface Item {
  name: string;
  price: number;
  quantity: number;
}

export interface ReceiptData {
  storeName: string;
  storeAddress: string;
  date: string;
  transactionId: string;
  items: Item[];
  total: number;
  tax: number;
  tip: number;
  fees: number;
}

export const ReceiptForm = (props: { receiptData?: ReceiptData }) => {
  return (
    <>
      <div class="flex flex-col justify-center bg-primary-black text-font-off-white px-[0.87rem] pt-[2.25rem] pb-[9.7rem] placeholder-font-off-white max-w-[500px] mx-auto">
        <form>
          <div class="px-[2.16rem]">
            <input
              type="text"
              placeholder={
                !props.receiptData?.storeName ? "Enter Store Name" : undefined
              }
              value={props.receiptData?.storeName}
              class="w-full bg-primary-faded-black text-font-off-white px-[2.5rem] mb-1 text-center pl-4"
            />
            <input
              type="text"
              placeholder={
                !props.receiptData?.storeAddress
                  ? "Enter Store Address"
                  : undefined
              }
              value={props.receiptData?.storeAddress}
              class="w-full bg-primary-faded-black text-font-off-white px-[2.5rem] text-center pl-4"
            />
          </div>
          <hr class="border-t border-primary-dark-grey w-full my-1 mx-auto px-2 mb-2 mt-4" />
          <div class="px-[1.16rem]">
            <input
              type="text"
              placeholder={
                !props.receiptData?.date ? "Enter Date and Time" : undefined
              }
              value={props.receiptData?.date}
              class="w-full bg-primary-faded-black text-font-off-white mb-1 pl-4"
            />
            <input
              type="text"
              placeholder={
                !props.receiptData?.transactionId
                  ? "Enter Transaction ID"
                  : undefined
              }
              value={props.receiptData?.transactionId}
              class="w-full bg-primary-faded-black text-font-off-white mb-[2.12rem] pl-4"
            />
          </div>

          <div id="items-container">
            {props.receiptData?.items ? (
              props.receiptData.items.map((item, index) => (
                <div class="flex justify-between mb-1 w-full receipt-input-container">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={item.name}
                    class="w-[50%] bg-primary-faded-black text-font-off-white pl-2"
                  />
                  <input
                    type="text"
                    placeholder="Quantity"
                    value={item.quantity}
                    class="w-[20%] bg-primary-faded-black text-font-off-white text-center"
                  />
                  <input
                    type="text"
                    placeholder="Price"
                    value={item.price}
                    class="w-[20%] bg-primary-faded-black text-font-off-white text-center"
                  />
                </div>
              ))
            ) : (
              <div class="flex justify-between mb-1 w-full receipt-input-container">
                <input
                  type="text"
                  placeholder="Item Name"
                  class="w-[50%] bg-primary-faded-black text-font-off-white pl-2"
                />
                <input
                  type="text"
                  placeholder="Quantity"
                  class="w-[20%] bg-primary-faded-black text-font-off-white text-center"
                />
                <input
                  type="text"
                  placeholder="Price"
                  class="w-[20%] bg-primary-faded-black text-font-off-white text-center"
                />
              </div>
            )}
          </div>

          <p
            hx-get="/receipt/addInput"
            hx-trigger="click"
            hx-swap="beforeend"
            hx-target="#items-container"
            class="text-font-grey mb-2 cursor-pointer px-[1.16rem]"
          >
            + add item
          </p>

          <div class="flex flex-col items-end w-full px-[1.16rem]">
            <div class="flex w-full justify-end mb-1">
              <label class="bg-primary-faded-black text-font-off-white w-[80px] px-1 text-center">
                Subtotal:
              </label>
              <input
                type="text"
                placeholder={!props.receiptData?.total ? "Subtotal" : undefined}
                value={props.receiptData?.total}
                class="bg-primary-faded-black text-font-off-white text-center w-[80px] px-1 ml-1"
              />
            </div>
            <div class="flex w-full justify-end mb-1">
              <label class="bg-primary-faded-black text-font-off-white w-[80px] px-1 text-center">
                Tax:
              </label>
              <input
                type="text"
                placeholder={!props.receiptData?.tax ? "Tax" : undefined}
                value={props.receiptData?.tax}
                class="bg-primary-faded-black text-font-off-white text-center w-[80px] px-1 ml-1"
              />
            </div>
            <div class="flex w-full justify-end mb-1">
              <label class="bg-primary-faded-black text-font-off-white w-[80px] px-1 text-center">
                Tip:
              </label>
              <input
                type="text"
                placeholder={!props.receiptData?.tip ? "Tip" : undefined}
                value={props.receiptData?.tip}
                class="bg-primary-faded-black text-font-off-white text-center w-[80px] px-1 ml-1"
              />
            </div>
            <div class="flex w-full justify-end mb-1 mt-[2.6rem]">
              <label class="bg-primary-faded-black text-font-off-white w-[80px] px-1 text-center">
                Total:
              </label>
              <input
                type="text"
                placeholder={!props.receiptData?.total ? "Total" : undefined}
                value={props.receiptData?.total}
                class="bg-primary-faded-black text-font-off-white text-center w-[80px] px-1 ml-1"
              />
            </div>
            <label class="bg-primary-faded-black text-font-off-white w-fit text-right px-1 font-semibold mb-2">
              {props.receiptData?.total
                ? `Visa Debit ****1234 ${props.receiptData?.total}`
                : "This is where the total will be"}
            </label>
            <p
              hx-get="/receipt/addPaymentOption"
              hx-trigger="click"
              hx-swap="beforeend"
              hx-target=".receipt-input-container"
              class="text-font-grey mb-2 cursor-pointer mt-6"
            >
              + add another payment method
            </p>
          </div>
        </form>
      </div>
    </>
  );
};
