export const ConnectAccount = () => {
  return (
    <div
      id="app"
      class="p-6 h-[calc(100vh_-_100px)] flex w-full items-center justify-center flex-col"
    >
      <div class="p-4 w-full bg-primary-black rounded-xl mb-10 text-lg text-font-off-white">
        <p>
          Fairshare uses a third party financial service,{' '}
          <a class="text-accent-blue" href="https://plaid.com/">
            Plaid
          </a>
          , to gather your transaction data. This data is used within our
          application to power our visualisations and transaction history
          features.{' '}
        </p>
        <br />
        <p>
          By clicking below, you will be promted to connect your bank and begin
          using the application.
        </p>
      </div>
      <button
        id="connect-to-plaid"
        class="px-6 py-4 bg-accent-blue animate-fade-in hover:-translate-y-0.5 rounded-xl text-font-off-white text-xl font-semibold"
      >
        Connect your first institution!
      </button>
    </div>
  );
};
