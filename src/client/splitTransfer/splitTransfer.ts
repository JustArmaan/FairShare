function checkPercentInputs(percentInputs: NodeListOf<HTMLInputElement>) {
  let total = 0;
  percentInputs.forEach((input) => {
    total += parseFloat(input.value);
  });

  if (total > 100) {
    const newPercent = 100 / percentInputs.length;
    percentInputs.forEach((input) => {
      input.value = newPercent.toString();
    });
  }
  console.log(total, 'total');
}

function checkAmountInputs(
  amountInputs: NodeListOf<HTMLInputElement>,
  billTotal: number
) {
  let total = 0;
  amountInputs.forEach((input) => {
    total += parseFloat(input.value);
  });

  if (total > billTotal) {
    const newAmount = billTotal / amountInputs.length;
    amountInputs.forEach((input) => {
      input.value = newAmount.toString();
    });
  }
}

export function splitTransfer() {
  document.addEventListener('htmx:afterSwap', () => {
    const percentInputs = document.querySelectorAll(
      '.percent-input'
    ) as NodeListOf<HTMLInputElement>;

    const billTotalDivPercent = document.querySelector(
      'div[data-total-percent]'
    ) as HTMLElement;

    const amountInputs = document.querySelectorAll(
      '.amount-input'
    ) as NodeListOf<HTMLInputElement>;

    const billTotalDivAmount = document.querySelector('div[data-total-amount]');

    percentInputs.forEach((input, index) => {
      const percentTotalDiv =
        document.querySelectorAll('div.percent-total')[index];

      if (!input.dataset.listenerAttached) {
        input.addEventListener('input', () => {
          if (billTotalDivPercent && billTotalDivPercent.dataset.totalPercent) {
            checkPercentInputs(percentInputs);
          }
          let percent = parseFloat(input.value);
          if (isNaN(percent)) percent = 0;

          let billTotal;

          if (billTotalDivPercent && billTotalDivPercent.dataset.totalPercent) {
            billTotal = parseFloat(billTotalDivPercent.dataset.totalPercent);
          }

          if (!billTotal) billTotal = 0;

          const amount = (billTotal * percent) / 100;

          percentTotalDiv.textContent = `-$${amount.toFixed(2)}`;
        });

        input.dataset.listenerAttached = 'true';
      }
    });

    amountInputs.forEach((input, index) => {
      const amountTotalDiv =
        document.querySelectorAll('div.amount-total')[index];

      if (!input.dataset.listenerAttached && billTotalDivAmount) {
        input.addEventListener('input', () => {
          checkAmountInputs(
            amountInputs,
            parseFloat(
              billTotalDivAmount.getAttribute('data-total-amount') || '0'
            )
          );
          let amount = parseFloat(input.value);
          if (isNaN(amount)) amount = 0;

          amountTotalDiv.textContent = `-$${amount.toFixed(2)}`;
        });

        input.dataset.listenerAttached = 'true';
      }
    });
  });
}
