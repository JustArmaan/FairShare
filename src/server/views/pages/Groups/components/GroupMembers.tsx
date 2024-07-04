import {
  type UserSchema,
  type UserSchemaWithMemberType,
} from "../../../../interface/types";

export const GroupMembers = ({
  memberDetails,
  currentUser,
}: {
  memberDetails: UserSchemaWithMemberType[];
  currentUser: UserSchema;
}) => {
  console.log("members2", memberDetails);
  return (
    <div class="flex-col bg-primary-black w-full rounded-sm m-1">
      {memberDetails.map((member) => {
        return (
          <div class="flex flex-row w-full">
            <div
              class={`flex-row rounded-full bg-${member.color} h-[2.5rem] w-[2.5rem] m-[0.88rem] justify-center`}
            >
              <span class="flex justify-center self-center text-center text-xl font-semibold mt-[0.4rem]">
                {member.firstName?.split("", 1) ?? ""}
                {member.lastName?.split("", 1) ?? ""}
              </span>
            </div>
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
              <p class="flex text-font-grey w-fit text-sm font-medium self-center justify-end">
                <span class="mr-[0.75rem]">
                  {
                    //@ts-ignore
                    member.type === "Owner" ? "Owner" : "Member"
                  }
                </span>
                {member.type !== "Owner" ? (
                  <a
                    hx-get={``}
                    hx-trigger="click"
                    hx-target="#app"
                    hx-swap="innerHTML"
                    hx-push-url={``}
                    class="text-font-off-white text-4xl cursor-pointer mr-[0.94rem]"
                  >
                    <img
                      src="/icons/doNotDisturb.svg"
                      alt="back arrow icon"
                      class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
                    />
                  </a>
                ) : (
                  <div class="mr-[0.94rem] h-[1.425rem] w-[2.06rem]"></div>
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
