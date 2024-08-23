import type { UserSchemaWithMemberType } from "../../../../interface/types";
import type { GroupWithMembers } from "../../../../services/group.service";
import type { Receipt } from "../../../../services/receipt.service";

export const GroupOverview = (props: {
  group: GroupWithMembers;
  transactionsDetails: Receipt;
}) => {
  const { group, transactionsDetails } = props;

  return (
    <div class="flex items-center rounded-lg text-font-off-white my-4">
      <div
        id="icon-container"
        class="h-[3.875rem] w-[3.875rem] flex items-center justify-center"
      >
        <div
          class={`${
            group.temporary === "true"
              ? `border-[3px] border-dashed border-${group.color} rounded-sm`
              : `bg-${group.color} rounded-sm`
          }  h-[3.875rem] w-[3.875rem] flex items-center justify-center`}
          id="icon-content"
        >
          <div
            class={`${
              group.temporary === "true"
                ? `text-${group.color}`
                : "text-card-black"
            } `}
          >
            <img
              class="w-[1.87rem] h-[1.87rem]"
              src={group.icon}
              alt="group icon"
            />
          </div>
        </div>
      </div>

      <div class="flex-1 ml-4">
        <p class="text-sm font-semibold">Group: {group.name}</p>
        <p class="text-lg font-bold">{transactionsDetails[0].storeName}</p>
        <p class="text-sm">Total: ${transactionsDetails[0].total.toFixed(2)}</p>
      </div>

      <div class="flex flex-col items-center w-1/6">
        <div class="flex items-center">
          {group.members &&
            group.members
              .slice(0, 4)
              .map((member: UserSchemaWithMemberType, index: number) => {
                if (index === 3 && group.members.length > 4) {
                  return (
                    <div class="-ml-4 rounded-full relative w-fit">
                      <div class="flex items-center justify-center absolute h-[1.875rem] aspect-square rounded-full z-10 border-2 border-primary-black bg-font-black">
                        <p class="text-font-off-white text-xs">
                          +{group.members.length - 4}
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
                      <span class="flex justify-center self-center text-center text-xs font-semibold text-font-black">
                        {member.firstName.split("", 1)}
                        {member.lastName?.split("", 1)}
                      </span>
                    </div>
                  );
                }
              })}
        </div>

        <p class="text-xs text-font-grey mt-1 w-20">
          {group.members.length} members
        </p>
      </div>
    </div>
  );
};
