export let selectedIcon: string | null = null;
export let selectedColor: string | null = null;

export function initializeSelectedIcon() {
  const selectedIconInput = document.getElementById(
    "selectedIcon"
  ) as HTMLInputElement | null;
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
  ) as HTMLInputElement | null;
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

export function handleIconClick(iconId: string, iconElement: HTMLElement) {
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
  ) as HTMLInputElement | null;
  if (selectedIconInput !== null) {
    selectedIconInput.value = iconId;
  } else {
    console.error("selectedIconInput is null");
  }
}

export function handleColorClick(
  colorName: string,
  colorElement: HTMLElement
): void {
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
}

// export function clearInviteInput() {
//   const inviteInput = document.getElementById(
//     "invite-input"
//   ) as HTMLInputElement;
//   const inviteButton = document.getElementById(
//     "send-invite-button"
//   ) as HTMLButtonElement;

//   if (inviteInput && inviteButton) {
//     inviteButton.addEventListener("click", () => {
//       inviteInput.value = "";
//     });
//   }
// }
