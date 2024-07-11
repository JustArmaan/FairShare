import type { UserSchemaWithMemberType } from "../../../../interface/types";

export const ReceiptItem = (props: { receiptItem: any }) => {
  return (
    <div class="flex items-center w-full text-font-black mb-2">
      <p class="w-1/2">{props.receiptItem.item}</p>
      <div class="flex items-center w-1/6">
        {props.receiptItem.owingMembers
          .slice(0, 4)
          .map((member: UserSchemaWithMemberType, index: number) => {
            if (index === 3 && props.receiptItem.owingMembers.length > 4) {
              return (
                <div class="-ml-4 rounded-full relative w-fit">
                  <div class="flex items-center justify-center absolute h-[1.875rem] aspect-square rounded-full z-10 border-2 border-primary-black bg-font-black">
                    <p class="text-font-off-white text-xs">
                      +{props.receiptItem.owingMembers.length - 4}
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
      <p class="w-1/6 text-center">{props.receiptItem.quantity}</p>
      <p class="w-1/6 text-right">${props.receiptItem.price.toFixed(2)}</p>
    </div>
  );
};
