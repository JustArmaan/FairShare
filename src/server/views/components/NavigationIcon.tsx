export const NotificationIcon = ({
  userId,
  notificationCount,
}: {
  userId: string;
  notificationCount: number;
}) => {
  return (
    <li class="group w-1/6 relative" id="notification-icon">
      <a
        href=""
        class="parent relative  flex flex-col items-center text-font-off-white dark:text-white text-sm group-hover:text-accent-green"
        hx-get="/notification/page"
        hx-target="#app"
        hx-trigger="click"
        hx-swap="innerHTML"
        hx-push-url="/notification/page"
      >
        <div class="relative w-fit h-fit hover:child-hidden">
          {notificationCount > 0 && (
            <div class="border-font-black border-2 text-font-off-white text-xs rounded-full bg-accent-red w-5 h-5 aspect-square absolute -top-1.5 -right-2.5 z-10 flex items-center justify-center">
              <p class="font-semibold">{notificationCount}</p>
            </div>
          )}
          <img
            id="notifIcon"
            class="child h-6 absolute"
            src="/images/notifications.svg"
            alt="notifications icon"
          />
          <img
            class="h-6"
            src="/activeIcons/notif.svg"
            alt="notifications icon"
          />
        </div>
        <p class="mt-1 text-xs">Notifications</p>
      </a>
    </li>
  );
};
