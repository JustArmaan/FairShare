export function transactionList() {
  document.addEventListener("htmx:afterswap", () => {
    const accountSelector = document.getElementById("account-select");
    const accountSelectorForm = document.getElementById(
      "account-selector-form"
    );
    accountSelector?.addEventListener("click", () => {
      console.log("clicked");
      accountSelectorForm?.classList.toggle("rotate-180");
      accountSelectorForm?.classList.toggle("hidden");
    });
  });
}
