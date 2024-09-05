import {
  type InviteNotification,
  type CombinedNotification,
} from "../../../services/notification.service";
import type { getGroupOwnerWithGroupId } from "../../../services/group.service";
import type { ExtractFunctionReturnType } from "../../../services/user.service";

export type GroupOwner = ExtractFunctionReturnType<
  typeof getGroupOwnerWithGroupId
>;

export const NotificationList = (props: {
  inviteNotifications: InviteNotification[];
  notifications: CombinedNotification[];
  selectedSort: string;
}) => {
  return (
    <div id="notification-list" data-selected-sort={props.selectedSort}>
      <div class="flex justify-between mb-[1.38rem]">
        <div class="flex flex-col">
          <div class="hidden rotate-90"></div>
          {props.inviteNotifications.length > 0 && (
            <div
              hx-get={`/notification/notificationPicker?sort=${props.selectedSort}`}
              hx-target=".notification-selector-form"
              hx-swap="innerHTML"
              class="flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer"
            >
              <p class="text-font-off-white mr-3 text-xl">Sort By</p>
              <img
                class="h-3"
                src="/images/right-triangle.svg"
                alt="triangle icon"
              />
            </div>
          )}
        </div>
      </div>

      <div id="notification-container">
        {props.inviteNotifications.length > 0 && (
          <div class="animate-fade-in">
            <p class="text-primary-grey font-medium mb-1">Group Invites</p>
            {props.inviteNotifications.map((notification) => (
              <div
                hx-get={`/notification/reminder/${notification.notifications.id}?notificationTypeId=${notification.notifications.notificationTypeId}`}
                hx-trigger="load"
                hx-swap="outerHTML"
              />
            ))}
          </div>
        )}

        {props.notifications.length > 0 && (
          <div class="animate-fade-in">
            <p class="text-primary-grey font-medium mb-1">Notifications</p>
            {props.notifications.map((notification) => (
              <div
                hx-get={`/notification/reminder/${notification.notifications.id}?notificationTypeId=${notification.notifications.notificationTypeId}`}
                hx-trigger="load"
                hx-swap="outerHTML"
              />
            ))}
          </div>
        )}

        {props.inviteNotifications.length === 0 &&
          props.notifications.length === 0 && (
            <div>
              <p class="text-font-off-white font-semibold text-3xl">
                No Notifications
              </p>
            </div>
          )}
      </div>

      <div class="notification-selector-form" />
      <div
        hx-get={`/notification/notificationIcon`}
        hx-swap="outerHTML"
        hx-trigger="load"
        hx-target="#notification-icon"
      />
    </div>
  );
};
