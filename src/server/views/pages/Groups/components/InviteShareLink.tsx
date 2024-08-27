export const InviteShareLink = (props: { inviteShareLink: string }) => {
  return (
    <>
      <span class="text-font-off-white">Invite Share Link</span>
      <div class="bg-primary-black w-full rounded-md text-font-off-white flex justify-between px-4 py-2 mt-1 cursor-pointer">
        <span id="invite-link">{props.inviteShareLink}</span>
        <img id="clipboard-icon" src="/activeIcons/content_copy.svg" />
      </div>
    </>
  );
};
