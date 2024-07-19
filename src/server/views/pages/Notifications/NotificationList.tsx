import { Reminder } from "./components/Reminder";
import {
  type InviteNotification,
  type CombinedNotification,
} from "../../../services/notification.service";

export const NotificationList = (props: {
  inviteNotifications: InviteNotification[];
  notifications: CombinedNotification[];
  selectedSort: string;
}) => {
  return (
    <div id="notification-list">
      <div class="flex justify-between mb-[1.38rem]">
        <div class="flex flex-col">
          <div class="hidden rotate-90"></div>
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
        </div>
      </div>

      {props.inviteNotifications.length > 0 && (
        <div>
          <p class="text-primary-grey font-medium">Group Invites</p>
          {props.inviteNotifications.map((notification) => {
            return <Reminder notifications={notification} />;
          })}
        </div>
      )}

      {props.notifications.length > 0 && (
        <div>
          <p class="text-primary-grey font-medium">Notifications</p>
          {props.notifications.map((notification) => {
            return <Reminder notifications={notification} />;
          })}
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

      <div class="notification-selector-form" />
      <div class="mb-24"></div>
      <div
        hx-get={`/notification/notificationIcon`}
        hx-swap="outerHTML"
        hx-trigger="load"
        hx-target="#notification-icon"
      />
    </div>
  );
};
