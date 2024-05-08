function setupEventListeners() {
  const labelButton = document.getElementById("select-icon");

  if (labelButton && !labelButton.dataset.listenerAttached) {
    labelButton.addEventListener("click", toggleCategories);
    labelButton.dataset.listenerAttached = "true";
  }

  attachCategoryButtonListeners();
}

function toggleCategories() {
  console.log("Label button clicked");
  const categoriesContainer = document.getElementById("categoriesContainer");
  if (categoriesContainer) {
    categoriesContainer.classList.toggle("hidden");
  }
}

function attachCategoryButtonListeners() {
  const addMemberButton = document.getElementById("addMemberButton");
  const addMemberForm = document.getElementById("addMemberForm");
  const memberContainer = document.getElementById("members");
  const colorButtons = document.querySelectorAll(
    ".color-button"
  ) as NodeListOf<HTMLButtonElement>;
  const categoryButtons = document.querySelectorAll(
    ".category-button"
  ) as NodeListOf<HTMLButtonElement>;

  categoryButtons.forEach((button) => {
    const categoryId = button.getAttribute("data-category-id");
    const selectedCategoryId = document.getElementById(
      "selectedCategoryId"
    ) as HTMLInputElement;

    if (!button.dataset.listenerAttached) {
      button.addEventListener("click", () => {
        if (categoryId) {
          selectCategory(categoryId);
        }
      });
      button.dataset.listenerAttached = "true";
    }
  });

  colorButtons.forEach((button) => {
    if (!button.dataset.listenerAttached) {
      button.addEventListener("click", function () {
        console.log("Color button clicked");
        colorButtons.forEach((btn) =>
          btn.classList.remove("ring-2", "ring-offset-2", "ring-accent-blue")
        );

        this.classList.add("ring-2", "ring-offset-2", "ring-accent-blue");
        console.log(this.classList);

        const selectedColor = document.getElementById(
          "selectedColor"
        ) as HTMLInputElement;
        console.log(this.dataset.color);
        selectedColor.value = this.dataset.color!;
      });
      button.dataset.listenerAttached = "true";
    }
  });

  if (addMemberButton && !addMemberButton.dataset.listenerAttached) {
    addMemberButton.addEventListener("click", () => {
      addMemberForm?.classList.toggle("hidden");
      addMemberButton?.classList.toggle("hidden");
    });
    addMemberButton.dataset.listenerAttached = "true";
  }

  if (memberContainer && !memberContainer.dataset.listenerAttached) {
    memberContainer.addEventListener("htmx:afterSwap", () => {
      collectEmailsAndUpdateInput();
    });
    memberContainer.dataset.listenerAttached = "true";
  }
}

function selectCategory(id: string): void {
  const input = document.getElementById(
    "selectedCategoryId"
  ) as HTMLInputElement;
  const categoriesContainer = document.getElementById("categoriesContainer");
  const selectedIcon = document.querySelectorAll("#selected-icon");
  if (selectedIcon) {
    selectedIcon.forEach((selectedIcon) => {
      selectedIcon.innerHTML = "";
    });

    const clickedButton = document.querySelector(
      `button[data-category-id='${id}']`
    );

    if (clickedButton) {
      selectedIcon[0].innerHTML = "";
      const clonedButton = clickedButton.cloneNode(true);
      selectedIcon[0].appendChild(clonedButton);
    }
  }

  if (input) {
    input.value = id;
  }

  if (categoriesContainer) {
    categoriesContainer.classList.add("hidden");
  }
}

function collectEmailsAndUpdateInput() {
  const emailDivs = document.querySelectorAll("div[data-email]");
  const emails = Array.from(emailDivs).map((div) =>
    div.getAttribute("data-email")
  );
  console.log(emails);
  const memberEmailsInput = document.getElementById(
    "memberEmails"
  ) as HTMLInputElement;
  memberEmailsInput!.value = emails.join(",");
}

function isEmailDuplicated() {
  const emailInput = document.querySelector(
    '[name="addEmail"]'
  ) as HTMLInputElement;
  const memberEmailsInput = document.getElementById(
    "memberEmails"
  ) as HTMLInputElement;
  const emailToCheck = emailInput?.value;
  const existingEmails = memberEmailsInput?.value
    ? memberEmailsInput?.value.split(",")
    : [];
  emailInput.value = "";
  return existingEmails.includes(emailToCheck);
}

document.body.addEventListener("htmx:beforeSwap", function (evt) {
  const xhr = (evt as CustomEvent).detail.xhr;
  const status = xhr.status;

  if (status === 400 || status === 500) {
    evt.preventDefault();

    const errorContainer = document.getElementById("errorContainer");
    if (errorContainer) {
      if (status === 400) {
        errorContainer.classList.remove("hidden");
        errorContainer.textContent = xhr.responseText;
        setTimeout(() => {
          errorContainer.classList.add("hidden");
        }, 8000);
      } else if (status === 500) {
        errorContainer.classList.remove("hidden");
        errorContainer.textContent =
          "An internal server error occurred. Please try again later.";
        setTimeout(() => {
          errorContainer.classList.add("hidden");
        }, 8000);
      } else if (status === 200) {
        errorContainer.classList.add("hidden");
      }
    }
  }
});

window.isEmailDuplicated = isEmailDuplicated;
window.collectEmailsAndUpdateInput = collectEmailsAndUpdateInput;
window.selectCategory = selectCategory;

document.addEventListener("DOMContentLoaded", setupEventListeners);
document.body.addEventListener("htmx:afterSwap", setupEventListeners);

declare global {
  interface Window {
    selectCategory: typeof selectCategory;
    collectEmailsAndUpdateInput: typeof collectEmailsAndUpdateInput;
    isEmailDuplicated: () => boolean;
  }
}
