
import { main } from "./group";

main();

document.body.addEventListener('htmx:afterSwap', () => {
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
        console.log(public_token, metadata);
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

try {
  /*
  const connected = await isConnectedToPlaid();
  if (false && !connected) {
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
    }
  }
  */
} catch (error) {
  console.log(error);
}

