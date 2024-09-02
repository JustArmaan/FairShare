export const ConnectItem = (props: { user: string }) => {
  return (
    <div class="h-screen animate-fade-in">
      <a
        hx-get="/onboard/master"
        hx-trigger="click"
        hx-target="body"
        hx-swap="innerHTML"
        hx-push-url="/onboard"
        class="absolute top-8 left-6 text-font-off-white text-4xl cursor-pointer flex z-30"
      >
        <img
          src="/icons/arrow_back.svg"
          alt="back arrow icon"
          class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
        />
      </a>
      <div class="absolute h-2/3 z-10">
        <div class="bg-[radial-gradient(circle,_rgba(0,0,0,0)_0%,_rgba(24,22,22,1)_90%)] w-full h-full absolute"></div>
        <div class="bg-[linear-gradient(0deg,_rgba(24,22,22,1)_20%,_rgba(0,0,0,0)_50%)] w-full h-full absolute"></div>
        <img src="./images/color.png" class="h-full "></img>
      </div>
      <div class="absolute p-4 top-4 right-3 z-30 cursor-pointer"></div>
      <div class="z-20 h-screen flex flex-col items-center relative">
        <img
          src="/images/Logo.svg"
          class="w-1/4 block max-w-[17rem] mt-[10rem]"
        />
        <div class="flex flex-col items-center text-font-off-white my-3">
          <p class="font-medium text-3xl font-kanit mt-[7.5rem]">
            Welcome, {props.user}
          </p>
        </div>
        <p class="text-font-off-white font-medium w-[18rem] text-center">
          Start tracking your expenses by connecting your bank account to our
          app.
        </p>
        <div class="flex flex-col text-font-off-white font-normal text-lg mt-2 text-center w-[13.125rem] h-[3.125rem]">
          <button
            id="connect-to-plaid"
            class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-2xl w-full py-[0.5rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] mt-8"
          >
            Click to connect
          </button>
        </div>
      </div>
    </div>
  );
};
