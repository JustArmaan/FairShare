import type { UserSchema } from "../../../../interface/types";
import type { MemberTypeSchema } from "../../../../services/group.service";

type UserProps = {
  user:
    | { type: "member"; id: string; firstName: string; email: string }
    | { type: "currentUser"; id: string; firstName: string; email: string };
};

export const AddedMember = ({ user }: { user: UserSchema }) => {
  function formatEmail(email: string) {
    return email.length > 10 ? `${email.substring(0, 15)}...` : email;
  }

  return (
    <div
      class="flex justify-between items-center w-full border-b border-primary-grey py-2 space-x-4 mb-2"
      data-email={user.email}
    >
      <img
        src="/activeIcons/profile-pic-icon.svg"
        alt={`${user.firstName}'s profile picture`}
        class="w-6 h-6 rounded-full bg-font-off-white"
      />
      <div class="flex flex-col flex-grow">
        <span class="text-font-off-white text-sm">{user.firstName}</span>
        {user.type === "currentUser" && (
          <span class="text-font-grey text-xs">You</span>
        )}
      </div>
      <div class="flex-grow text-font-off-white text-sm">
        {formatEmail(user.email)}
      </div>
      {user.type === "Owner" ? (
        <button class="py-2 px-4 bg-accent-purple text-font-off-white rounded-lg text-sm cursor-default">
          {"Owner"}
        </button>
      ) : (
        <>
          <button class="py-2 px-4 bg-accent-purple text-font-off-white rounded-lg text-sm cursor-default">
            {"Member"}
          </button>
          <button class="cursor-default">
            <img src="/icons/delete.svg" />
          </button>
        </>
      )}
      {/* <div class="w-10 h-1 bg-primary-grey rounded"></div> */}
    </div>
  );
};
