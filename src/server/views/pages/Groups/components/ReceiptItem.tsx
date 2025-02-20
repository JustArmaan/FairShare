import type {
  ReceiptItemWithOwedAmount,
  ReceiptLineItems,
} from "../../../../services/receipt.service";

export const ReceiptItem = (props: {
  receiptItem: ReceiptLineItems;
  groupWithMembers?: ReceiptItemWithOwedAmount;
  isSplit?: boolean;
}) => {
  const filteredReceiptItems = props.groupWithMembers?.filter(
    (item) => item.receiptLineId === props.receiptItem[0].id
  );
  return (
    <>
      {props.receiptItem.map((item, index) => (
        <div
          class="flex items-center w-full text-font-off-white mb-2"
          id={`receiptItem-${item.id}`}
        >
          <p class="w-1/2">{item.productName}</p>
          <div class="flex items-center w-1/6">
            {filteredReceiptItems &&
              filteredReceiptItems.length > 0 &&
              filteredReceiptItems.slice(0, 4).map((member, index: number) => {
                if (index === 3 && filteredReceiptItems!.length > 4) {
                  return (
                    <div class="-ml-4 rounded-full relative w-fit">
                      <div class="flex items-center justify-center absolute h-[1.875rem] aspect-square rounded-full z-10 border-2 border-primary-black bg-font-black">
                        <p class="text-font-off-white text-xs">
                          +{filteredReceiptItems!.length - 4}
                        </p>
                      </div>
                      <div
                        class={`flex rounded-full bg-${member.user.color} h-[calc(100%_-_1px)] p-px aspect-square justify-center brightness-[.40]`}
                      >
                        <span class="flex justify-center self-center text-center text-sm font-semibold">
                          {member.user.firstName.split("", 1)}
                          {member.user.lastName?.split("", 1)}
                        </span>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      class={`-ml-4 flex rounded-full bg-${member.user.color} h-[1.875rem] aspect-square justify-center border-2 border-primary-black`}
                    >
                      <span class="flex justify-center self-center text-center text-xs font-semibold">
                        {member.user.firstName.split("", 1)}
                        {member.user.lastName?.split("", 1)}
                      </span>
                    </div>
                  );
                }
              })}
          </div>
          <p class="w-1/6 text-center">{item.quantity}</p>
          <p class="w-1/6 text-right">${item.costPerItem}</p>
          {props.isSplit && (
            <p
              class="w-1/6 text-right text-accent-blue"
              hx-get={`/billSplit/splitForm/${item.id}?splitType=Equally`}
              hx-target={`#receiptItem-${item.id}`}
              hx-swap="outerHTML"
              hx-trigger="click"
            >
              Split
            </p>
          )}
        </div>
      ))}
    </>
  );
};
