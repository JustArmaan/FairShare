export const MyAccountsPage = (props: {
  accountIds: string[];
  selectedItemId: string;
  username: string;
}) => {
  return (
    <div class="p-6 animate-fade-in pb-24">
      <div
        hx-get={`/home/itemPicker/${props.selectedItemId}`}
        hx-target=".item-selector-form"
        hx-swap="innerHTML"
        class="mb-2 flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer"
      >
        <p class="text-font-off-white mr-3 text-xl">Change Institution</p>
        <img class="h-3" src="/images/right-triangle.svg" alt="triangle icon" />
      </div>
      <div class="header flex items-center mb-2 mt-4 justify-between">
        <h1 class="text-xl text-font-off-white h-fit font-semibold">
          {" "}
          Welcome, {props.username}
        </h1>{" "}
        <h1 class="text-font-off-white font-semibold text-xl mr-2 h-fit">
          My Accounts
        </h1>
      </div>
      {props.accountIds.map((id) => (
        <div
          hx-get={`/home/accountOverview/${id}`}
          hx-trigger="load"
          hx-swap="outerHTML"
        ></div>
      ))}
      <div class="item-selector-form" />
    </div>
  );
};

export default MyAccountsPage;
