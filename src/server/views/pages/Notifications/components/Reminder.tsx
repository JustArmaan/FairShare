import { type Notification } from "../../../../services/notification.service";

export const Reminder = (props: { notifications: Notification }) => {
  const timeAgo = (timestamp: number) => {
    const now = Date.now()
    //@ts-ignore
    const diff = Math.floor((now - new Date(timestamp)) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div class="animate-fade-in">
      <button id={``} class={`transaction rounded-xl w-full h-fit`}>
        <div class={`rounded-2xl mt-2`}>
          <div class="hover:-translate-y-0.5 cursor-pointer transition-all mt-4 bg-primary-black p-2 rounded-xl shadow-md mb-1 flex items-center justify-between relative">
            <div class="flex items-center">
              <div class={`p-3 pl-4 pr-4 mr-4 bg-accent-red rounded-xl`}>
                <div class="flex items-center justify-center w-10 h-10">
                  {/* categories same as tranactions */}
                  <img src="/groupIcons/groups.svg" alt="" class="w-10" />
                </div>
              </div>
              <div class="flex flex-col">
                <p class="text-font-off-white font-semibold w-fit flex items-center">
                  {/* Account: 
                  <span class="text-font-off-white font-normal ml-1">
                    #1132457
                  </span> */}
                  <span class="absolute text-xs text-font-grey m-2.5 items-end right-0 top-0">
                    {timeAgo(props.notifications.timestamp)}
                  </span>
                </p>
                <p class="text-font-off-white">{props.notifications.message}</p>
                {/* Some function that checks status and either choses blinking blue or check mark */}
                <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-accent-blue opacity-75 items-end right-5 top-[50%]"></span>
                <span class="absolute inline-flex h-2 w-2 rounded-full bg-accent-blue opacity-75 items-end right-5 top-[50%]"></span>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default Reminder;
