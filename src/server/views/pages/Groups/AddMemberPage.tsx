import { type GroupWithMembers } from "../../../services/group.service";
import { GroupItem } from "./components/GroupItem";

export const AddMembersPage = (props: { group: GroupWithMembers }) => {
  return (
    <div class="animate-fade-in">
      <a
        hx-get={`/groups/view/${props.group.id}`}
        hx-trigger="click"
        hx-target="#app"
        hx-swap="innerHTML"
        hx-push-url={`/groups/view/${props.group.id}`}
        class="text-font-off-white text-4xl cursor-pointer"
      >
        <img
          src="/icons/arrow_back_ios.svg"
          alt="back arrow icon"
          class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
        />
      </a>
      <div class="bg-primary-black rounded-md w-full h-fit p-4 flex relative items-center">
        <div
          class={`flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center bg-${props.group.color}`}
        >
          <img src={props.group.icon} alt="Group Icon" class="w-6 h-6" />{" "}
        </div>

        <span class="ml-4 text-font-off-white font-semibold flex-grow ">
          {props.group.name}
        </span>

        <button class="absolute top-0 right-0 mt-3 mr-3 text-white text-sm">
          Edit
        </button>
      </div>
    </div>
  );
};
