document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("input", function (event) {
    if ((event.target as HTMLInputElement)?.id === "searchInput") {
      const filterText = (
        event.target as HTMLInputElement
      )?.value.toLowerCase();

      const transactionsContainer = document.getElementById(
        "transactionsContainer"
      );

      if (!transactionsContainer) {
        console.error("Transactions container not found.");
        return;
      }

      if (!window.originalTransactions) {
        window.originalTransactions = Array.from(
          transactionsContainer.querySelectorAll(".transaction")
        ).map((el) => el.cloneNode(true) as HTMLElement);
      }

      transactionsContainer.innerHTML = "";

      if (filterText.length === 0) {
        window.originalTransactions.forEach((transaction) => {
          transactionsContainer.appendChild(transaction.cloneNode(true));
        });
      } else {
        const filteredTransactions = window.originalTransactions.filter(
          (transaction) => {
            const company = transaction.getAttribute("data-company");
            return company?.toLowerCase().includes(filterText);
          }
        );
        filteredTransactions.forEach((transaction) => {
          transactionsContainer.appendChild(transaction.cloneNode(true));
        });
      }
    }
  });
});

declare global {
  interface Window {
    originalTransactions: HTMLElement[];
  }
}
