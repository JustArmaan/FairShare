import type {
  ArrayElement,
  UserSchemaWithMemberType,
} from "../../../../interface/types";
import type { ReceiptLineItems } from "../../../../services/receipt.service";

export const ReceiptItem = (props: { receiptItem: ReceiptLineItems }) => {
  console.log("props", props.receiptItem);
  return (
    <>
      {props.receiptItem.map((item, index) => (
        <div class="flex items-center w-full text-font-off-white mb-2">
          <p class="w-1/2">{item.productName}</p>
          <div class="flex items-center w-1/6">
            {item.owingMembers &&
              item.owingMembers
                .slice(0, 4)
                .map((member: UserSchemaWithMemberType, index: number) => {
                  if (index === 3 && item.owingMembers.length > 4) {
                    return (
                      <div
                        key={index}
                        class="-ml-4 rounded-full relative w-fit"
                      >
                        <div class="flex items-center justify-center absolute h-[1.875rem] aspect-square rounded-full z-10 border-2 border-primary-black bg-font-black">
                          <p class="text-font-off-white text-xs">
                            +{item.owingMembers.length - 4}
                          </p>
                        </div>
                        <div
                          class={`flex rounded-full bg-${member.color} h-[calc(100%_-_1px)] p-px aspect-square justify-center brightness-[.40]`}
                        >
                          <span class="flex justify-center self-center text-center text-sm font-semibold">
                            {member.firstName.split("", 1)}
                            {member.lastName?.split("", 1)}
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        class={`-ml-4 flex rounded-full bg-${member.color} h-[1.875rem] aspect-square justify-center border-2 border-primary-black`}
                      >
                        <span class="flex justify-center self-center text-center text-xs font-semibold">
                          {member.firstName.split("", 1)}
                          {member.lastName?.split("", 1)}
                        </span>
                      </div>
                    );
                  }
                })}
          </div>
          <p class="w-1/6 text-center">{item.quantity}</p>
          <p class="w-1/6 text-right">${item.costPerItem}</p>
        </div>
      ))}
    </>
  );
};
