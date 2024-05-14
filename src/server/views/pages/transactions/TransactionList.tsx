import { Transaction } from './components/Transaction';
import { Card } from './components/Card';
import { getAccountWithTransactions } from '../../../services/plaid.service';
import type { ExtractFunctionReturnType } from '../../../services/user.service';

const iconColors = [
  'bg-accent-red',
  'bg-accent-blue',
  'bg-accent-green',
  'bg-accent-yellow',
  'bg-accent-purple',
];

export const TransactionsPage = (props: {
  accounts: ExtractFunctionReturnType<typeof getAccountWithTransactions>[];
  selectedAccountId: string;
}) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return (
    <div class="p-6 animate-fade-in">
      <div
        id="modal-bg"
        class="fixed inset-0 bg-primary-black bg-opacity-40 z-10 hidden"
      ></div>
      <div class="hidden rotate-90"></div>
      <div
        class=" mb-2 flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer"
        id="account-select"
      >
        <p class="text-font-off-white mr-3 text-xl">Change Account</p>
        <img
          class="h-3"
          src="/images/right-triangle.svg"
          alt="triangle icon"
          id="account-select-image"
        />
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
      <div
        id="date-selector-form"
        class="bg-primary-black py-1 px-1 my-2 shadow-lg flex items-center justify-evenly w-fit hidden border-2 border-primary-grey rounded-full"
      >
        <form
          hx-post="/transactions/date"
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
            {[2022, 2023, 2024].map((year) => (
              <option value={String(year)}>{year}</option>
            ))}
          </select>

          <select
            name="month"
            id="monthSelect"
            class="bg-primary-black text-font-grey outline-none rounded cursor-pointer mx-4 w-fit"
          >
            {months.map((month, index) => (
              <option value={String(index + 1)}>{month}</option>
            ))}
          </select>

          <input
            type="button"
            value="Reset"
            class="bg-primary-black text-font-grey cursor-pointer rounded-lg px-4 py-2 mx-4"
            hx-get="/transactions/page"
            hx-trigger="click"
            hx-target="#app"
          />
        </form>
      </div>

      <p class="text-xl text-font-off-white font-medium">Transaction History</p>
      <div id="transactionsContainer" class="mt-2">
        {props.accounts
          .find((account) => account.id === props.selectedAccountId)!
          .transactions.map((transaction, categoryIndex) => (
            <Transaction
              transaction={transaction}
              tailwindColorClass={iconColors[categoryIndex % iconColors.length]}
            />
          ))}
      </div>
      {/* <div class="account-selector-form fixed inset-x-0 bottom-0 z-20 p-32 bg-card-black rounded-t-lg shadow-lg hidden"> */}
      <div class="account-selector-form fixed bottom-0 left-0 right-0 z-20 p-5 rounded-t-2xl shadow-lg hidden bg-card-black">
        <form
          id="account-selector-form"
          class="account-selector-form hidden flex flex-col mb-0 mt-3 justify-center text-font-off-white  border-b-primary-dark-grey"
        >
          <div class="bg-primary-black rounded-xl">
            {props.accounts.map((account, index) => (
              <>
                <div class="w-full flex justify-between p-4 hover:opacity-80 cursor-pointer">
                  <label class="" for={account.name}>
                    {account.name}
                  </label>
                  <input
                    type="radio"
                    id={account.name}
                    name="selectedAccount"
                    value={account.name}
                    class="w-10 h-10 cursor-pointer border"
                    checked={account.id === props.selectedAccountId}
                  />
                </div>
                {index !== props.accounts.length - 1 && (
                  <div class="w-full h-px bg-primary-dark-grey rounded mb-2 opacity-75"></div>
                )}
              </>
            ))}
          </div>
          <input
            type="submit"
            value="Cancel"
            id="cancel-account-change"
            class="text-accent-blue mt-4  py-2 cursor-pointer bg-primary-black rounded-xl font-semibold text-lg"
          />
        </form>
      </div>
      <div class="h-20"></div>
    </div>
  );
};

export default TransactionsPage;
