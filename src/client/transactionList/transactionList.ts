export function transactionList() {
  document.addEventListener('htmx:afterSwap', () => {
    const accountSelector = document.getElementById('account-select');
    const accountSelectorImage = document.getElementById(
      'account-select-image'
    );
    const accountSelectorForm = document.querySelectorAll(
      '.account-selector-form'
    );
    const modalBg = document.getElementById('modal-bg');
    const cancelButton = document.getElementById('cancel-account-change');
    const dateSelectorForm = document.getElementById('date-selector-form');
    const filterSelector = document.getElementById('filter-selector');

    console.log(accountSelector);
    accountSelector?.addEventListener('click', (event) => {
      console.log('click');
      accountSelectorImage?.classList.toggle('rotate-90');
      accountSelectorForm?.forEach((form) => {
        form?.classList.toggle('hidden');
      });
      modalBg?.classList.toggle('hidden');
    });

    cancelButton?.addEventListener('click', (event) => {
      event?.preventDefault();
      accountSelectorImage?.classList.toggle('rotate-90');
      accountSelectorForm?.forEach((form) => {
        form?.classList.toggle('hidden');
      });
      modalBg?.classList.toggle('hidden');
    });

    filterSelector?.addEventListener('click', () => {
      dateSelectorForm?.classList.toggle('hidden');
    });
  });
}
