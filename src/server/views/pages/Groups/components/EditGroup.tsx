import { type UserSchema } from "../../../../interface/types";
import { AddedMember } from "./Member";
import { getGroupWithMembers } from "../../../../services/group.service";
import AddMembersComponent from "./AddMemberForm";
import GroupMembers from "./GroupMembers";

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
}: {
  currentUser: UserSchema;
  group: UserGroupSchema;
  inviteShareLink: string;
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
        <label class="text-font-off-white justify-start bold">Group Name</label>
        <input
          class="px-4 py-2 justify-center items-center text-font-off-white bg-primary-black rounded-md mt-2"
          type="text"
          name="groupName"
          value={group.name}
        />
        <label class="text-font-off-white justify-start semibold flex flex-col text-lg mt-[0.68rem]">
          Select Icon
        </label>
        <div
          id="select-group-icon"
          hx-get={`/groups/selectIcon?selectedIcon=${group.icon}&selectedColor=${group.color}`}
          hx-trigger="click"
          hx-swap="outerHTML"
          hx-target="#select-group-icon"
          class="py-2 px-3  w-full h-fit flex justify-between bg-primary-black rounded-md mt-1"
        >
          <p class="text-primary-grey font-normal">Select Group Icon</p>
          <img src="/activeIcons/expand_more.svg" />
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
          <span class="text-font-off-white">Invite Share Link</span>
          <div class="bg-primary-black w-full rounded-md text-font-off-white flex justify-between px-4 py-2 mt-1">
            <span id="invite-link">{inviteShareLink}</span>
            <img id="clipboard-icon" src="/activeIcons/content_copy.svg" />
          </div>
          <span class="text-font-off-white mt-4">Email or Phone Number</span>
          <div class="flex w-full">
            <form
              hx-post={`/groups/addMember/${group.id}`}
              hx-target="#groupMembers"
              hx-swap="innerHTML"
              class="flex w-full"
            >
              <input
                // id="invite-input"
                class="bg-primary-black rounded-md w-full text-font-off-white flex justify-between px-2 mt-1 placeholder-primary-grey placeholder-font-light mr-3"
                type="text"
                name="emailOrPhone"
                placeholder="Enter email or phone number"
              />
              <button
                // id="send-invite-button"
                type="submit"
                class="bg-accent-blue rounded-md px-4 flex mt-1 items-center"
              >
                <p class="text-sm font-normal">Send Invite</p>
              </button>
            </form>
          </div>
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
