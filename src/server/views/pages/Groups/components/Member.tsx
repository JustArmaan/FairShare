import type { UserSchemaWithMemberType } from "../../../../interface/types";

export const AddedMember = ({
  user,
  groupId,
}: {
  user: UserSchemaWithMemberType;
  groupId?: string;
}) => {
  function formatEmail(email: string) {
    return email.length > 10 ? `${email.substring(0, 8)}...` : email;
  }

  return (
    <div
      class="flex justify-between items-center w-full py-2 space-x-4 mb-2"
      data-email={user.email}
    >
      <div class="w-10 h-10 rounded-full">
        <div
          class={`flex rounded-full bg-${user.color} h-10 w-10 justify-center`}
        >
          <span class="flex justify-center self-center text-center text-xl font-semibold">
            {user.firstName.split("", 1)}
            {user.lastName?.split("", 1)}
          </span>
        </div>
      </div>
      <div class="flex flex-col">
        <span class="text-font-off-white text-sm">{user.firstName}</span>
        {user.type === "currentUser" && (
          <span class="text-font-grey text-xs">You</span>
        )}
      </div>
      <div class="flex-grow text-font-off-white text-sm">
        {formatEmail(user.email)}
      </div>
      {user.type === "Owner" ? (
        <button class="py-2 px-2 bg-accent-purple text-font-off-white rounded-lg text-sm cursor-default">
          {"Owner"}
        </button>
      ) : (
        <>
          <button class="py-2 px-2 bg-accent-purple text-font-off-white rounded-lg text-sm cursor-default">
            {"Member"}
          </button>
          <button class="cursor-pointer">
            {groupId !== "" ? (
              <img
                id="delete-icon"
                src="/icons/delete.svg"
                hx-post={`/groups/deleteMember/${user.id}/${groupId}`}
                hx-trigger="click"
                class="delete-icon cursor pointer"
              />
            ) : (
              <img
                id="delete-icon"
                src="/icons/delete.svg"
                class="delete-icon cursor pointer"
              />
            )}
          </button>
        </>
      )}
      {/* <div class="w-10 h-1 bg-primary-grey rounded"></div> */}
    </div>
  );
};
