export const Nav = () => {
  return (
    <nav class="bg-font-black w-full fixed bottom-0">
      <ul class="flex justify-between items-center px-4 py-2">
        <li class="group w-1/6">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-yellow"
            hx-get="/home"
            hx-target="#app"
            hx-trigger="click"
            hx-swap="innerHTML"
          >
            <img id="homeIcon" class="h-6 hover:hidden absolute" src="./images/home.svg" alt="home icon"  />
            <img class="h-6" src="./activeIcons/home.svg" alt="home icon"  />
            <p class="mt-1 text-sm">Home</p>
          </a>
        </li>
        <li class="group w-1/6">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-purple"
          >
            <img id="groupIcon" class="h-6" src="./images/group.svg" alt="group icon" />
            <p class="mt-1 text-sm">Groups</p>
          </a>
        </li>
          <div class="rounded-full bg-accent-blue size-10">
        <li class="flex justify-center items-center">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white"
          >
            <img
              src="/images/moreButton.svg"
              alt="More Icon"
              class="mt-2"
            ></img>
          </a>
        </li>
          </div>
        <li class="group w-1/6">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white text-sm group-hover:text-accent-green"
          >
            <img
            id="notifIcon"
              class="h-6"
              src="./images/notifications.svg"
              alt="notifications icon"
            />
            <p class="mt-1 text-sm">Notifications</p>
          </a>
        </li>
        <li class="group w-1/6">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white group-hover:accent-accent-red"
            hx-get="/menu"
            hx-target=".menu"
            hx-include="[name=original]"
            aria-label="Toggle menu"
          >
            <img src="/images/menu.svg" alt="Menu Icon" class="h-6 p-1" id="moreIcon"></img>
            <p class="mt-1 text-sm">More</p>
          </a>
        </li>
      </ul>
    </nav>
  );
};
