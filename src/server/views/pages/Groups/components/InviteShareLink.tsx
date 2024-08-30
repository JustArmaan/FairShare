import { maxCompanyNameLength } from "./PendingItem";

export const InviteShareLink = (props: { inviteShareLink: string }) => {
  return (
    <>
      <span class="text-font-off-white">Invite Share Link</span>
      <div class="bg-primary-black w-full rounded-md text-font-off-white flex justify-between px-4 py-2 mt-1 cursor-pointer">
        <div class="flex flex-row w-full justify-between">
          <p class="break-all" id="invite-link">
            {maxCompanyNameLength(props.inviteShareLink, 40)}
          </p>
          <img id="clipboard-icon" src="/activeIcons/content_copy.svg" />
        </div>
      </div>
    </>
  );
};
