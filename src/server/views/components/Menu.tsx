export const Menu = (props: { value: boolean }) => {
  return (
    <div id="menuContainer">
      <div class="popup-menu">
        {props.value && (
          <div class="menu display:none z-10 font-normal divide-y divide-font-off-white rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-font-off-white fixed bottom-[6rem] end-0 bg-font-black">
            <input type="hidden" name="original" value="" />
            <h1 class="text-lg text-font-off-white font-semibold mb-4 py-2">More</h1>
            <ul
              class="py-2 text-sm text-gray-700 dark:text-gray-400"
              aria-labelledby="dropdownLargeButton"
            >
              <li>
                <a
                  hx-get="/institutions/page"
                  hx-target="#app"
                  hx-push-url="/institutions/page"
                  hx-swap="innerHTML"
                  hx-trigger="click"
                  class="text-font-off-white hover:cursor-pointer hover:opacity-80 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Manage Institutions
                </a>
              </li>
            </ul>
            <div class="py-1">
              <a
                href="/auth/logout"
                class="block text-font-off-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Sign out
              </a>
            </div>
          </div>
        )}
      </div>
      <a
        class="parent flex flex-col items-center text-font-off-white dark:text-white group cursor-pointer group-hover:text-accent-red"
        hx-get={`/menu?open=${!props.value}`}
        hx-target="#menuContainer"
        hx-trigger="click"
        hx-swap="outerHTML"
      >
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
  );
};
