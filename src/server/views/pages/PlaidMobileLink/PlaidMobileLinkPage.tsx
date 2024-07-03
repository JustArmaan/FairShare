export const PlaidMobileLinkPage = (props: { connected?: boolean }) => {
  return (
    <div class="animate-fade-in flex flex-col items-center justify-center text-font-off-white h-[calc(80vh)]">
      <div
        class="hidden"
        hx-get="/empty"
        hx-swap="outerHTML"
        hx-target=".spacer"
        hx-trigger="load"
      />
      <div class="hidden" id="mobile-connect" />
      <div class="flex flex-col items-center justify-center">
        <div class="p-4 w-full bg-primary-black rounded-xl mb-10 text-lg text-font-off-white">
          {props.connected ? (
            <p class="text-center ">
              <span class="font-semibold">
                You've connected an institution!
              </span>{" "}
              You can return the the mobile app, or connect another institution
              below.
            </p>
          ) : (
            <>
              <p>
                Fairshare uses a third party financial service,{" "}
                <a class="text-accent-blue" href="https://plaid.com/">
                  Plaid
                </a>
                , to gather your transaction data. This data is used within our
                application to power our visualisations and transaction history
                features.{" "}
              </p>
              <br />
              <p>
                By clicking below, you will be prompted to connect your bank and
                begin using the application.
              </p>
            </>
          )}
        </div>
        <button
          id="connect-to-plaid"
          class="px-6 py-4 bg-accent-blue animate-fade-in hover:-translate-y-0.5 rounded-xl text-font-off-white text-xl font-semibold"
        >
          {props.connected
            ? "Connect another institution"
            : "Click to get started"}
        </button>
      </div>
    </div>
  );
};
