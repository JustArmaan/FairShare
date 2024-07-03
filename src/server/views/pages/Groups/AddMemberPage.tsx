import type { UserSchema } from "../../../interface/types";
import { type GroupWithMembers } from "../../../services/group.service";
import GroupMembers from "./components/GroupMembers";

export const AddMembersPage = (props: {
  group: GroupWithMembers;
  currentUser: UserSchema;
}) => {
  return (
    <div class="animate-fade-in">
      <a
        hx-get={`/groups/view/${props.group.id}`}
        hx-trigger="click"
        hx-target="#app"
        hx-swap="innerHTML"
        hx-push-url={`/groups/view/${props.group.id}`}
        class="text-font-off-white text-4xl cursor-pointer my-2"
      >
        <img
          src="/icons/arrow_back_ios.svg"
          alt="back arrow icon"
          class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
        />
      </a>
      <div class="bg-primary-black rounded-md w-full h-fit p-4 flex relative items-center mt-[2rem] mb-[1.31rem]">
        <div
          class={`flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center bg-${props.group.color}`}
        >
          <img src={props.group.icon} alt="Group Icon" class="w-6 h-6" />{" "}
        </div>
        <div class="flex">
          <span class="text-font-off-white font-light ml-2 text-lg">
            Group Name:
          </span>
          <span class="text-font-off-white font-semibold flex-grow ml-1 text-lg">
            {props.group.name}
          </span>
        </div>

        <button class="absolute top-0 right-0 mt-3 mr-3 text-font-off-white text-sm">
          Edit
        </button>
      </div>
      <span class="text-lg font-normal text-font-off-white mt-[1.31rem]">
        Add Members
      </span>
      <hr class="border-t border-primary-dark-grey w-full mt-[0.5rem] mb-[1rem]"></hr>
      <div class="flex flex-col w-full h-fit text-font-off-white">
        <span class="text-font-off-white">Invite Share Link</span>
        <div class="bg-primary-black w-full rounded-md text-font-off-white flex justify-between px-4 py-2 mt-1">
          <span>this will be where the link goes</span>
          <img src="/activeIcons/content_copy.svg" />
        </div>
        <span class="text-font-off-white mt-4">Email or Phone Number</span>
        <div class="flex w-full">
          <input
            class="bg-primary-black rounded-md w-full text-font-off-white flex justify-between px-2 mt-1 placeholder-primary-grey placeholder-font-light "
            type="text"
            name="groupName"
            placeholder="Enter Email or Phone Number"
          />
          <button class="bg-accent-blue rounded-md px-4 text-light flex ml-2">
            Send Invite
          </button>
        </div>
      </div>
      {/* <p class="text-font-off-white font-normal text-sm ">
        Email or Phone number
      </p>
      <div>
        <input
          type="text"
          class="w-full bg-primary-black rounded-md p-2 text-font-off-white border border-primary-dark-grey"
        ></input>
        <button
          hx-swap="innerHTML"
          hx-get={``}
          hx-target="#app"
          hx-push-url={``}
          class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold bg-accent-blue rounded-xl text-font-off-white w-[6.125rem] h-[2.5rem]"
        >
          Send Invite
        </button>
      </div> */}
      <span class="text-font-off-white mt-[1.19rem]">Members</span>
      {/* margin top is not applying here */}
      <GroupMembers
        memberDetails={props.group.members}
        currentUser={props.currentUser}
      />
    </div>
  );
};
