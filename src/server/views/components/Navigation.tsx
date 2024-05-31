export const Nav = () => {
  <script
    src='https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js'
    defer
  ></script>;
  return (
    <nav class='bg-font-black w-full fixed bottom-0'>
      <ul class='flex justify-between items-center px-4 py-5'>
        <li class='group w-1/6 '>
          <a
            class=' parent hover:child-hidden flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-yellow'
            hx-get='/home/page'
            hx-target='#app'
            hx-trigger='click'
            hx-swap='innerHTML'
          >
            <img
              id='homeIcon'
              class='child h-6 absolute'
              src='/images/home.svg'
              alt='home icon'
            />
            <img class='h-6' src='/activeIcons/home.svg' alt='home icon' />
            <p class='mt-1 text-xs'>Home</p>
          </a>
        </li>
        <li class='group w-1/6'>
          <a
            class='parent hover:child-hidden flex flex-col items-center text-font-off-white dark:text-white group-hover:text-accent-purple'
            hx-get='/groups/page'
            hx-target='#app'
            hx-trigger='click'
            hx-swap='innerHTML'
          >
            <img
              id='groupIcon'
              class=' child h-6 absolute'
              src='/images/group.svg'
              alt='group icon'
            />
            <img class='h-6' src='/activeIcons/group.svg' alt='group icon' />
            <p class='mt-1 text-xs'>Groups</p>
          </a>
        </li>
        <div class='rounded-full bg-accent-blue size-12'>
          <li class='flex justify-center items-center'>
            <a
              href=''
              class='flex flex-col items-center text-font-off-white dark:text-white'
            >
              <img
                src='/images/moreButton.svg'
                alt='plus icon'
                class='p-2.5 mt-0.5'
              ></img>
            </a>
          </li>
        </div>
        <div
          id='notification-icon'
          hx-get={`/notification/notificationIcon`}
          hx-swap='outerHTML'
          hx-trigger='load'
          hx-target='#notification-icon'
        ></div>
        <li class='group w-1/6 relative'>
          <div
            hx-get='/menu?open=false'
            hx-swap='outerHTML'
            hx-trigger='load'
          />
        </li>
      </ul>
    </nav>
  );
};
