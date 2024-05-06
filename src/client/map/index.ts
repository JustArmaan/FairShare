import { CustomizeMap } from "./customizeMap";

async function initMap() {
  try {
    const transactionId = new URL(window.location.href).pathname
      .split("/")
      .pop();

    const response = await fetch(`/transactions/location/${transactionId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch transaction location");
    }

    const { lat, lng } = await response.json();

    let customMap = new CustomizeMap("map", new google.maps.LatLng(lat, lng));
    customMap.addTransactionMarker();
  } catch (error) {
    console.error("Error initializing map:", error);
  }
}

declare global {
  interface Window {
    initMap: () => Promise<void>;
  }
}

window.initMap = initMap;
