import type { Groups } from "../GroupPage";
import type { ArrayElement } from "../../transactions/components/Transaction";

export const GroupItem = (props: {
  group: ArrayElement<Groups>;
  owedAmount: number;
  edit?: boolean;
  flags: { owed: boolean; owing: boolean };
}) => {
  return (
    <div class="cursor-pointer hover:opacity-80 transition-all bg-primary-black mb-md-separator px-[1.13rem] py-[0.88rem] rounded-md">
      <div
        class="flex items-center"
        hx-get={`/groups/view/${props.group.id}`}
        hx-target="#app"
        hx-swap="innerHTML"
        hx-push-url={`/groups/view/${props.group.id}`}
      >
        <div
          class={`${
            props.group.temporary === "true"
              ? `border-[3px] border-dashed border-${props.group.color} rounded-sm`
              : `bg-${props.group.color} rounded-sm`
          }  h-[3.875rem] aspect-square flex items-center justify-center`}
        >
          <div
            class={`${
              props.group.temporary === "true"
                ? `text-${props.group.color}`
                : "text-card-black"
            } `}
          >
            <img
              class="w-[1.87rem] h-[1.87rem]"
              src={
                props.group.icon.endsWith("svg")
                  ? props.group.icon.replace(".", "")
                  : "/icons/bed.svg"
              }
              alt=""
            />
          </div>
        </div>
        <div class="w-full flex justify-between items-center relative">
          <div class="flex flex-col ml-4 h-full ">
            <div class="flex items-center h-[1.75rem]">
              <p class="font-semibold text-font-off-white leading-6 text-lg truncate h-full flex items-center">
                {props.group.name}
                {props.group.temporary === "true" && (
                  <span class="text-font-grey"> (TEMP)</span>
                )}
              </p>
              <div class="flex flex-row items-center ml-[0.5rem] h-full">
                {props.flags.owed && (
                  <div
                    class={`rounded-full h-[0.75rem] aspect-square bg-positive-number z-10`}
                  />
                )}
                {props.flags.owing && (
                  <div
                    class={`rounded-full h-[0.75rem] aspect-square bg-negative-number ${props.flags.owed && "-ml-[0.22rem]"}`}
                  />
                )}
              </div>
            </div>
            <p
              class={`h-[0.875rem] text-xs ${props.owedAmount === 0 ? "text-font-grey" : props.owedAmount > 0 ? "text-positive-number" : "text-negative-number"}`}
            >
              {props.owedAmount === 0
                ? "Settled"
                : props.owedAmount > 0
                  ? "You're Owed $" + props.owedAmount.toFixed(2)
                  : "You Owe $" + Math.abs(props.owedAmount).toFixed(2)}
            </p>
          </div>
          <div class="flex flex-col pr-[0.38rem] relative left-[0.38rem]">
            <div class="flex justify-end">
              {props.edit && (
                <img
                  hx-get={`/groups/delete/${props.group.id}`}
                  hx-target="#app"
                  hx-swap="innerHTML"
                  class=""
                  src="/icons/delete.svg"
                  alt="delete icon"
                />
              )}
              {!props.edit &&
                props.group.members.slice(0, 4).map((member, index) => {
                  return index === 3 && props.group.members.length > 4 ? (
                    <div class="-ml-4 rounded-full relative w-fit ">
                      <div class="flex items-center justify-center absolute h-[1.875rem] aspect-square rounded-full z-10 border-2 border-primary-black">
                        <p class="text-font-off-white text-xs">
                          +{props.group.members.length - 4}
                        </p>
                      </div>
                      <div
                        class={`flex rounded-full bg-${member.color} h-[calc(100%_-_1px)] p-px aspect-square justify-center brightness-[.40]  `}
                      >
                        <span class="flex justify-center self-center text-center text-sm font-semibold">
                          {member.firstName.split("", 1)}
                          {member.lastName?.split("", 1)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      class={`-ml-4 flex rounded-full bg-${member.color} h-[1.875rem] aspect-square justify-center border-2 border-primary-black`}
                    >
                      <span class="flex justify-center self-center text-center text-sm font-semibold">
                        {member.firstName.split("", 1)}
                        {member.lastName?.split("", 1)}
                      </span>
                    </div>
                  );
                })}
            </div>
            <p class="relative text-font-grey text-[0.625rem] h-[0.75rem] mt-[0.12rem] left-[0.38rem]">
              {props.group.members.length} members
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
