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
            <svg
              width="29"
              height="23"
              viewBox="0 0 29 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5774 12.4997C16.984 12.4997 19.1644 13.3355 20.7641 14.5043C22.2841 15.6164 23.5716 17.2691 23.5716 19.0472C23.5716 20.0232 23.1746 20.832 22.5488 21.4333C21.9603 22.0008 21.192 22.3688 20.4005 22.6196C18.8188 23.1224 16.736 23.2842 14.5774 23.2842C12.4188 23.2842 10.336 23.1224 8.75426 22.6196C7.96277 22.3688 7.1944 22.0008 6.60464 21.4333C5.98147 20.8334 5.58316 20.0246 5.58316 19.0486C5.58316 17.2705 6.87061 15.6178 8.39063 14.5056C9.99032 13.3355 12.1708 12.4997 14.5774 12.4997ZM23.5716 13.8478C24.913 13.8478 26.1311 14.3128 27.0318 14.9707C27.8541 15.5733 28.7111 16.5749 28.7111 17.7962C28.7111 18.4932 28.422 19.0715 27.9916 19.4853C27.5984 19.8641 27.1127 20.0866 26.6694 20.2268C26.0655 20.4182 25.3524 20.5166 24.6123 20.5597C24.7691 20.0947 24.8565 19.5891 24.8565 19.0472C24.8565 16.9779 23.6243 15.2201 22.2456 14.0001C22.681 13.899 23.1256 13.8479 23.5716 13.8478ZM5.58316 13.8478C6.04186 13.8478 6.48643 13.9017 6.90916 14.0001C5.53176 15.2201 4.29827 16.9779 4.29827 19.0472C4.29827 19.5891 4.38564 20.0947 4.5424 20.5597C3.8023 20.5166 3.09047 20.4182 2.48529 20.2268C2.042 20.0866 1.55632 19.8641 1.16186 19.4853C0.93556 19.273 0.754592 19.0128 0.630812 18.722C0.507032 18.4311 0.443236 18.1161 0.443605 17.7976C0.443605 16.5776 1.29934 15.5746 2.12295 14.972C3.14155 14.239 4.34796 13.847 5.58316 13.8478ZM22.9291 5.75941C23.7811 5.75941 24.5981 6.11448 25.2005 6.74651C25.8029 7.37853 26.1414 8.23574 26.1414 9.12956C26.1414 10.0234 25.8029 10.8806 25.2005 11.5126C24.5981 12.1446 23.7811 12.4997 22.9291 12.4997C22.0772 12.4997 21.2602 12.1446 20.6578 11.5126C20.0553 10.8806 19.7169 10.0234 19.7169 9.12956C19.7169 8.23574 20.0553 7.37853 20.6578 6.74651C21.2602 6.11448 22.0772 5.75941 22.9291 5.75941ZM6.2256 5.75941C7.07753 5.75941 7.89457 6.11448 8.49698 6.74651C9.09939 7.37853 9.43782 8.23574 9.43782 9.12956C9.43782 10.0234 9.09939 10.8806 8.49698 11.5126C7.89457 12.1446 7.07753 12.4997 6.2256 12.4997C5.37367 12.4997 4.55662 12.1446 3.95422 11.5126C3.35181 10.8806 3.01338 10.0234 3.01338 9.12956C3.01338 8.23574 3.35181 7.37853 3.95422 6.74651C4.55662 6.11448 5.37367 5.75941 6.2256 5.75941ZM14.5774 0.367188C15.9405 0.367188 17.2477 0.935295 18.2116 1.94653C19.1754 2.95777 19.7169 4.32931 19.7169 5.75941C19.7169 7.18952 19.1754 8.56106 18.2116 9.5723C17.2477 10.5835 15.9405 11.1516 14.5774 11.1516C13.2143 11.1516 11.907 10.5835 10.9432 9.5723C9.9793 8.56106 9.43782 7.18952 9.43782 5.75941C9.43782 4.32931 9.9793 2.95777 10.9432 1.94653C11.907 0.935295 13.2143 0.367188 14.5774 0.367188Z"
                fill="#F9F9F9"
                class="group-hover:fill-accent-purple"
              />
            </svg>
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
            class="flex flex-col items-center text-font-off-white dark:text-white text-sm group-hover:text-accent-green"
          >
            <svg
              width="18"
              height="22"
              viewBox="0 0 18 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 18.4783V16.3043H2.17172V8.69565C2.17172 7.19203 2.62416 5.85598 3.52904 4.6875C4.43392 3.51902 5.61027 2.75362 7.05808 2.3913V1.63043C7.05808 1.17754 7.21644 0.792572 7.53314 0.475543C7.84985 0.158514 8.23443 0 8.68687 0C9.13931 0 9.52388 0.158514 9.84059 0.475543C10.1573 0.792572 10.3157 1.17754 10.3157 1.63043V2.3913C11.7635 2.75362 12.9398 3.51902 13.8447 4.6875C14.7496 5.85598 15.202 7.19203 15.202 8.69565V16.3043H17.3737V18.4783H0ZM8.68687 21.7391C8.08965 21.7391 7.57839 21.5263 7.15309 21.1005C6.7278 20.6748 6.51515 20.163 6.51515 19.5652H10.8586C10.8586 20.163 10.6459 20.6748 10.2206 21.1005C9.79535 21.5263 9.28409 21.7391 8.68687 21.7391Z"
                fill="#F9F9F9"
                class="group-hover:fill-accent-green"
              />
            </svg>
            Notifications
          </a>
        </li>
        <li class="group">
          <button
            hx-get="/menu"
            hx-target=".menu"
            hx-include="[name=original]"
            class="more flex flex-col items-center text-font-off-white dark:text-white group-hover:accent-accent-red focus:outline-none"
            aria-label="Toggle menu"
          >
            <img src="/images/menu.svg" alt="Menu Icon" class="mt-2"></img>
            More
          </button>

        </li>
      </ul>
    </nav>
  );
};
