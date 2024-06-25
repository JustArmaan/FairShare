import { apiVersion } from "../main";
import htmx from "htmx.org";

export function attachButton(event: Event) {
  if (event.currentTarget instanceof HTMLButtonElement) {
    if (event.currentTarget.innerText === "Add a new institution") {
      addNewInstitution();
      event.currentTarget.innerText = "Loading...";
    } else if (event.currentTarget.innerText !== "Loading...") {
      runLinkSetup();
      event.currentTarget.innerText = "Loading...";
    }
  }
}

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
        console.log("loaded");
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

async function addNewInstitution() {
  try {
    const publicToken = await getToken();
    const response = await fetch(`/api/v${apiVersion}/plaid-public-token`, {
      method: "POST",
      body: JSON.stringify({ publicToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      console.log("Token pushed succesfully");
      const response = await fetch(`/api/v${apiVersion}/sync`);
      if (response.status === 200) {
        // run htmx ajax call to fetch new institution
        htmx.ajax("GET", "/institutions/page", {
          target: "#app",
          swap: "innerHTML",
        });
      }
    } else {
      console.log((await response.json()).error);
    }
  } catch (error) {
    console.log(error);
  }
}

async function runLinkSetup() {
  try {
    const connected = await isConnectedToPlaid();
    if (!connected) {
      const publicToken = await getToken();
      const response = await fetch(`/api/v${apiVersion}/plaid-public-token`, {
        method: "POST",
        body: JSON.stringify({ publicToken }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        console.log("Token pushed succesfully");
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
