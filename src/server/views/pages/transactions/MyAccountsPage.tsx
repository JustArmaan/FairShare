import type {
  Item,
  getCashAccountForUser,
} from "../../../services/plaid.service";
import type { ExtractFunctionReturnType } from "../../../services/user.service";
import Goal from "../Goals/components/goalOverview";

type CashAccount = ExtractFunctionReturnType<
  NonNullable<typeof getCashAccountForUser>
>;

export const MyAccountsPage = (props: {
  accountIds: string[];
  selectedItemId: string;
  selectedItem: Item;
  username: string;
  cashAccount?: CashAccount;
}) => {
  return (
    <div class="p-6 animate-fade-in pb-24">
      <Goal
        total={1000}
        contribution={900}
        goalName="Trip to Mexico"
        goalDescription="Save $1500 for trip to Mexico"
      />
      <div
        hx-get="/institutions/page"
        hx-target="#app"
        hx-swap="innerHTML"
        hx-push-url="/institutions/page"
        class="mb-2 flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer"
      >
        <p class="text-font-off-white mr-1 text-xl">My Institutions</p>
        <img class="h-5" src="/icons/add_circle.svg" alt="" />
      </div>
      <div
        hx-get={`/home/itemPicker/${props.selectedItemId}`}
        hx-target=".item-selector-form"
        hx-swap="innerHTML"
        class="header flex items-center mb-1 mt-4 justify-center hover:-translate-y-0.5 transition-transform cursor-pointer"
      >
        <h1 class="text-font-off-white mr-2 font-semibold text-2xl">
          {props.selectedItem.institutionName}
        </h1>
        <img class="h-3" src="/images/right-triangle.svg" alt="triangle icon" />
      </div>
      <div class="h-0.5 bg-primary-dark-grey w-full mx-2 mb-0 mt-2" />
      {props.accountIds.map((id) => (
        <div
          hx-get={`/home/accountOverview/${id}`}
          hx-trigger="load"
          hx-swap="outerHTML"
        ></div>
      ))}
      {props.cashAccount && (
        <div
          hx-get={`/home/accountOverview/cashAccount/${props.cashAccount.account.id}`}
          hx-trigger="load"
          hx-swap="outerHTML"
        ></div>
      )}
      <div class="item-selector-form" />
    </div>
  );
};

export default MyAccountsPage;
