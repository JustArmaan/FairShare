import { main } from "./group";
import { CustomizeMap } from "./map/customizeMap";
import { setupSocketListener } from "./socket.io/socket.io";
import { splitTransfer } from "./splitTransfer/splitTransfer";
import { highlightNavigationIcons } from "./nav/nav";
import htmx from "htmx.org";
import { progressBar } from "./progressBar/progressBar";
import { attachButton } from "./plaid/connect";
import { handleNavigation } from "./navigation/navigation";
import { attachFormListeners, submitForm } from "./submitForm/submitForm";
import { changeHeader } from "./header/header";

main();
splitTransfer();
setupSocketListener();
handleNavigation();

document.body.addEventListener("htmx:afterSwap", (event) => {
  highlightNavigationIcons();
  progressBar();
  attachFormListeners();

  if (!(event.target instanceof HTMLElement)) return;
  const excludeListId = new Set(["institutionSelector"]);
  if (excludeListId.has(event.target.id)) return;
  window.scrollTo({ top: 0 });
});

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
  console.log(connectButton);
  if (connectButton && connectButton instanceof HTMLElement) {
    connectButton.addEventListener("click", attachButton);
  }

  const navBar = document.querySelector("nav")?.querySelector("ul");
  if (window.android && navBar instanceof HTMLElement) {
    console.log("setting prop")
    navBar.style.setProperty("padding-bottom", "0px");
  }
});

document.addEventListener("htmx:beforeSwap", () => {
  const connectButton = document.querySelector("#connect-to-plaid");
  if (
    connectButton &&
    connectButton instanceof HTMLElement &&
    !window.location.pathname.includes("mobile/link")
  ) {
    connectButton.removeEventListener("click", attachButton);
  }
});

declare global {
  interface Window {
    initMap: () => Promise<void>;
  }
}

document.body.addEventListener("htmx:afterSwap", async (event) => {
  await changeHeader();
});

window.initMap = initMap;
