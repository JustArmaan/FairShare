export const Initial1 = () => {
  return (
    <>
      <div class="w-screen h-screen animate-fade-in">
        <div class="bg-gradient-to-r from-[#453F62] via-[#A294E4] via-[#AE99DF] to-[#C5B6E7] h-screen w-full z-10">
          <a
            hx-get="/onboard/welcome"
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
                Scan & Save Your Receipts
              </p>
            </div>
            <img src="/icons/scanLogo.svg" class="w-2/3 block max-w-[17rem]" />
            <p class="text-font-off-white font-medium text-[1rem] w-[18rem] text-center mt-3">
              Easily add receipts by taking a picture, uploading an image, or
              inputting manually.
            </p>

            <div class="flex space-x-1 mt-[4rem]">
              <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
              <span class="bg-font-off-white w-4 h-[0.625rem] rounded-full"></span>
              <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
              <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
              <span class="bg-font-off-white w-2 h-[0.625rem] rounded-full opacity-50"></span>
            </div>
            <div class="flex flex-col text-font-off-white font-normal text-lg mt-2 text-center w-56">
              <button
                class="hover:-translate-y-0.5 transition-all bg-[#5A49AE] rounded-2xl w-full py-[0.5rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                hx-get="/onboard/share"
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
