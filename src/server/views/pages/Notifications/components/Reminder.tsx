import { type Notification } from '../../../../services/notification.service';

export const Reminder = (props: { notifications: Notification }) => {
  const timeAgo = (timestamp: string) => {
    const now = Date.now();
    const date = new Date(timestamp);
    const dateMillis = date.getTime();
    const diff = Math.floor((now - dateMillis) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const groupId = props.notifications.route?.split('/')[2];
  return (
    <div class='animate-fade-in'>
      <div class='hover:-translate-y-0.5 cursor-pointer transition-all mt-4 bg-primary-black p-2 rounded-xl shadow-md mb-1 flex flex-col items-center justify-between relative'>
        <div class='flex items-center w-full'>
          <div class='p-3 pl-4 pr-4 mr-4 bg-accent-red rounded-xl'>
            <div class='flex items-center justify-center w-10 h-10'>
              <img src='/groupIcons/groups.svg' alt='' class='w-10' />
            </div>
          </div>
          <div class='flex flex-col w-full'>
            <div class='flex justify-between items-center w-full'>
              <p class='text-font-off-white font-semibold mt-6'>
                {props.notifications.message}
              </p>
              <span class='text-xs text-font-grey m-2.5 items-end right-0 top-0 absolute'>
                {timeAgo(props.notifications.timestamp)}
              </span>
            </div>
            <div class='flex justify-end mt-4'>
              {props.notifications.route && (
                <div class='flex'>
                  <form>
                    <input
                      type='hidden'
                      name='notificationId'
                      value={props.notifications.id}
                    />
                    <input type='hidden' name='groupId' value={groupId} />
                    <button
                      class='bg-accent-blue px-4 py-2 text-font-off-white rounded-lg mr-4'
                      hx-post={`/groups/member/accept`}
                      hx-target='#app'
                      hx-swap='innerHTML'
                      hx-trigger='click'
                    >
                      Accept
                    </button>
                    <button
                      class='bg-card-red px-4 py-2 text-font-off-white rounded-lg'
                      hx-post={`/groups/member/decline`}
                      hx-target='#app'
                      hx-swap='innerHTML'
                      hx-trigger='click'
                    >
                      Decline
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
        <span class='animate-ping absolute inline-flex h-2 w-2 rounded-full bg-accent-blue opacity-75 right-5 top-[50%]'></span>
      </div>
    </div>
  );
};

export default Reminder;
