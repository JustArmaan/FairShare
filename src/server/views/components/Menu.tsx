export const Menu = () => {
  return (
    <>
      <div
        class="menu display:none z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 fixed bottom-[6rem] end-0 bg-font-off-white"
        hx-trigger="click"
        hx-get="/empty"
        hx-target=".menu"
      >
        <input type="hidden" name="original" value="" />
        <ul
          class="py-2 text-sm text-gray-700 dark:text-gray-400"
          aria-labelledby="dropdownLargeButton"
        >
          <li>
            <a
              href=""
              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Dashboard
            </a>
          </li>
          {/* <li>
            <a
              href=""
              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Settings
            </a>
          </li>
          <li>
            <a
              href=""
              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Earnings
            </a>
          </li> */}
        </ul>
        <div class="py-1">
          <a
            href="/logout"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            Sign out
          </a>
        </div>
      </div>
      <div class="absolute bottom-[0.016rem] left-[1.12rem] " >
      <a
            class="parent flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-red"
            hx-get="/empty"
            hx-target="#Div"
            hx-trigger="click"
          >
            <img
              src="/images/menu.svg"
              alt="Menu Icon"
              class="h-6 p-1"
              id="moreIcon"
            ></img>
            <p class="mt-1 text-xs">More</p>
          </a>
      </div>
       
    </>
  );
};
