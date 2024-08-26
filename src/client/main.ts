import { main } from "./group";
import { CustomizeMap } from "./map/customizeMap";
import { setupSocketListener } from "./socket.io/socket.io";
import { splitTransfer } from "./splitTransfer/splitTransfer";
import { highlightNavigationIcons } from "./nav/nav";
import { progressBar } from "./progressBar/progressBar";
import { attachButton } from "./plaid/connect";
import { handleNavigation } from "./navigation/navigation";
import { attachFormListeners } from "./submitForm/submitForm";
import { changeHeader } from "./header/header";
import {
  handleIconClick,
  handleColorClick,
  initializeSelectedColor,
  initializeSelectedIcon,
  openAndCloseSelectIcon,
  clearInviteInput,
  initializeGroupForm,
} from "./createGroup/createGroup";
import { clipBoardCopyInviteLink } from "./inviteLink/inviteLink";
import htmx from "htmx.org";
import {
  initializeChooseFromLibraryButton,
  onMessage,
  addTakePictureButton,
} from "./receiptScanning/receiptScanning";

// !!!
// @ts-ignore
window.onMessage = onMessage;

// console.log("running");

main();
splitTransfer();
setupSocketListener();
handleNavigation();

document.body.addEventListener("htmx:afterSwap", (event) => {
  highlightNavigationIcons();
  progressBar();
  attachFormListeners();
  clipBoardCopyInviteLink();
  openAndCloseSelectIcon();
  clearInviteInput();
  initializeChooseFromLibraryButton();
  addTakePictureButton();
  initializeGroupForm();

  if (!(event.target instanceof HTMLElement)) return;
  const includeListId = new Set(["#app"]);
  if (!includeListId.has(event.target.id)) return;
  window.scrollTo({ top: 0 });

  // Re-attach event listeners for icons
  document
    .querySelectorAll<HTMLElement>("[data-category-id]")
    .forEach((iconElement) => {
      iconElement.addEventListener("click", () =>
        handleIconClick(iconElement.dataset.categoryId!, iconElement)
      );
    });

  // Re-attach event listeners for colors
  document
    .querySelectorAll<HTMLElement>("[data-color]")
    .forEach((colorElement) => {
      colorElement.addEventListener("click", () =>
        handleColorClick(colorElement.dataset.color!, colorElement)
      );
    });
});

// @ts-ignore
window.addEventListener("message", onMessage);

export const apiVersion = 0;

async function initMap() {
  try {
    const transactionId = document
      .getElementById("transaction-id")
      ?.getAttribute("data-transactionId");

    const response = await fetch(`/transactions/location/${transactionId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch transaction location");
    }

    const { lat, lng } = await response.json();

    // @ts-ignore
    let customMap = new CustomizeMap("map", new google.maps.LatLng(lat, lng));
    customMap.addTransactionMarker();
  } catch (error) {
    console.error("Error initializing map:", error);
  }
}

document.addEventListener("htmx:afterSwap", () => {
  const dateSelectorForm = document.getElementById("date-selector-form");
  const filterSelector = document.getElementById("filter-selector");

  if (filterSelector && !filterSelector.dataset.listenerAttached) {
    filterSelector?.addEventListener("click", () => {
      dateSelectorForm?.classList.toggle("hidden");
    });
    filterSelector.dataset.listenerAttached = "true";
  }

  const connectButton = document.querySelector("#connect-to-plaid");
  if (connectButton && connectButton instanceof HTMLElement) {
    connectButton.addEventListener("click", attachButton);
  }

  const navBar = document.querySelector("nav")?.querySelector("ul");
  if (window.android && navBar instanceof HTMLElement) {
    navBar.style.setProperty("padding-bottom", "0px");
  }

  const hide = document.getElementById("hide");
  const txt = document.getElementById("txt");
  resize();
  txt?.addEventListener("input", resize);

  function resize() {
    if (hide && txt) {
      //@ts-ignore
      hide.textContent = txt?.value;
      txt.style.width = hide?.offsetWidth + 10 + "px";
    }
  }
});

document.querySelector("#app")?.addEventListener("htmx:afterSwap", () => {
  const popMenu = document.querySelector(".popup-menu");
  const aMenu = document.querySelector(".menu-a");

  if (
    popMenu &&
    popMenu instanceof HTMLElement &&
    aMenu?.getAttribute("hx-get")?.includes("false")
  ) {
    htmx.ajax("GET", "/menu?open=false", {
      target: "#menuContainer",
      swap: "outerHTML",
    });
  }
});

document.addEventListener("htmx:beforeSwap", () => {
  const connectButton = document.querySelector("#connect-to-plaid");
  if (connectButton && connectButton instanceof HTMLElement) {
    connectButton.removeEventListener("click", attachButton);
  }
});

declare global {
  interface Window {
    initMap: () => Promise<void>;
    onMessage: () => void;
  }
}

document.body.addEventListener("htmx:afterSwap", async (event) => {
  await changeHeader();
});

window.initMap = initMap;
