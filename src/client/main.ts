import { main } from './group';
import { CustomizeMap } from './map/customizeMap';

main();

document.body.addEventListener('htmx:afterSwap', (event) => {
  if (!(event.target instanceof HTMLElement)) return;
  console.log(event.target);
  const excludeListId = new Set(['institutionSelector']);
  if (excludeListId.has(event.target.id)) return;
  window.scrollTo({ top: 0 });
});

const apiVersion = 0;

async function getToken() {
  const response = await fetch(`/api/v${apiVersion}/plaid-token`);
  const { error, data } = await response.json();

  if (error) return console.log(error);
  const { link_token } = data;
  return new Promise((resolve, reject) => {
    // @ts-ignore
    const handler = Plaid.create({
      token: link_token,
      onSuccess: (public_token: string, metadata: any) => {
        resolve(public_token);
      },
      onLoad: () => {
        console.log('loaded');
      },
      onExit: (err: any | null, metadata: any) => {
        if (err) reject(err);
        console.log(err, metadata);
      },
      onEvent: (eventName: any | null, metadata: any) => {
        console.log(eventName, metadata);
      },
    });

    handler.open();
  });
}

async function isConnectedToPlaid(): Promise<boolean> {
  const response = await fetch(`/api/v${apiVersion}/connected`);
  const { error, data } = await response.json();
  if (error) {
    throw new Error(error);
  }

  return data.connected;
}

async function hasAccounts(): Promise<boolean> {
  const response = await fetch(`/api/v${apiVersion}/has-accounts`);
  const { error, data } = await response.json();
  if (error) {
    throw new Error(error);
  }

  return data.connected;
}

async function runLinkSetup() {
  try {
    const connected = await isConnectedToPlaid();
    if (!connected) {
      const publicToken = await getToken();
      const response = await fetch(`/api/v${apiVersion}/plaid-public-token`, {
        method: 'POST',
        body: JSON.stringify({ publicToken }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        console.log('Token pushed succesfully');
        const response = await fetch(`/api/v${apiVersion}/sync`);
        if (response.status === 200) {
          setInterval(async () => {
            const connected = await hasAccounts();
            if (connected) window.location.reload();
          }, 500);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function initMap() {
  try {
    const transactionId = document
      .getElementById('transaction-id')
      ?.getAttribute('data-transactionId');

    const response = await fetch(`/transactions/location/${transactionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transaction location');
    }

    const { lat, lng } = await response.json();

    let customMap = new CustomizeMap('map', new google.maps.LatLng(lat, lng));
    customMap.addTransactionMarker();
  } catch (error) {
    console.error('Error initializing map:', error);
  }
}

function attachButton(event: Event) {
  if (event.currentTarget instanceof HTMLButtonElement) {
    if (event.currentTarget.innerText !== 'Loading...') {
      runLinkSetup();
      event.currentTarget.innerText = 'Loading...';
    }
  }
}

document.addEventListener('htmx:afterSwap', () => {
  const dateSelectorForm = document.getElementById('date-selector-form');
  const filterSelector = document.getElementById('filter-selector');

  if (filterSelector && !filterSelector.dataset.listenerAttached) {
    filterSelector?.addEventListener('click', () => {
      dateSelectorForm?.classList.toggle('hidden');
    });
    filterSelector.dataset.listenerAttached = 'true';
  }

  const connectButton = document.querySelector('#connect-to-plaid');
  if (connectButton && connectButton instanceof HTMLElement) {
    connectButton.addEventListener('click', attachButton);
  }
});

document.addEventListener('htmx:beforeSwap', () => {
  const connectButton = document.querySelector('#connect-to-plaid');
  if (connectButton && connectButton instanceof HTMLElement) {
    connectButton.removeEventListener('click', attachButton);
  }
});

declare global {
  interface Window {
    initMap: () => Promise<void>;
  }
}

window.initMap = initMap;
