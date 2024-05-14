import { Transaction } from "./components/Transaction";
import { type TransactionSchema } from "../../../interface/types";
import { Card } from "./components/Card";
import { type AccountSchema } from "../../../services/plaid.service";

interface CardDetails {
  primaryColor: string;
  textColor: string;
  accentColor1: string;
  accentColor2: string;
  bankLogo: string;
  bankName: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
}

interface TransactionsPageProps {
  transactions: TransactionSchema[];
  cardDetails: CardDetails;
  accounts: AccountSchema[];
}

const iconColors = [
  "bg-accent-red",
  "bg-accent-blue",
  "bg-accent-green",
  "bg-accent-yellow",
  "bg-accent-purple",
];

export const TransactionsPage = ({
  transactions,
  cardDetails,
  accounts,
}: TransactionsPageProps) => {
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
  return (
    <div class="p-6 animate-fade-in">
      {/* <a
        hx-get="/home/page"
        hx-trigger="click"
        hx-target="#app"
        hx-swap="innerHTML"
        class="mb-2 flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer"
      > */}
      <div
        id="modal-bg"
        class="fixed inset-0 bg-primary-dark-grey bg-opacity-30 z-10 hidden"
      ></div>
      <div class="hidden rotate-90"></div>
      <div class="mb-2 flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer">
        <p class="text-font-off-white mr-3 text-xl">Card</p>
        <img
          class="h-3"
          src="/images/right-triangle.svg"
          alt="triangle icon"
          id="account-select"
        />
      </div>
      {/* </a> */}
      <Card cardDetails={cardDetails} />
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
            hx-post="/transactions/search"
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
      <form
        id="date-selector-form"
        hx-post="/transactions/date"
        hx-trigger="change"
        hx-target="#transactionsContainer"
        hx-include="[name='month'], [name='year']"
        class="hidden mb-2"
      >
        <select
          name="year"
          id="yearSelect"
          class="bg-primary-black text-font-off-white outline-none mx-2 rounded"
        >
          {[2022, 2023, 2024].map((year) => (
            <option value={String(year)}>{year}</option>
          ))}
        </select>
        <select
          name="month"
          id="monthSelect"
          class="bg-primary-black text-font-off-white outline-none mx-2 rounded"
        >
          {months.map((month, index) => (
            <option value={String(index + 1)}>{month}</option>
          ))}
        </select>
        <input
          class="text-font-off-white cursor-pointer bg-primary-black rounded-lg w-fit px-2"
          type="button"
          value="Reset"
          hx-get="/transactions/page"
          hx-trigger="click"
          hx-target="#app"
        />
        <input type="submit" value="Load Transactions" class="hidden" />{" "}
      </form>
      <p class="text-xl text-font-off-white font-medium">Transaction History</p>
      <div id="transactionsContainer" class="mt-2">
        {transactions.map((transaction, categoryIndex) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={iconColors[categoryIndex % iconColors.length]}
          />
        ))}
      </div>
      <div class="fixed bottom-0 left-0 right-0 z-20 p-5 rounded-lg shadow-lg">
        <form
          id="account-selector-form"
          class="hidden flex flex-col mb-0 mt-3 justify-center text-font-off-white bg-primary-black border-b-primary-dark-grey rounded-lg"
        >
          {accounts.map((account) => (
            <div>
              <div class="w-full flex justify-between p-3">
                <label class="" for={account.name}>
                  {account.name}
                </label>
                <input
                  type="radio"
                  id={account.name}
                  name="selectedAccount"
                  value={account.name}
                  class="w-6 h-6 cursor-pointer"
                />
              </div>
              <div class="w-full h-1 bg-primary-dark-grey rounded mb-2 opacity-75"></div>
            </div>
          ))}
          <input
            type="submit"
            value="Cancel"
            id="cancel-account-change"
            class="text-accent-blue my-2 cursor-pointer"
          />
        </form>
      </div>
      <div class="h-20"></div>
    </div>
  );
};

export default TransactionsPage;
