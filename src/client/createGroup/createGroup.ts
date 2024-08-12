import htmx from "htmx.org";

export let selectedIcon: string | null = null;
export let selectedColor: string | null = null;

export function initializeSelectedIcon() {
  const selectedIconInput = document.getElementById(
    "selectedIcon"
  ) as HTMLInputElement;
  if (selectedIconInput && selectedIconInput.value) {
    selectedIcon = selectedIconInput.value;
    const selectedIconElement = document.querySelector(
      `[data-category-id="${selectedIcon}"]`
    );
    if (selectedIconElement) {
      selectedIconElement.classList.add("ring-2", "ring-accent-blue");
    }
  }
}

export function initializeSelectedColor() {
  const selectedColorInput = document.getElementById(
    "selectedColor"
  ) as HTMLInputElement;
  if (selectedColorInput && selectedColorInput.value) {
    selectedColor = selectedColorInput.value;
    const selectedColorElement = document.querySelector(
      `[data-color="${selectedColor}"]`
    );
    if (selectedColorElement) {
      selectedColorElement.classList.add("ring-2", "ring-accent-blue");
    }
  }
}

export function handleIconClick(iconId: string, iconElement: Element) {
  if (selectedIcon) {
    const selectedIconElement = document.querySelector(
      `[data-category-id="${selectedIcon}"]`
    );
    if (selectedIconElement) {
      selectedIconElement.classList.remove("ring-2", "ring-accent-blue");
    }
  }

  selectedIcon = iconId;
  iconElement.classList.add("ring-2", "ring-accent-blue");

  const selectedIconInput = document.getElementById(
    "selectedIcon"
  ) as HTMLInputElement;
  if (selectedIconInput !== null) {
    selectedIconInput.value = iconId;
  } else {
    console.error("selectedIconInput is null");
  }

  // Make AJAX call to update the preview
  updateIconPreview();
}

export function handleColorClick(colorName: string, colorElement: Element) {
  if (selectedColor) {
    const previousSelectedColor = document.querySelector(
      `[data-color="${selectedColor}"]`
    );
    if (previousSelectedColor) {
      previousSelectedColor.classList.remove("ring-2", "ring-accent-blue");
    }
  }

  selectedColor = colorName;
  colorElement.classList.add("ring-2", "ring-accent-blue");

  const selectedColorInput = document.getElementById(
    "selectedColor"
  ) as HTMLInputElement;
  if (selectedColorInput) {
    selectedColorInput.value = colorName;
  }

  // Make AJAX call to update the preview
  updateIconPreview();
}

function updateIconPreview() {
  const temporaryGroup = document.getElementById(
    "temporaryGroup"
  ) as HTMLInputElement;
  const isTemporary =
    temporaryGroup && temporaryGroup.checked ? "true" : "false";
  console.log(isTemporary, selectedColor, selectedIcon);
  if (temporaryGroup !== undefined && selectedColor && selectedIcon) {
    console.log("Updating icon preview");
    htmx.ajax(
      "GET",
      `/groups/updateIcon?icon=${selectedIcon}&color=${selectedColor}&temporary=${isTemporary}`,
      {
        target: "#icon-preview",
        swap: "innerHTML",
      }
    );
  }
  if (!selectedColor || !selectedIcon) {
    htmx
      .ajax(
        "GET",
        `/groups/updateIcon?icon=${selectedIcon}&color=${selectedColor}&temporary=${isTemporary}`,
        {
          target: "#icon-preview",
          swap: "innerHTML",
        }
      )
      .then(() => {
        const iconPreview = document.getElementById("icon-preview");
        const groupNameContainer = document.getElementById(
          "group-name-container"
        );
        if (iconPreview && groupNameContainer) {
          iconPreview.classList.remove("hidden");
          iconPreview.classList.add(
            "block",
            "w-[3.875rem]",
            "aspect-square",
            "flex-shrink-0"
          );
          groupNameContainer.classList.remove("w-full");
          groupNameContainer.classList.add("flex-grow");
        }
      });
  }
}

export function initializeGroupForm() {
  clearSelectedIconAndColor();
  const temporaryGroupCheckbox = document.getElementById("temporaryGroup");
  if (
    temporaryGroupCheckbox &&
    !temporaryGroupCheckbox.dataset.listenerAttached
  ) {
    temporaryGroupCheckbox.addEventListener("change", () => {
      updateIconPreview();
    });
    temporaryGroupCheckbox.dataset.listenerAttached = "true";
  }

  initializeSelectedIcon();
  initializeSelectedColor();

  // Update hidden inputs initially
  const selectedIconInput = document.getElementById(
    "selectedIcon"
  ) as HTMLInputElement;
  const selectedColorInput = document.getElementById(
    "selectedColor"
  ) as HTMLInputElement;
  if (selectedIconInput && selectedColorInput) {
    selectedIconInput.value = selectedIcon ?? "";
    selectedColorInput.value = selectedColor ?? "";
  }

  // Attach event listeners to icon elements
  document.querySelectorAll("[data-category-id]").forEach((element) => {
    const htmlElement = element as HTMLElement;
    if (!htmlElement.dataset.listenerAttached) {
      element.addEventListener("click", () => {
        const categoryId = htmlElement.getAttribute("data-category-id");
        if (categoryId) {
          handleIconClick(categoryId, htmlElement);
        }
      });
      (htmlElement as HTMLElement).dataset.listenerAttached = "true";
    }
  });

  // Attach event listeners to color elements
  const colors = document.querySelectorAll(
    "[data-color]"
  ) as NodeListOf<HTMLElement>;
  colors.forEach((element) => {
    if (!element.dataset.listenerAttached) {
      element.addEventListener("click", () => {
        const color = element.getAttribute("data-color");
        if (color) {
          handleColorClick(color, element);
        }
      });
      element.dataset.listenerAttached = "true";
    }
  });
}

export function openAndCloseSelectIcon() {
  const selectIconContainer = document.getElementById(
    "select-group-icon-container"
  ) as HTMLElement;
  const selectIconContainerOpen = document.getElementById(
    "select-group-icon-container-open"
  ) as HTMLElement;
  const selectIconHeader = document.getElementById(
    "select-group-icon-header"
  ) as HTMLElement;

  if (
    selectIconContainer &&
    selectIconContainerOpen &&
    !selectIconContainer.dataset.listenerAttached &&
    !selectIconHeader.dataset.listenerAttached
  ) {
    selectIconContainer.addEventListener("click", () => {
      selectIconContainerOpen.classList.remove("hidden");
      selectIconContainer.classList.add("hidden");
    });
    selectIconContainer.dataset.listenerAttached = "true";

    selectIconHeader.addEventListener("click", () => {
      selectIconContainerOpen.classList.add("hidden");
      selectIconContainer.classList.remove("hidden");
    });
    selectIconHeader.dataset.listenerAttached = "true";
  }
}

export function clearInviteInput() {
  const inviteInput = document.getElementById(
    "invite-input"
  ) as HTMLInputElement;
  const inviteButton = document.getElementById(
    "send-invite-button"
  ) as HTMLButtonElement;

  if (inviteInput && inviteButton && !inviteButton.dataset.listenerAttached) {
    document.addEventListener("htmx:afterSwap", () => {
      inviteInput.value = "";
    });
    inviteButton.dataset.listenerAttached = "true";
  }
}

function clearSelectedIconAndColor() {
  selectedIcon = null;
  selectedColor = null;
}
