export const NotificationPage = (props: { userId: string }) => {
  return (
    <div class="p-6 animate-fade-in" hx-push-url="/notification/page">
      <div
        hx-get={`/notification/notificationList/${props.userId}`}
        hx-trigger="load"
        hx-swap="outerHTML"
      ></div>
    </div>
  );
};
