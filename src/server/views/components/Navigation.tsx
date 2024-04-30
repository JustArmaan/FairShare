export const Nav = () => {
    return (
      <nav class="bg-font-black w-full fixed bottom-0">
        <ul class="flex justify-between items-center px-4 py-2">
          <li>
              <a href="#" class="flex flex-col items-center text-font-off-white dark:text-white hover:underline" hx-get="/home" hx-target=".page">
                  <img src="/images/home.svg" alt="Home Icon"></img>
                  Home
              </a>
          </li>
          <li>
              <a href="#" class="flex flex-col items-center text-font-off-white dark:text-white hover:underline">
                  <img src="/images/group.svg" alt="Group Icon" class="mb-1"></img>
                  Groups
              </a>
          </li>
          <li class="flex justify-center items-center">
              <a href="#" class="flex flex-col items-center text-font-off-white dark:text-white hover:underline">
                  <img src="/images/moreButton.svg" alt="More Icon" class="max-w-12"></img>
              </a>
          </li>
          <li>
              <a href="#" class="flex flex-col items-center text-font-off-white dark:text-white hover:underline text-sm">
                  <img src="/images/notifications.svg" alt="Notification Icon" class="mb-1"></img>
                  Notifications
              </a>
          </li>
          <li>
              <a href="#" class="flex flex-col items-center text-font-off-white dark:text-white hover:underline ">
                  <img src="/images/menu.svg" alt="Menu Icon" class="mb-2 mt-1"></img>
                  More
              </a>
          </li>
        </ul>
      </nav>
    );
  };
  