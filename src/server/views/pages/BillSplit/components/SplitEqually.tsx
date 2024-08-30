import type { UserSchema } from "../../../../interface/types";
import type { GroupWithMembers } from "../../../../services/group.service";
import type { Receipt } from "../../../../services/receipt.service";

export const SplitEqually = (props: {
  group: GroupWithMembers;
  transactionDetails: Receipt;
  currentUser: UserSchema;
}) => {
  const totalOwed = parseFloat(props.transactionDetails[0].total.toFixed(2));
  const splitAmount = (totalOwed / props.group.members.length).toFixed(2);

  return (
    <div class="bg-primary-black text-font-off-white w-full rounded-lg p-4">
      <div class="flex justify-center items-center border-b border-font-grey pb-2 mb-2">
        <p class="font-semibold">Split Equally</p>
        <button class="text-font-grey">
          <img
            src="/activeIcons/expand_more.svg"
            class="w-4 h-4 ml-2"
            hx-get={`/billSplit/splitOptions/${props.transactionDetails[0].id}/${props.group.id}?splitType=Equally`}
            hx-swap="innerHTML"
            hx-target="#split-bill-button"
            hx-trigger="click"
          />
        </button>
      </div>

      <div class="flex flex-col space-y-3">
        {props.group.members.map((member, index) => (
          <div
            class="flex justify-between items-center"
            id={`member-${member.id}`}
          >
            <div class="flex items-center">
              <div
                class={`flex rounded-full bg-${member.color} h-[2rem] w-[2rem] justify-center border-2 border-primary-black`}
              >
                <span class="flex justify-center self-center text-center text-xs font-semibold text-font-black">
                  {member.firstName[0]}
                  {member.lastName ? member.lastName[0] : ""}
                </span>
              </div>
              <div class="ml-4">
                <p class="text-font-off-white font-semibold">
                  {member.firstName}
                </p>
                <p class="text-font-grey text-xs">{member.type}</p>
              </div>{" "}
              {props.currentUser.id === member.id && (
                <span class="bg-accent-purple text-white text-xs rounded-[0.25rem] px-2 py-0.5 ml-2 mb-4">
                  You
                </span>
              )}
            </div>

            <div class="flex items-center">
              <p class="ml-4">
                {member.type === "Owner" ? (
                  <span class="text-font-grey">${splitAmount}</span>
                ) : (
                  <>
                    <span class="text-font-off-white">Owe You </span>
                    <span class="text-accent-green">${splitAmount}</span>
                  </>
                )}
              </p>

              <div id={`splitOptionsRadioButton${member.id}`}>
                <img
                  hx-get={`/billSplit/checkSplit/${member.id}/${props.transactionDetails[0].id}?ischecked=true`}
                  hx-swap="innerHTML"
                  hx-trigger="click"
                  hx-target={`#member-${member.id}`}
                  src="/activeIcons/checked_blue_circle.svg"
                  alt="selected icon"
                  class="ml-1 cursor-pointer"
                />

                <input
                  type="hidden"
                  name={`${true}-${member.id}`}
                  id="selectedIcon"
                  class="split-options-radio"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
