export const ConnectAccount = () => {
  return (
    <div
      id="app"
      class="p-6 h-[calc(100vh_-_100px)] flex w-full items-center justify-center border"
    >
      <button
        id="connect-to-plaid"
        class="px-6 py-4 bg-accent-blue animate-fade-in hover:-translate-y-0.5 rounded-xl text-font-off-white text-xl font-semibold"
      >
        Connect your first institution!
      </button>
    </div>
  );
};
