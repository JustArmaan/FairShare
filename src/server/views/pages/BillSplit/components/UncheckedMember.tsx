import type {
  UserSchema,
  UserSchemaWithMemberType,
} from "../../../../interface/types";

export const UncheckedMember = (props: {
  receiptId: string;
  member: UserSchemaWithMemberType;
  currentUser: UserSchema;
  receiptItemId?: string;
}) => {
  const { member } = props;
  return (
    <div
      class="flex flex-col space-y-3 opacity-50 w-full"
      id={`member-${member.id}`}
    >
      <div class="flex justify-between items-center">
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
            <p class="text-font-off-white font-semibold">{member.firstName}</p>
            <p class="text-font-grey text-xs">{member.type}</p>
          </div>{" "}
          {props.currentUser.id === member.id && (
            <span class="bg-accent-purple text-white text-xs rounded-[0.25rem] px-2 py-0.5 ml-2 mb-4">
              You
            </span>
          )}
        </div>

        <div id={`splitOptionsRadioButton${member.id}`}>
          <img
            hx-get={`/billSplit/checkSplit/${member.id}/${props.receiptId}?ischecked=false`}
            hx-swap="innerHTML"
            hx-trigger="click"
            hx-target={`#member-${member.id}`}
            src="/activeIcons/unchecked_circle.svg"
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
  );
};
