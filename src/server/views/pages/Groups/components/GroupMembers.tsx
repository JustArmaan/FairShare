import { group } from "console";
import {
  type UserSchema,
  type UserSchemaWithMemberType,
} from "../../../../interface/types";
import { ProfileIcon } from "../../../components/ProfileIcon";

export const GroupMembers = ({
  memberDetails,
  currentUser,
  groupId,
}: {
  memberDetails: UserSchemaWithMemberType[];
  currentUser: UserSchema;
  groupId: string;
}) => {
  const owner = memberDetails.find((member) => member.type === "Owner");
  return (
    <div class="flex-col bg-primary-black w-full rounded-sm m-1 p-2">
      {memberDetails.map((member) => {
        return (
          <div class="flex flex-row w-full">
            <div class="flex items-center justify-center w-fit p-2">
              <ProfileIcon user={member} class="w-8 h-8" textSize="text-md" />
            </div>
            {/*<div
              class={`flex flex-row rounded-full bg-${member.color} h-[2rem] w-[2rem] m-[0.88rem] justify-center items-center`}
            >
              <span class="flex justify-center self-center text-center text-sm font-semibold mt-[0.4rem]">
                {member.firstName?.split("", 1) ?? ""}
                {member.lastName?.split("", 1) ?? ""}
              </span>
            </div>*/}
            <div class="flex flex-col text-center self-center justify-center ml-4 place-items-start">
              <div class="flex flex-row">
                <p class="text-font-off-white text-[0.875rem] font-medium">
                  {member.firstName}
                </p>
                {member.id === currentUser.id && (
                  <div class="flex flex-row h-[0.8125rem] w-[2.125rem] bg-accent-purple rounded-[0.250rem] self-center justify-center items-center ml-[0.30rem]">
                    <p class="font-normal text-font-off-white text-[0.625rem] text-center">
                      You
                    </p>
                  </div>
                )}
              </div>
              <p class="text-font-grey flex w-fit text-[0.625rem] font-normal justify-start">
                {member.email}
              </p>
            </div>
            <p class="flex-auto w-fit text-sm self-center mr-[2.81rem] justify-end ">
              <p class="flex text-font-grey w-fit text-sm font-medium self-center justify-end items-center">
                <span class="mr-[0.75rem]">{member.type}</span>
                {owner && owner.id === member.id ? (
                  <div class="mr-[0.94rem] h-[1.425rem] w-[1.25rem]"></div>
                ) : owner && owner.id === currentUser.id ? (
                  <a
                    hx-post={`/groups/deleteMember/${member.id}/${groupId}`}
                    hx-trigger="click"
                    hx-swap="innerHTML"
                    class="text-font-off-white text-4xl cursor-pointer mr-[0.94rem]"
                  >
                    <img
                      src="/icons/doNotDisturb.svg"
                      alt="delete icon"
                      class="hover:-translate-y-0.5 transition-transform hover:opacity-80 w-[1.25rem]"
                    />
                  </a>
                ) : (
                  <div class="mr-[0.94rem] h-[1.425rem] w-[1.25rem]"></div>
                )}
              </p>
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default GroupMembers;
