export const NotificationPage = (props: {
  userId: string;
  selectedSorted: string;
}) => {
  return (
    <div class="animate-fade-in" id="ws-notification-page">
      <div
        hx-get={`/notification/notificationList?sort=${props.selectedSorted}`}
        hx-trigger="load"
        hx-swap="outerHTML"
      ></div>
    </div>
  );
};
