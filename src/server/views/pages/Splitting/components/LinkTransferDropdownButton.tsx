export const LinkTransferDropdownButton = (props: { open: boolean }) => {
  if (!props.open) {
    return (
      <>
        <div id="link-transfer-target" />
        <div
          hx-swap-oob="true"
          class="mt-6 flex flex-col items-center animate-fade-in"
          id="link-transfer-container"
        >
          <button
            hx-get="/split/linkTransferComponent?open=true"
            hx-swap="outerHTML settle:0ms"
            hx-target="#link-transfer-container"
            class="flex flex-row items-center cursor:pointer hover:opacity-80"
          >
            <img
              class="mr-1 h-[18px] w-[21px]"
              src="/icons/link-transaction.svg"
            />
            <p class="text-font-grey">Link Transfer</p>
          </button>
          <button class="bg-accent-blue py-2 w-full rounded-md mt-3 mb-4 hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform">
            <p class="text-lg">Settle</p>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div id="link-transfer-container" />
      <div
        class="bg-second-black-background rounded-md p-2 mt-4 animate-fade-in"
        id="link-transfer-target"
        hx-swap-oob="true"
      >
        <div class="flex flex-row justify-between items-center text-lg">
          <p class="ml-2">Link Transfer</p>
          <p
            hx-get="/split/linkTransferComponent?open=false"
            hx-target="#link-transfer-target"
            hx-swap="outerHTML settle:0ms"
            hx-trigger="click"
            class="text-font-grey mr-2 cursor-pointer hover:opacity-80"
          >
            Cancel
          </p>
        </div>
        <p class="mt-4 mb-2 ml-2">Settled With:</p>
        <div
          hx-get={"/split/splitController/default"}
          hx-swap="outerHTML"
          hx-trigger="load"
        />
      </div>
    </>
  );
};
