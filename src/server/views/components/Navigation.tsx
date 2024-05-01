export const Nav = () => {
  return (
    <nav class="bg-font-black w-full fixed bottom-0">
      <ul class="flex justify-between items-center px-4 py-2">
        <li class="group">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-yellow"
            hx-get="/home"
            hx-target=".page"
          >
            <svg
              width="30"
              height="27"
              viewBox="0 0 30 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.2023 12.8736L14.8435 2.4202C14.7617 2.34474 14.6645 2.28486 14.5576 2.24401C14.4507 2.20316 14.336 2.18213 14.2202 2.18213C14.1045 2.18213 13.9898 2.20316 13.8829 2.24401C13.7759 2.28486 13.6788 2.34474 13.597 2.4202L2.23817 12.8736C1.90725 13.1784 1.71973 13.5923 1.71973 14.0241C1.71973 14.9206 2.51118 15.6495 3.48463 15.6495H4.68146V23.1086C4.68146 23.5581 5.07581 23.9213 5.56392 23.9213H12.4553V18.2323H15.5439V23.9213H22.8766C23.3647 23.9213 23.759 23.5581 23.759 23.1086V15.6495H24.9559C25.4247 15.6495 25.8742 15.4793 26.2051 15.172C26.8917 14.5371 26.8917 13.5085 26.2023 12.8736Z"
                fill="#F9F9F9"
                class="group-hover:fill-accent-yellow"

              />
            </svg>
            Home
          </a>
        </li>
        <li class="group">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-purple"
          >
            <img
              src="/images/group.svg"
              alt="Group Icon"
              class="mb-1 group-hover:text-white"
            ></img>
            Groups
          </a>
        </li>
        <li class="flex justify-center items-center">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white ml-4"
          >
            <img
              src="/images/moreButton.svg"
              alt="More Icon"
              class="max-w-12"
            ></img>
          </a>
        </li>
        <li class="group">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white text-sm group-hover:accent-accent-green"
          >
            <img
              src="/images/notifications.svg"
              alt="Notification Icon"
              class="mb-1"
            ></img>
            Notifications
          </a>
        </li>
        <li class="group">
          <a
            href="#"
            class="flex flex-col items-center text-font-off-white dark:text-white group-hover:accent-accent-red"
          >
            <img src="/images/menu.svg" alt="Menu Icon" class="mb-2 mt-1"></img>
            More
          </a>
        </li>
      </ul>
    </nav>
  );
};
