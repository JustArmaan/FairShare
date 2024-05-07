import { type UserSchema } from "../../../../interface/types";
interface member {
  name: string;
  owe: string;
  profile?: string;
  purchase?: string;
}

export const Members = ({
  memberDetails,
  currentUser,
}: {
  memberDetails: member[];
  currentUser: UserSchema;
}) => {
  return (
    <div class="flex flex-wrap items-center">
      <div class="flex bg-primary-black h-16 md:w-full w-[11.4rem] rounded-lg m-1 items-center">
        <img
          src={
            currentUser?.picture || "https://source.unsplash.com/user/wsanter"
          }
          alt="Profile Picture"
          class="h-12 w-12 rounded-full m-2 justify-between"
        ></img>
        <div class="flex flex-col text-center self-center items-center justify-center ml-4 ">
          <p class="text-font-off-white flex w-fit">{currentUser?.firstName}</p>
          <p class="text-font-off-white flex w-fit text-sm">You</p>
        </div>
      </div>
      {memberDetails.map((member) => (
        <div class="flex bg-primary-black h-16 md:w-full w-[11.4rem] rounded-lg m-1 items-center">
          <img
            src="https://source.unsplash.com/user/wsanter"
            class="h-12 w-12 rounded-full m-2 justify-between"
          ></img>
          <div class="flex flex-col text-center self-center items-center justify-center ml-4 ">
            <p class="text-font-off-white flex w-fit">{member.name}</p>
            <p class="text-negative-number flex w-fit text-sm">
              $
              <span class="text-negative-number flex w-fit text-sm font-semibold">
                {member.owe}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Members;
