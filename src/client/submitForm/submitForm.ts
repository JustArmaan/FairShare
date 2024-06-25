import htmx from "htmx.org";

interface FormElement extends HTMLFormElement {
  querySelector<T extends HTMLElement = HTMLElement>(
    selectors: string
  ): T | null;
  querySelector<T extends HTMLInputElement>(selectors: string): T | null;
}

export function submitForm(form: FormElement): void {
  const year = (form.querySelector('[name="year"]') as HTMLInputElement).value;
  const month = (form.querySelector('[name="month"]') as HTMLInputElement)
    .value;
  const accountId = (
    form.querySelector('[name="accountId"]') as HTMLInputElement
  ).value;

  const url = `/breakdown/page/${accountId}?year=${year}&month=${month}`;

  htmx.ajax("GET", url, {
    target: "#app",
    swap: "innerHTML",
  });
}

export function attachFormListeners(): void {
  const form = document.getElementById("transactionForm") as FormElement;

  if (form) {
    form.addEventListener("change", function (event) {
      const target = event.target as HTMLElement;
      if (target.matches("select[name='year'], select[name='month']")) {
        submitForm(form);
      }
    });
  }
}
