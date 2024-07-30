import { type UserSchema } from "../../../../interface/types";
import { getGroupWithMembers } from "../../../../services/group.service";
import GroupMembers from "./GroupMembers";
import { InviteMemberInput } from "./InviteMemberInput";
import { InviteShareLink } from "./InviteShareLink";
import SelectIcon from "./SelectIcon";

export const colors = [
  { name: "accent-purple", bgClass: "bg-accent-purple" },
  { name: "accent-red", bgClass: "bg-accent-red" },
  { name: "accent-yellow", bgClass: "bg-accent-yellow" },
  { name: "accent-green", bgClass: "bg-accent-green" },
  { name: "accent-teal", bgClass: "bg-accent-teal" },
];

export function createGroupNameInput(edit = false, groupName?: string) {
  if (edit) {
    return (
      <>
        <label class="text-font-off-white justify-start bold">Group Name</label>
        <input
          class="py-1 px-4 justify-center items-center text-font-grey bg-primary-black rounded-lg mt-2"
          type="text"
          name="groupName"
          placeholder="Enter group name"
        />
      </>
    );
  } else {
    return (
      <>
        <label class="text-font-off-white justify-start bold">Group Name</label>
        <input
          class="px-2 py-1 justify-center items-center text-font-grey bg-primary-black rounded-lg mt-2"
          type="text"
          name="groupName"
          value={groupName}
        />
      </>
    );
  }
}

export type UserGroupSchema = NonNullable<
  Awaited<ReturnType<typeof getGroupWithMembers>>
>;

export const EditGroupPage = ({
  currentUser,
  group,
  inviteShareLink,
  icons,
}: {
  currentUser: UserSchema;
  group: UserGroupSchema;
  inviteShareLink: string;
  icons: { icon: string; name: string }[];
}) => {
  return (
    <div class="animate-fade-in">
      <div class="flex justify-between items-center mb-1 mt-[28px] text-font-off-white">
        <a
          hx-get={`/groups/view/${group.id}`}
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          hx-push-url={`/groups/view/${group.id}`}
          class="text-font-off-white text-4xl cursor-pointer"
        >
          <img
            src="/icons/arrow_back_ios.svg"
            alt="back arrow icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          />
        </a>
        <div class="flex gap-4 ml-auto">
          <button class="bg-primary-black py-[0.75rem] px-4 rounded-md w-32">
            Cancel
          </button>
          <button
            type="button"
            hx-post={`/groups/edit/${group.id}`}
            hx-target="#app"
            hx-swap="innerHTML"
            hx-include="[name='groupName'], [name='temporaryGroup'], [name='selectedIcon'], [name='selectedColor']"
            class="bg-accent-blue py-[0.75rem] px-1 rounded-md w-32"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div class="flex flex-col">
        <div class="flex items-center space-x-4">
          <div id="icon-preview" class="flex items-center">
            <div
              id="icon-container"
              class="h-[3.875rem] aspect-square flex items-center justify-center"
            >
              <div
                class={`${
                  group.temporary === "true"
                    ? `border-[3px] border-dashed border-${group.color} rounded-sm`
                    : `bg-${group.color} rounded-sm`
                }  h-[3.875rem] aspect-square flex items-center justify-center`}
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
                    custom-color
                    class="w-[1.87rem] h-[1.87rem]"
                    src={group.icon}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-grow">
            <label class="text-font-off-white font-bold">Group Name</label>
            <input
              class="px-4 py-2 justify-center items-center text-font-off-white bg-primary-black rounded-md mt-2 w-full"
              type="text"
              name="groupName"
              value={group.name}
            />
          </div>
        </div>

        <label class="text-font-off-white justify-start semibold flex flex-col text-lg mt-[0.68rem]">
          Select Icon
        </label>
        <div
          id="select-group-icon-container"
          class="py-2 px-3  w-full h-fit flex justify-between bg-primary-black rounded-md mt-1"
        >
          <p class="text-primary-grey font-normal">Select Group Icon</p>
          <img
            src="/activeIcons/expand_more.svg"
            class="cursor-pointer w-[24px] aspect-square"
          />
        </div>
        <div
          id="select-group-icon-container-open"
          class="w-full h-fit bg-primary-black rounded-md mt-1 flex flex-col items-center animate-fade-in min-h-[50px] hidden"
        >
          <div
            id="select-group-icon-header"
            class="py-2 px-3 w-full h-fit flex justify-between"
          >
            <p class="text-primary-grey font-normal">Select Group Icon</p>
            <img
              src="/activeIcons/expand_more.svg"
              class="rotate-180 cursor-pointer"
            />
          </div>
          <hr class="border-t border-primary-dark-grey w-11/12 mx-auto px-2" />
          <SelectIcon
            icons={icons}
            colors={colors}
            selectedIcon={group.icon}
            selectedColor={group.color}
          />
        </div>

        {/* <div class="flex text-font-off-white mt-3 justify-center has-tooltip">
          <span class="tooltip mx-4 text-font-off-white -mt-8 shadow-lg bg-primary-dark-grey rounded-lg m-2 cursor-pointer p-1">
            Temporary groups will be deleted after 7 days
          </span>
          Temporary Group
          <img
            src="/activeIcons/info.svg"
            alt="Hover for more info"
            class="ml-2"
          />
        </div>
        <div class="flex text-font-off-white items-center justify-center ml-2">
          <input
            type="checkbox"
            name="temporaryGroup"
            id="temporaryGroup"
            class="mt-2 w-5 h-5 cursor-pointer"
            checked={group.temporary.toString() === "true"}
          />
        </div> */}
        <input
          type="hidden"
          name="selectedIcon"
          id="selectedIcon"
          value={group.icon}
        />
        <input
          type="hidden"
          name="selectedColor"
          id="selectedColor"
          value={group.color}
        />
        <span class="text-lg font-normal text-font-off-white mt-[1.31rem]">
          Add Members
        </span>
        <hr class="border-t border-primary-dark-grey w-full mt-[0.5rem] mb-[1rem]"></hr>
        <div class="flex flex-col w-full h-fit text-font-off-white mb-[1.19rem]">
          <InviteShareLink inviteShareLink={inviteShareLink} />
          <InviteMemberInput groupId={group.id} />
        </div>
        <span class="text-font-off-white">Members</span>
        {/* margin top is not applying here */}
        <div id="groupMembers">
          <GroupMembers
            memberDetails={group.members}
            currentUser={currentUser}
            groupId={group.id}
          />
        </div>

        <div
          id="errorContainer"
          class="text-accent-red bg-opacity-10 border border-accent-red p-4 rounded shadow hidden text-center mt-4"
        ></div>
      </div>
      <div class="mb-20"></div>
    </div>
  );
};

export default EditGroupPage;
