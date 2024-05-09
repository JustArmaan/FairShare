import { type UserSchema } from '../../../../interface/types';

export const Members = ({
  memberDetails,
  currentUser,
}: {
  memberDetails: UserSchema[];
  currentUser: UserSchema;
}) => {
  return (
    <div class="flex flex-wrap items-center">
      {memberDetails.map((member) => (
        <div class="flex bg-primary-black h-16 md:w-full w-[11.4rem] rounded-lg m-1 items-center">
          <img
            src={member.picture || 'activeIcons/profile-pic-icon.svg'}
            class="h-12 w-12 rounded-full m-2 justify-between"
          ></img>
          <div class="flex flex-col text-center self-center items-center justify-center ml-4 ">
            <p class="text-font-off-white flex w-fit">{member.firstName}</p>

            {member.id === currentUser.id ? (
              <p class="text-font-off-white flex w-fit text-sm">You</p>
            ) : (
              <p class="text-negative-number flex w-fit text-sm">
                $
                <span class="text-negative-number flex w-fit text-sm font-semibold">
                  {(Math.random() * 40).toFixed(2)}
                </span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Members;
