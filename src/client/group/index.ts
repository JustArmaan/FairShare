// @ts-nocheck

export function main() {
  function setupEventListeners() {
    const labelButton = document.getElementById("select-icon");
    const memberContainer = document.getElementById("memberContainer");

    if (labelButton && !labelButton.dataset.listenerAttached) {
      labelButton.addEventListener("click", toggleCategories);
      labelButton.dataset.listenerAttached = "true";
    }

    if (memberContainer && !memberContainer.dataset.listenersAttached) {
      memberContainer.addEventListener("click", function(event) {
        const deleteIcon = event.target.closest(".delete-icon");
        if (deleteIcon) {
          handleDeleteMember(event, deleteIcon);
        }
      });
      memberContainer.dataset.listenersAttached = "true";
    }

    attachCategoryButtonListeners();
  }

  function toggleCategories() {
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
        button.addEventListener("click", function() {
          colorButtons.forEach((btn) =>
            btn.classList.remove("ring-2", "ring-offset-2", "ring-accent-blue")
          );

          this.classList.add("ring-2", "ring-offset-2", "ring-accent-blue");

          const selectedColor = document.getElementById(
            "selectedColor"
          ) as HTMLInputElement;
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

    const clickedButton = document.querySelector(
      `button[data-category-id='${id}']`
    );

    if (clickedButton) {
      if (selectedIcon) {
        selectedIcon.forEach((selectedIcon) => {
          selectedIcon.innerHTML = "";
        });
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

  document.body.addEventListener("htmx:responseError", function(evt) {
    const xhr = (evt as CustomEvent).detail.xhr;
    const status = xhr.status;
    console.log("Response Error Status:", status); // Add this
    console.log("Response Text:", xhr.responseText); // Add this
    const errorContainer = document.getElementById("errorContainer");
    const successContainer = document.getElementById("success-container");

    if (errorContainer) {
      errorContainer.classList.add("hidden");
    }
    if (successContainer) {
      successContainer.classList.add("hidden");
    }

    if (status === 400 || status === 500 || status === 401 || status === 403) {
      evt.preventDefault();

      if (errorContainer) {
        if (status === 400) {
          errorContainer.textContent = xhr.responseText;
        } else if (status === 500) {
          errorContainer.textContent =
            "An internal server error occurred. Please try again later.";
        } else if (status === 401 || status === 403) {
          console.log("Response Error Status:", status);
          errorContainer.textContent =
            xhr.responseText ||
            "You are not authorized to perform this action.";
        }
        errorContainer.classList.remove("hidden");
        setTimeout(() => {
          errorContainer.classList.add("hidden");
        }, 8000);
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

  function handleDeleteMember(event, element) {
    event.preventDefault();

    const parentDiv = element.closest("[data-email]");
    const email = parentDiv.dataset.email;

    if (parentDiv) {
      parentDiv.parentNode.removeChild(parentDiv);
    }

    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach((input) => {
      if (input.value === email) {
        input.value = "";
      }
    });

    const hiddenEmailInput = document.getElementById("memberEmails");
    if (hiddenEmailInput) {
      const emails = hiddenEmailInput.value.split(",");
      const filteredEmails = emails.filter((e) => e !== email);
      hiddenEmailInput.value = filteredEmails.join(",");
    }
  }
}
