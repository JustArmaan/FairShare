import type { UserSchemaWithMemberType } from '../../../../interface/types';

export const AddedMember = ({ user, groupId }: { user: UserSchemaWithMemberType, groupId?: string }) => {
  function formatEmail(email: string) {
    return email.length > 10 ? `${email.substring(0, 8)}...` : email;
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
        {user.type === 'currentUser' && (
          <span class="text-font-grey text-xs">You</span>
        )}
      </div>
      <div class="flex-grow text-font-off-white text-sm">
        {formatEmail(user.email)}
      </div>
      {user.type === 'Owner' || !groupId  ? (
        <button class="py-2 px-4 bg-accent-purple text-font-off-white rounded-lg text-sm cursor-default">
          {'Owner'}
        </button>
      ) : (
        <>
          <button class="py-2 px-4 bg-accent-purple text-font-off-white rounded-lg text-sm cursor-default">
            {'Member'}
          </button>
          <button class="cursor-pointer">
            <img
              src="/icons/delete.svg"
              hx-post={`/groups/deleteMember/${user.id}/${groupId}`}
            />
          </button>
        </>
      )}
      {/* <div class="w-10 h-1 bg-primary-grey rounded"></div> */}
    </div>
  );
};
