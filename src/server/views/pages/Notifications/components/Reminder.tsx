import type { getGroupOwnerWithGroupId } from "../../../../services/group.service";
import {
  type InviteNotification,
  type CombinedNotification,
} from "../../../../services/notification.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";

export type GroupOwner = ExtractFunctionReturnType<
  typeof getGroupOwnerWithGroupId
>;

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
  groupOwner?: GroupOwner;
}) => {
  const timeAgo = (timestamp: string) => {
    console.log(timestamp, "timestamp");
    const now = Date.now();
    const date = new Date(timestamp);
    const diff = Math.floor((now - date.getTime()) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(days / 365);
    return `${years} years ago`;
  };

  const { notifications } = props;

  let message = "";

  if (isInviteNotification(notifications)) {
    message = `Invite from to join "${notifications.groups.name}"`;
  } else if (isGenericNotification(notifications)) {
    message = notifications.genericNotification.message || "No message.";
  } else if (isGroupNotification(notifications)) {
    message = notifications.groupNotification.message || "No message.";
  }

  console.log(notifications, "notifications");

  return (
    <div class="animate-fade-in mb-[1.25rem]">
      <div class="bg-primary-black rounded-xl shadow-[0_3px_2px_0_rgba(0,0,0,0.25)] mb-1 flex justify-between relative h-[5.6875rem] ">
        <div class="flex w-full">
          <div
            class={`flex rounded-full bg-${props.groupOwner?.color} h-[4.1875rem] p-4 m-3 justify-center w-[4.1875rem] items-center`}
          >
            <span class="flex justify-center self-center text-center text-2xl font-bold">
              {props.groupOwner?.firstName.split("", 1)}
              {props.groupOwner?.lastName?.split("", 1)}
            </span>
          </div>
          <div class="flex flex-col w-full">
            <div class="flex justify-between items-center w-full">
              <div class="flex-row">
                <p class="text-font-off-white font-normal mt-[0.30rem] w-[17rem]">
                  {message}
                </p>
                <span class="text-font-grey font-normal text-xs mt-[0.25rem] align-top">
                  Sent from {props.groupOwner?.firstName}
                </span>
              </div>
              <span class="text-xs text-font-grey m-2.5 items-end right-0 top-0 absolute">
                {timeAgo(notifications.notifications.timestamp)}
              </span>
            </div>
            <div class="flex justify-end">
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
