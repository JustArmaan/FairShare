export const Nav = () => {
  <script
    src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"
    defer
  ></script>;
  return (
    <nav class="bg-font-black w-full fixed bottom-0">
      <ul class="flex justify-between items-center px-4 py-5">
        <li class="group w-1/6 ">
          <a
            class=" parent hover:child-hidden flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-yellow"
            hx-get="/home"
            hx-target="#app"
            hx-trigger="click"
            hx-swap="innerHTML"
          >
            <img
              id="homeIcon"
              class="child h-6 absolute"
              src="./images/home.svg"
              alt="home icon"
            />
            <img class="h-6" src="./activeIcons/home.svg" alt="home icon" />
            <p class="mt-1 text-xs">Home</p>
          </a>
        </li>
        <li class="group w-1/6">
          <a
            href="#"
            class="parent hover:child-hidden flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-purple"
          >
            <img
              id="groupIcon"
              class=" child h-6 absolute"
              src="./images/group.svg"
              alt="group icon"
            />
            <img class="h-6" src="./activeIcons/group.svg" alt="group icon" />
            <p class="mt-1 text-xs">Groups</p>
          </a>
        </li>
        <div class="rounded-full bg-accent-blue size-12">
          <li class="flex justify-center items-center">
            <a
              href="#"
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
        <li class="group w-1/6">
          <a
            href="#"
            class="parent hover:child-hidden flex flex-col items-center text-font-off-white dark:text-white text-sm group-hover:text-accent-green"
          >
            <img
              id="notifIcon"
              class=" child h-6 absolute"
              src="./images/notifications.svg"
              alt="notifications icon"
            />
            <img
              class="h-6"
              src="./activeIcons/notif.svg"
              alt="notifications icon"
            />
            <p class="mt-1 text-xs">Notifications</p>
          </a>
        </li>
        <li class="group w-1/6">
          <a
            href="#"
            class="parent hover:child-hidden flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-red"
            hx-get="/menu"
            hx-target=".menu"
            hx-include="[name=original]"
            aria-label="Toggle menu"
          >
            <img
              src="/images/menu.svg"
              alt="Menu Icon"
              class="h-6 p-1"
              id="moreIcon"
            ></img>
            <p class="mt-1 text-xs">More</p>
          </a>
        </li>
      </ul>
    </nav>
  );
};
