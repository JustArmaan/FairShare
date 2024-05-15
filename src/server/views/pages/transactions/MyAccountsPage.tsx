export const MyAccountsPage = (props: {
  accountIds: string[];
  selectedAccountId: string;
}) => {
  return (
    <div class="p-6 animate-fade-in pb-24">
      <div
        hx-get={`/home/itemPicker/${props.selectedAccountId}`}
        hx-target=".account-selector-form"
        hx-swap="innerHTML"
        class="mb-2 flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer"
      >
        <p class="text-font-off-white mr-3 text-xl">Change Account</p>
        <img
          class="h-3"
          src="/images/right-triangle.svg"
          alt="triangle icon"
          id="account-select-image"
        />
      </div>
      <div class="header flex align-center mb-2">
        <h1 class="text-font-off-white font-semibold text-lg mr-2">
          My Accounts
        </h1>
        <img src="/activeIcons/info.svg" alt="help icon" />
      </div>
      {props.accountIds.map((id) => (
        <div
          hx-get={`/home/accountOverview/${id}`}
          hx-trigger="load"
          hx-swap="outerHTML"
        ></div>
      ))}
    </div>
  );
};

export default MyAccountsPage;
