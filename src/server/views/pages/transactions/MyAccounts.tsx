import { type Account } from "../../../services/account.service";
import { type TransactionSchema } from "../../../interface/types";
import { type Item } from "../../../services/plaid.service";
import Transaction from "./components/Transaction";

interface MyAccountsPageProps {
  accounts: Account[];
  transactions: TransactionSchema[];
  items: Item[];
}

const iconColors = [
    "bg-accent-red",
    "bg-accent-blue",
    "bg-accent-green",
    "bg-accent-yellow",
    "bg-accent-purple",
  ];

export const MyAccountsPage = ({
  accounts,
  transactions,
  items,
}: MyAccountsPageProps) => {
  return (
    <div class="p-6 animate-fade-in">
      <div class="header flex align-center mb-2">
        <h1 class="text-font-off-white font-semibold text-lg mr-2">
          My Accounts
        </h1>
        <img src="/activeIcons/info.svg" alt="help icon" />
      </div>
      {accounts.map((account) => (
        <>
          <div class="account-info flex justify-between text-font-off-white mt-4">
            <p>{account.name}</p>
            <p>Account Type: {account.accountTypeId}</p>
          </div>
          <div class="balance flex text-font-off-white justify-center mt-2 text-bold text-xl mb-1">
            ${account.balance}
          </div>
          <div class="w-full h-1 bg-primary-dark-grey rounded mb-2 opacity-75"></div>
          {/* Loop through account.transactions when service function is implemented */}
          <div class="transactions">
            <Transaction transaction={transactions[0]} tailwindColorClass={iconColors[0]} />
            <Transaction transaction={transactions[1]} tailwindColorClass={iconColors[1]} />
          </div>
        </>
      ))}
    </div>
  );
};

export default MyAccountsPage;
