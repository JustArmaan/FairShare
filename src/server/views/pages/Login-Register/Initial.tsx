export const Initial = () => {
  return (
    <>
      <div class="w-screen h-screen animate-fade-in">
        <div class="absolute h-2/3 z-10">
          <div class="bg-[radial-gradient(circle,_rgba(0,0,0,0)_0%,_rgba(24,22,22,1)_90%)] w-full h-full absolute"></div>
          <div class="bg-[linear-gradient(0deg,_rgba(24,22,22,1)_20%,_rgba(0,0,0,0)_50%)] w-full h-full absolute"></div>
          <img src="./images/color.png" class="w-screen h-full "></img>
        </div>
        <a
          hx-get="/onboard"
          hx-trigger="click"
          hx-target="body"
          hx-swap="innerHTML"
          class="absolute top-8 left-6 text-font-off-white text-4xl cursor-pointer flex z-30"
        >
          <img
            src="/icons/arrow_back.svg"
            alt="back arrow icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          />
        </a>
        <div class="absolute p-4 top-4 right-3 z-30 cursor-pointer">
          <a
            hx-get="/auth/registerPage"
            hx-swap="innerHTML"
            hx-target="body"
            hx-trigger="click"
            class="text-font-off-white text-sm font-semibold"
          >
            Skip
          </a>
        </div>
        <div class="z-20 w-screen h-screen flex flex-col items-center justify-center relative">
          <img src="./images/Logo.svg" class="w-1/4 block max-w-[17rem]" />
          <div class="flex flex-col items-center text-font-off-white my-3">
            <p class="font-bold text-3xl">Hello,</p>
            <p class="font-medium text-4xl font-kanit">Welcome to FairShare</p>
          </div>
          <p class="text-font-off-white font-medium text-[1rem] w-[18rem] text-center pt-3">
            Welcome to FairShare, your go-to expense tracking app where you can
            start managing your personal and group finances effortlessly!
          </p>

          <div class="flex space-x-1 mt-[10rem]">
            <span class="bg-font-off-white w-4 h-[0.625rem] rounded-full"></span>
            <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
            <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
            <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
            <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
          </div>
          <div class="flex flex-col text-font-off-white font-normal text-lg mt-2 text-center w-[13.125rem] h-[3.125rem]">
            <button
              class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-2xl w-full py-[0.5rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] "
              hx-get="/onboard/scan"
              hx-swap="innerHTML"
              hx-target="body"
              hx-trigger="click"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
