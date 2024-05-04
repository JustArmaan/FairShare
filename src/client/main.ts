document.body.addEventListener('htmx:afterSwap', () => {
  window.scrollTo({ top: 0 });
});

const apiVersion = 0;

async function getToken() {
  console.log('fetching token');
  const response = await fetch(`/api/v${apiVersion}/plaid-token`);
  const { error, data } = await response.json();

  if (error) return console.log(error);
  const { link_token } = data;
  // @ts-ignore
  const handler = Plaid.create({
    token: link_token,
    onSuccess: (public_token: string, metadata: any) => {
      console.log(public_token, metadata);
    },
    onLoad: () => {
      console.log('loaded');
    },
    onExit: (err: any | null, metadata: any) => {
      console.log(err, metadata);
    },
    onEvent: (eventName: any | null, metadata: any) => {
      console.log(eventName, metadata);
    },
  });

  handler.open();
}

try {
  getToken();
} catch (e) {
  console.log(e, 'aaa');
}
console.log('runnign?');
