import { CustomizeMap } from "./customizeMap";

export {};
function initMap() {
  let customMap = new CustomizeMap(
    "map",
    new google.maps.LatLng(49.2827, -123.1207)
  );
  return Promise.resolve();
}

declare global {
  interface Window {
    initMap: () => Promise<void>;
  }
}
window.initMap = initMap;
