export const Menu = (props: { value: boolean }) => {
  return (
    <div id="menuContainer">
      <div class="popup-menu">
        {props.value && (
          <div
            class={`menu ${
              props.value ? "menu-open" : "menu-close"
            } z-10 font-normal bg-font-black rounded-tl-[1rem] divide-font-off-white w-[18.25rem] dark:divide-font-off-white fixed bottom-[5.45rem] end-0 backdrop-blur-[50px]`}
          >
            <p class="text-[2rem] font-medium text-font-off-white ml-[2.25rem] mt-[1.87rem] mb-[2rem]">
              More
            </p>
            <div class="ml-[2.25rem] ">
              <input type="hidden" name="original" value="" />
              <ul class="text-sm" aria-labelledby="dropdownLargeButton">
                <li>
                  <a
                    hx-get="/transactions/transactionList"
                    hx-target="#app"
                    hx-push-url="/transactions/transactionList"
                    hx-swap="innerHTML"
                    hx-trigger="click"
                    class="text-font-off-white hover:cursor-pointer hover:opacity-80 block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-base"
                  >
                    View Recent Transactions
                    <li>
                      <a
                        hx-get="/institutions/page"
                        hx-target="#app"
                        hx-push-url="/institutions/page"
                        hx-swap="innerHTML"
                        hx-trigger="click"
                        class="text-font-off-white hover:cursor-pointer hover:opacity-80 block pt-[2rem] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-base "
                      >
                        My Budgets
                      </a>
                    </li>
                    <li>
                      <a
                        hx-get="/institutions/page"
                        hx-target="#app"
                        hx-push-url="/institutions/page"
                        hx-swap="innerHTML"
                        hx-trigger="click"
                        class="text-font-off-white hover:cursor-pointer hover:opacity-80 block pt-[2rem] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-base "
                      >
                        My Goals
                      </a>
                    </li>
                    <li>
                      <a
                        hx-get="/institutions/page"
                        hx-target="#app"
                        hx-push-url="/institutions/page"
                        hx-swap="innerHTML"
                        hx-trigger="click"
                        class="text-font-off-white hover:cursor-pointer hover:opacity-80 block pt-[2rem] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-base "
                      >
                        My Investments
                      </a>
                    </li>
                    <div class="w-[13.75rem] h-[0.0625rem] bg-primary-dark-grey self-center mt-[1.22rem]"></div>
                    <li>
                      <a
                        hx-get="/institutions/page"
                        hx-target="#app"
                        hx-push-url="/institutions/page"
                        hx-swap="innerHTML"
                        hx-trigger="click"
                        class="text-font-off-white hover:cursor-pointer hover:opacity-80 block pt-[1rem] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-base "
                      >
                        Manage Cards
                      </a>
                    </li>
                    <li>
                      <a
                        hx-get="/institutions/page"
                        hx-target="#app"
                        hx-push-url="/institutions/page"
                        hx-swap="innerHTML"
                        hx-trigger="click"
                        class="text-font-off-white hover:cursor-pointer hover:opacity-80 block pt-[2rem] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-base "
                      >
                        My Achievements
                      </a>
                    </li>
                    <li>
                      <a
                        hx-get="/institutions/page"
                        hx-target="#app"
                        hx-push-url="/institutions/page"
                        hx-swap="innerHTML"
                        hx-trigger="click"
                        class="text-font-off-white hover:cursor-pointer hover:opacity-80 block pt-[2rem] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-base "
                      >
                        History
                      </a>
                    </li>
                    <div class="w-[13.75rem] h-[0.0625rem] bg-primary-dark-grey self-center mt-[1.22rem]"></div>
                    <li>
                      <a
                        hx-get="/institutions/page"
                        hx-target="#app"
                        hx-push-url="/institutions/page"
                        hx-swap="innerHTML"
                        hx-trigger="click"
                        class="text-font-off-white hover:cursor-pointer hover:opacity-80 block pt-[1rem] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-base "
                      >
                        Profile & Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="/auth/logout"
                        class="text-font-off-white hover:cursor-pointer hover:opacity-80 block pt-[2rem] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-base mb-[2rem]"
                      >
                        Log Out
                      </a>
                    </li>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <a
        class="menu-a parent flex flex-col items-center text-font-off-white dark:text-white group cursor-pointer group-hover:text-accent-red"
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
