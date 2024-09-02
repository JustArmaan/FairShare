import { splitType } from "../../../../database/schema/splitType";
import type {
  UserSchema,
  UserSchemaWithMemberType,
} from "../../../../interface/types";
import type { Receipt } from "../../../../services/receipt.service";

export const CheckedMember = (props: {
  member: UserSchemaWithMemberType;
  currentUser: UserSchema;
  splitType: string;
  receipt: Receipt;
  checkedMemberCount: number;
}) => {
  const { member } = props;
  return (
    <div
      class="flex justify-between items-center w-full"
      id={`member-${member.id}`}
    >
      <div class="flex items-center">
        <div
          class={`flex rounded-full bg-${member.color} h-[2rem] w-[2rem] justify-center items-center border-2 border-primary-black`}
        >
          <span class="text-xs font-semibold text-font-black">
            {member.firstName[0]}
            {member.lastName ? member.lastName[0] : ""}
          </span>
        </div>
        <div class="ml-4">
          <p class="text-font-off-white font-semibold">{member.firstName}</p>
          <p class="text-font-grey text-xs">{member.type}</p>
        </div>
        {props.currentUser.id === member.id && (
          <span class="bg-accent-purple text-white text-xs rounded-[0.25rem] px-2 py-0.5 ml-2 mb-4">
            You
          </span>
        )}
      </div>

      {props.splitType === "Equally" && (
        <div class="flex items-center">
          <p class="ml-4">
            {member.type === "Owner" ? (
              <span class="text-font-grey">
                $
                {(props.receipt[0].total / props.checkedMemberCount).toFixed(2)}
              </span>
            ) : (
              <>
                <span class="text-font-off-white">Owe You </span>
                <span class="text-accent-green">
                  $
                  {(props.receipt[0].total / props.checkedMemberCount).toFixed(
                    2
                  )}
                </span>
              </>
            )}{" "}
            <div id={`splitOptionsRadioButton${member.id}`}>
              <img
                hx-get={`/billSplit/checkSplit/${member.id}/${props.receipt[0].id}?ischecked=true`}
                hx-swap="innerHTML"
                hx-trigger="click"
                hx-target={`#member-${member.id}`}
                hx-vals={`js:{ splitType: document.querySelector("#billSplitReceipt").dataset.splitType, checkedMemberCount: document.querySelectorAll("input[name^='true-']").length, checkedMemberIds: Array.from(document.querySelectorAll("input[name^='true-']:checked")).map(input => input.name.replace("true-", "")).join(",") }`}
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
          </p>
        </div>
      )}

      {props.splitType === "Amount" && (
        <div class="flex items-center">
          <div class="flex items-center" id="splitByAmount">
            <p class="text-font-grey mr-1">$</p>
            <input
              hx-post={`/billSplit/amount`}
              hx-trigger="input changed delay:500ms, search"
              hx-target={`#splitAmount-${member.id}`}
              hx-vals={`{"totalOwed": "${props.receipt[0].total}", "memberId": "${member.id}"}`}
              type="number"
              min="0"
              max={props.receipt[0].total}
              step="0.10"
              class="bg-primary-black border border-font-grey text-font-grey w-16 text-right p-1 mr-2 rounded-md split-amount"
              placeholder="0.00"
              name="splitAmount"
              id={`splitAmount-${member.id}`}
            />
            <div id={`splitOptionsRadioButton${member.id}`}>
              <img
                hx-get={`/billSplit/checkSplit/${member.id}/${props.receipt[0].id}?ischecked=true`}
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
      )}

      {props.splitType === "Percentage" && (
        <div class="flex items-center" id="splitByPercent">
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            name={`splitPercentage-${member.id}`}
            class="bg-primary-black border border-font-grey text-font-grey w-16 text-right p-1 mr-2 rounded-md"
            placeholder="0"
          />
          <p class="text-font-grey">%</p>

          <div id={`splitOptionsRadioButton${member.id}`}>
            <img
              hx-get={`/billSplit/checkSplit/${member.id}/${props.receipt[0].id}?ischecked=true`}
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
      )}
    </div>
  );
};
