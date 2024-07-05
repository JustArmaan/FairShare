export const Nav = () => {
  <script
    src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"
    defer
  ></script>;
  return (
    <nav class="bg-font-black w-full fixed bottom-0 z-50">
      <ul class="flex justify-between items-center px-4 py-5">
        <li class="group w-1/6">
          <a
            class="parent flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-yellow cursor-pointer"
            hx-get="/home/page/default"
            hx-target="#app"
            hx-trigger="click"
            hx-swap="innerHTML"
            hx-push-url="/home/page/default"
          >
            <img
              id="homeIconInactive"
              class="h-6 block group-hover:hidden"
              src="/images/home.svg"
              alt="home icon"
            />
            <img
              id="homeIconActive"
              class="h-6 hidden group-hover:block relative left-px"
              src="/activeIcons/home.svg"
              alt="home icon"
            />
            <p id="homeText" class="mt-1 text-xs">
              Home
            </p>
          </a>
        </li>

        <li class="group w-1/6">
          <a
            class="parent flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-purple cursor-pointer"
            hx-get="/groups/page"
            hx-target="#app"
            hx-trigger="click"
            hx-swap="innerHTML"
            hx-push-url="/groups/page"
          >
            <img
              id="groupsIconInactive"
              class="h-6 block group-hover:hidden"
              src="/images/group.svg"
              alt="group icon"
            />
            <img
              id="groupsIconActive"
              class="h-6 hidden group-hover:block"
              src="/activeIcons/group.svg"
              alt="group icon"
            />
            <p id="groupsText" class="mt-1 text-xs">
              Groups
            </p>
          </a>
        </li>

        <div class="rounded-full bg-accent-blue size-12">
          <li class="flex justify-center items-center">
            <a
              href=""
              class="flex flex-col items-center text-font-off-white dark:text-white"
            >
              <img
                src="/images/moreButton.svg"
                alt="plus icon"
                class="p-2.5 mt-0.5"
              ></img>
            </a>
          </li>
        </div>
        <div
          class="group w-1/6"
          id="notification-icon"
          hx-get={`/notification/notificationIcon`}
          hx-swap="outerHTML"
          hx-trigger="load"
          hx-target="#notification-icon"
        >
          <a
            href=""
            class="parent relative flex flex-col items-center text-font-off-white dark:text-white text-sm group-hover:text-accent-green"
            hx-get="/notification/page"
            hx-target="#app"
            hx-trigger="click"
            hx-swap="innerHTML"
            hx-push-url="/notification/page"
          >
            <div class="relative w-fit h-fit">
              <img
                id="notificationsIconInactive"
                class="h-6 block group-hover:hidden"
                src="/images/notifications.svg"
                alt="notifications icon"
              />
              <img
                id="notificationsIconActive"
                class="h-6 hidden group-hover:block"
                src="/activeIcons/notif.svg"
                alt="notifications icon"
              />
            </div>
            <p id="notificationsText" class="mt-1 text-xs">
              Notifications
            </p>
          </a>
        </div>
        <li class="group w-1/6 relative">
          <div hx-get="/menu?open=false" hx-swap="outerHTML" hx-trigger="load">
            <a class="parent flex flex-col items-center text-font-off-white dark:text-white group cursor-pointer group-hover:text-accent-red">
              <img
                src="/images/menu.svg"
                alt="Menu Icon Inactive"
                class="h-6 p-1 block group-hover:hidden"
                id="menuIconInactive"
              />
              <img
                src="/activeIcons/menu.svg"
                alt="Menu Icon Active"
                class="h-6 p-1 hidden group-hover:block"
                id="menuIconActive"
              />
              <p class="mt-1 text-xs group-hover:text-accent-red">More</p>
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};
