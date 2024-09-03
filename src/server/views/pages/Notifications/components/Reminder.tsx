import type { UserSchema } from "../../../../interface/types";
import type { getGroupOwnerWithGroupId } from "../../../../services/group.service";
import {
  type InviteNotification,
  type CombinedNotification,
  type GenericNotification,
} from "../../../../services/notification.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";
import { ProfileIcon } from "../../../components/ProfileIcon";

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
    const now = Date.now();
    const date = new Date(timestamp);
    const diff = Math.floor((now - date.getTime()) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    const months = Math.floor(days / 30);
    if (months < 12)
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    const years = Math.floor(days / 365);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  };

  const { notifications } = props;

  let message: string | JSX.Element = "";
  let iconSrc: string | undefined;
  let iconColor: string | undefined;
  let sender: UserSchema | undefined;

  if (isInviteNotification(notifications)) {
    message = (
      <>
        Invite to join{" "}
        <span class="font-semibold">"{notifications.groups.name}"</span>
      </>
    );
  } else if (isGenericNotification(notifications)) {
    message = notifications.genericNotification.message || "No message.";
    iconSrc = (notifications as GenericNotification).genericNotification.icon;
    iconColor = (notifications as GenericNotification).genericNotification
      .color;

    sender = (notifications as GenericNotification).users;
  } else if (isGroupNotification(notifications)) {
    message = notifications.groupNotification.message || "No message.";
    sender = (notifications as CombinedNotification).users;
  }

  return (
    <div class="animate-fade-in mb-[1.25rem]">
      <div class="bg-primary-black rounded-xl shadow-[0_3px_2px_0_rgba(0,0,0,0.25)] mb-1 flex justify-between relative px-3 items-center pb-1 py-4 ">
        <div class="h-20 w-20 flex-col items-center justify-center flex mr-[1rem]">
          <ProfileIcon
            user={sender ? sender : props.groupOwner!}
            class="h-[4rem] w-[4rem]"
          />
        </div>
        <div class="flex flex-col w-full justify-center">
          <div class="flex justify-between items-center w-full mt-2">
            <div class="flex flex-col mr-[1rem] leading-5 ">
              <p class="text-font-off-white">{message}</p>
              <span class="text-font-grey font-normal text-xs align-top mt-[0.25rem]">
                Sent by {sender ? sender.firstName : props.groupOwner!}
              </span>
            </div>
            {!isInviteNotification(notifications) && (
              <span class="text-xs text-font-grey m-2.5 items-end right-0 top-0 absolute">
                {timeAgo(notifications.notifications.timestamp) ===
                "0 seconds ago"
                  ? "Now"
                  : timeAgo(notifications.notifications.timestamp)}
              </span>
            )}
          </div>
          <div class="mt-2">
            {isInviteNotification(notifications) && (
              <form class="w-full flex flex-row justify-start">
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
                  class="flex items-center mr-4 justify-center py-2 bg-accent-blue text-font-off-white rounded-md hover:-translate-y-0.5 cursor-pointer transition-all w-[6.875rem] h-[1.875rem] mb-[0.60rem]"
                  hx-post={`/groups/member/accept/userToGroupId=${notifications.groupInvite.userGroupId}/notificationId=${notifications.notifications.id}`}
                  hx-target="#app"
                  hx-swap="innerHTML"
                  hx-trigger="click"
                >
                  <span class="font-semibold">Confirm</span>
                </button>
                <button
                  class="py-2 flex items-center justify-center border-accent-blue border-[1px] text-font-off-white rounded-md hover:-translate-y-0.5 cursor-pointer transition-all w-[6.875rem] h-[1.875rem]  mb-[0.60rem]"
                  hx-post={`/groups/member/decline/groupId=$userToGroupId=${notifications.groupInvite.userGroupId}/notificationId=${notifications.notifications.id}`}
                  hx-target="#app"
                  hx-swap="innerHTML"
                  hx-trigger="click"
                >
                  <span class="font-semibold">Delete</span>
                </button>
              </form>
            )}
          </div>
        </div>
        {(notifications.notifications.readStatus === false ||
          timeAgo(notifications.notifications.timestamp) ===
            "0 seconds ago") && (
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
