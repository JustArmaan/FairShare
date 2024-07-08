const notificationSortOptions = [
  "Most Recent",
  "Oldest to Newest",
  "Groups",
  "Account",
  "Unseen Notifications",
];
export const NotificationPicker = (props: {
  currentUserId: string;
  selectedSort: string;
}) => {
  console.log(props.selectedSort, "selectedSort");
  return (
    <div>
      <div class="picker-container">
        <div class="h-screen w-screen fixed top-0 left-0 bg-card-black opacity-80"></div>
        <div class="fixed bottom-0 left-0 right-0 z-[999999999] p-5 rounded-t-2xl shadow-lg bg-card-black">
          <form class="flex flex-col mb-0 mt-3 justify-center text-font-off-white  border-b-primary-dark-grey">
            <div class="bg-primary-black rounded-xl">
              {notificationSortOptions.map((item, index) => (
                <>
                  <div
                    class="w-full flex justify-between p-4 hover:opacity-80 cursor-pointer"
                    hx-get={`/notification/notificationList/${props.currentUserId}?sort=${item}`}
                    hx-swap="innerHTML"
                    hx-target="#notification-list"
                  >
                    <label>{item}</label>
                    <input
                      type="radio"
                      class="radio-picker w-6 h-6 cursor-pointer"
                      checked={item === props.selectedSort}
                    />
                  </div>
                  {index !== notificationSortOptions.length - 1 && (
                    <div class="w-full h-px bg-primary-dark-grey rounded mb-2 opacity-75"></div>
                  )}
                </>
              ))}
            </div>
            <button
              class="text-accent-blue mt-4  py-2 cursor-pointer bg-primary-black rounded-xl font-semibold text-lg"
              hx-trigger="click"
              hx-get="/empty"
              hx-target=".picker-container"
              hx-swap="outerHTML"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default NotificationPicker;
