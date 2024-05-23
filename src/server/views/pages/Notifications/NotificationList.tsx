import { Reminder } from "./components/Reminder";
import { type Notification } from "../../../services/notification.service";

export const NotificationList = (props: { notifications: Notification[] }) => {
  return (
    <div>
      {props.notifications.length ? (
        <div>
          {props.notifications.map((notification) => {
            return <Reminder notifications={notification} />
          })}
          <p class="text-accent-blue flex justify-center self-center ">
            All up to date
          </p>
          <p class="text-primary-faded-black flex justify-center self-center ">
            Clear
          </p>
        </div>
      ) : (
        <div>
          <p class="text-font-off-white font-semibold text-3xl">
            No Notifications
          </p>
        </div>
      )}
    </div>
  );
};
