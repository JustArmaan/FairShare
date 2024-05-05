export class CustomizeMap {
  private _googleMap: google.maps.Map;
  private _transactionLocation: google.maps.LatLng;

  constructor(mapDivId: string, transactionLocation: google.maps.LatLng) {
    this._googleMap = new google.maps.Map(
      document.getElementById(mapDivId) as HTMLElement,
      {
        center: transactionLocation,
        zoom: 8,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      }
    );
    this._transactionLocation = transactionLocation;
  }

  public addTransactionMarker() {
    new google.maps.Marker({
      position: this._transactionLocation,
      map: this._googleMap,
    });
  }
}
