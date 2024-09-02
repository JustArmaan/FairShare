export const Initial2 = () => {
  return (
    <>
      <div class="w-screen h-screen animate-fade-in">
        <div class="bg-[linear-gradient(265deg,_#99493F_-40.41%,_#FF7969_102.86%)] h-screen w-full">
          <a
            hx-get="/onboard/scan"
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
              hx-get="/onboard/connect"
              hx-swap="innerHTML"
              hx-target="body"
              hx-trigger="click"
              class="text-font-off-white text-sm font-semibold"
            >
              Skip
            </a>
          </div>
          <div class="z-20 w-screen h-screen flex flex-col items-center relative">
            <div class="flex flex-col items-center text-font-off-white mt-[9.25rem] mb-[3rem]">
              <p class="text-4xl font-kanit w-[22rem] text-center">
                Shared Expenses? No Problem!
              </p>
            </div>
            <img
              src="/icons/sharedLogo.svg"
              class="w-2/3 block max-w-[17rem]"
            />
            <p class="text-font-off-white font-medium text-[1rem] w-[20rem] text-center mt-[4rem]">
              Add receipts to your personal profile or shared group expenses,
              and tailor the categories to your preferences.
            </p>

            <div class="flex space-x-1 mt-[4rem]">
              <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
              <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
              <span class="bg-font-off-white w-4 h-[0.625rem] rounded-full"></span>
              <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
              <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
            </div>
            <div class="flex flex-col text-font-off-white font-normal text-lg mt-2 text-center w-56">
              <button
                class="hover:-translate-y-0.5 transition-all bg-[#BE4D3F] rounded-2xl w-full py-[0.5rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                hx-get="/onboard/embark"
                hx-swap="innerHTML"
                hx-target="body"
                hx-trigger="click"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
