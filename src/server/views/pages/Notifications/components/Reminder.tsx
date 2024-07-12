import {
  type InviteNotification,
  type CombinedNotification,
} from "../../../../services/notification.service";

function isInviteNotification(
  notification: any
): notification is InviteNotification {
  return notification.groupInvite !== undefined;
}

function isGenericNotification(
  notification: any
): notification is CombinedNotification & {
  genericNotification: { message: string; notificationId: string };
} {
  return notification.genericNotification !== undefined;
}

function isGroupNotification(
  notification: any
): notification is CombinedNotification & {
  groupNotification: { message: string; notificationId: string };
} {
  return notification.groupNotification !== undefined;
}

export const Reminder = (props: {
  notifications: InviteNotification | CombinedNotification;
}) => {
  const timeAgo = (timestamp: string) => {
    const now = Date.now();
    const date = new Date(timestamp);
    const dateMillis = date.getTime();
    const diff = Math.floor((now - dateMillis) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const { notifications } = props;

  let message = "";

  if (isInviteNotification(notifications)) {
    message = "You have a new group invite.";
  } else if (isGenericNotification(notifications)) {
    message = notifications.genericNotification.message || "No message.";
  } else if (isGroupNotification(notifications)) {
    message = notifications.groupNotification.message || "No message.";
  }

  return (
    <div class="animate-fade-in mb-[1.25rem]">
      <div class="bg-primary-black rounded-xl shadow-[0_3px_2px_0_rgba(0,0,0,0.25)] mb-1 flex items-center justify-between relative h-[5.6875rem] ">
        <div class="flex items-center w-full">
          <div class="flex p-3 pl-4 pr-4 mr-4 ml-4 bg-accent-red rounded-xl self-center items-center justify-center ">
            <div class="flex items-center justify-center w-10 h-10">
              <img src="/groupIcons/groups.svg" alt="" class="w-10" />
            </div>
          </div>
          <div class="flex flex-col w-full">
            <div class="flex justify-between items-center w-full">
              <p class="text-font-off-white font-semibold mt-6 w-[17rem]">
                {message}
              </p>
              <span class="text-xs text-font-grey m-2.5 items-end right-0 top-0 absolute">
                {timeAgo(notifications.notifications.timestamp)}
              </span>
            </div>
            <div class="flex justify-end mt-4">
              {isInviteNotification(notifications) && (
                <div class="flex">
                  <form>
                    <input
                      type="hidden"
                      name="notificationId"
                      value={notifications.notifications.id}
                    />
                    <input
                      type="hidden"
                      name="userToGroupId"
                      value={notifications.groupInvite.userGroupId}
                    />
                    <button
                      class="bg-accent-blue text-font-off-white rounded-md hover:-translate-y-0.5 cursor-pointer transition-all w-[6.875rem] h-[1.875rem]  mr-4 mb-[0.60rem]"
                      hx-post={`/groups/member/accept/userToGroupId=${notifications.groupInvite.userGroupId}/notificationId=${notifications.notifications.id}`}
                      hx-target="#app"
                      hx-swap="innerHTML"
                      hx-trigger="click"
                    >
                      Confirm
                    </button>
                    <button
                      class="border-accent-blue border-[1px] text-font-off-white rounded-md hover:-translate-y-0.5 cursor-pointer transition-all w-[6.875rem] h-[1.875rem] mr-[2.69rem] mb-[0.60rem]"
                      hx-post={`/groups/member/decline/groupId=$userToGroupId=${notifications.groupInvite.userGroupId}/notificationId=${notifications.notifications.id}`}
                      hx-target="#app"
                      hx-swap="innerHTML"
                      hx-trigger="click"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
        {notifications.notifications.readStatus === false && (
          <>
            <span class="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-accent-blue opacity-100 right-5 top-[50%]"></span>
            <span class="absolute inline-flex h-2.5 w-2.5 rounded-full bg-accent-blue opacity-100 right-5 top-[50%] z-20"></span>
          </>
        )}
      </div>
    </div>
  );
};

export default Reminder;
