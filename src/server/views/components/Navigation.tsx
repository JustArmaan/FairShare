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
            <img class="h-6" src="./images/home.svg" alt="home icon" />
            <p class="mt-1 text-sm">Home</p>
          </a>
        </li>
        <li class="group w-1/6">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-purple"
          >
            <img class="h-6" src="./images/group.svg" alt="group icon" />
            <p class="mt-1 text-sm">Groups</p>
          </a>
        </li>
        <li class="flex justify-center items-center">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white"
          >
            <img
              src="/images/moreButton.svg"
              alt="More Icon"
              class="h-[70px] w-[70px] mt-1"
            ></img>
          </a>
        </li>
        <li class="group w-1/6">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white text-sm group-hover:text-accent-green"
          >
            <img
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
          >
            <img src="/images/menu.svg" alt="Menu Icon" class="h-6 p-1"></img>
            <p class="mt-1 text-sm">More</p>
          </a>
        </li>
      </ul>
    </nav>
  );
};
