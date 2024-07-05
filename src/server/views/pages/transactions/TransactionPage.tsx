import { Transaction } from "./components/Transaction";
import { Card } from "./components/Card";
import {
  getAccountWithTransactions,
  getAccountsForUser,
} from "../../../services/plaid.service";
import type { ExtractFunctionReturnType } from "../../../services/user.service";

export const TransactionsPage = (props: {
  accounts: ExtractFunctionReturnType<typeof getAccountsForUser>;
  selectedAccountId: string;
  itemId: string;
  uniqueYearMonth: string[];
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateOptions = props.uniqueYearMonth?.reverse().map((yearMonth) => {
    const [year, month] = yearMonth.split("-");
    return { year, month };
  });

  function extractUniqueYearsWithReduce(yearMonthArray: string[]) {
    const uniqueYearsObj: { [key: string]: boolean } = yearMonthArray?.reduce(
      (acc, yearMonth) => {
        const [year] = yearMonth.split("-");
        acc[year] = true;
        return acc;
      },
      {} as { [key: string]: boolean }
    );

    return Object.keys(uniqueYearsObj);
  }

  const uniqueYears = extractUniqueYearsWithReduce(props.uniqueYearMonth || []);

  const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");

  console.log(dateOptions);
  return (
    <div
      class="animate-fade-in"
      hx-push-url={`/transactions/page/${props.selectedAccountId}`}
    >
      <div
        id="modal-bg"
        class="fixed inset-0 bg-primary-black bg-opacity-40 z-10 hidden"
      ></div>
      <div class="hidden rotate-90"></div>
      <div
        hx-get={`/transactions/accountPicker/${props.itemId}/${props.selectedAccountId}`}
        hx-target=".account-selector-form"
        hx-swap="innerHTML"
        class="mb-2 flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer"
      >
        <p class="text-font-off-white mr-3 text-xl">Change Account</p>
        <img class="h-3" src="/images/right-triangle.svg" alt="triangle icon" />
      </div>
      <Card
        account={
          props.accounts.find(
            (account) => account.id === props.selectedAccountId
          )!
        }
      />
      <div class="h-px bg-primary-black mb-2" />
      <div class="relative w-full max-w-xs my-4 flex items-center">
        <div class="flex items-center bg-primary-black w-full border-2 border-primary-grey rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="text-font-off-white ml-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            id="searchInput"
            type="search"
            name="search"
            placeholder="Search"
            class="bg-primary-black outline-none w-max pl-2 py-2 rounded-full text-font-grey placeholder-font-grey"
            hx-post={`/transactions/search/${props.selectedAccountId}`}
            hx-trigger="input changed delay:500ms, search"
            hx-target="#transactionsContainer"
            hx-include="[name='search']"
          />
          <div class="relative w-full max-w-xs my-4 flex items-center"></div>
        </div>

        <img
          id="filter-selector"
          src="/activeIcons/filter.svg"
          alt="filter icon"
          class="ml-3 h-6 w-6"
        />
      </div>
      <div
        id="date-selector-form"
        class="bg-primary-black py-1 px-1 my-2 shadow-lg flex items-center justify-evenly w-fit hidden border-2 border-primary-grey rounded-full"
      >
        <form
          hx-post={`/transactions/date/${props.selectedAccountId}`}
          hx-trigger="change"
          hx-target="#transactionsContainer"
          hx-include="[name='month'], [name='year']"
          class="flex items-center w-fit justify-between"
        >
          <select
            name="year"
            id="yearSelect"
            class="bg-primary-black text-font-grey outline-none rounded cursor-pointer mx-4"
          >
            {uniqueYears.map((year) => (
              <option value={String(year)}>{year}</option>
            ))}
          </select>

          <select
            name="month"
            id="monthSelect"
            class="bg-primary-black text-primary-grey outline-none rounded cursor-pointer w-fit"
          >
            {dateOptions?.map((option) => (
              <option
                value={option.month}
                selected={option.month === currentMonth}
              >
                {months[Number(option.month) - 1]}
              </option>
            ))}
          </select>

          <input
            type="button"
            value="Reset"
            class="bg-primary-black text-font-grey cursor-pointer rounded-lg px-4 py-2 mx-4"
            hx-get={`/transactions/page/${props.itemId}/${props.selectedAccountId}`}
            hx-trigger="click"
            hx-target="#app"
            hx-swap="innerHTML"
            hx-push-url={`/transactions/page/${props.itemId}/${props.selectedAccountId}`}
          />
        </form>
      </div>

      <p class="text-xl text-font-off-white font-medium">Transaction History</p>
      <div
        id="transactionsContainer"
        class="mt-2"
        hx-get={`/transactions/transactionList/${props.selectedAccountId}`}
        hx-swap="innerHTML"
        hx-trigger="load"
      ></div>
      <div class="account-selector-form" />
      <div class="h-20"></div>
    </div>
  );
};

export default TransactionsPage;
