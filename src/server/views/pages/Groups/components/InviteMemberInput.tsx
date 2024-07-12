export const InviteMemberInput = (props: { groupId: string }) => {
  return (
    <>
      <span class="text-font-off-white mt-4">Email or Phone Number</span>
      <div class="flex w-full">
        <form
          hx-post={`/groups/addMember/${props.groupId}`}
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
    </>
  );
};
