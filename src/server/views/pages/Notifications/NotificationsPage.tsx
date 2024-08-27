export const NotificationPage = (props: {
  userId: string;
  selectedSorted: string;
}) => {
  return (
    <div class="animate-fade-in" hx-push-url="/notification/page">
      <div
        hx-get={`/notification/notificationList/${props.userId}?sort=${props.selectedSorted}`}
        hx-trigger="load"
        hx-swap="outerHTML"
      ></div>
      <p class="text-base text-accent-blue text-center">All up to date!</p>
    </div>
  );
};
