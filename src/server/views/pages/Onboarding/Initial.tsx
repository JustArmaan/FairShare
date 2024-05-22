export const Initial = () => {
  return (
    <>
      <div class="w-screen h-screen">
        <div class="absolute h-2/3 z-10">
          <div class="bg-[radial-gradient(circle,_rgba(0,0,0,0)_35%,_rgba(24,22,22,1)_100%)] w-full h-full absolute"></div>
          <div class="bg-[linear-gradient(0deg,_rgba(24,22,22,1)_1%,_rgba(0,0,0,0)_50%)] w-full h-full absolute"></div>
          <img src="./images/color.png" class="w-screen h-full"></img>
        </div>

        <div class="absolute p-4 top-4 right-3 z-30 cursor-pointer">
          <a href="/skip" class="text-font-off-white text-sm font-semibold">
            Skip
          </a>
        </div>
        <div class="z-20 w-screen h-screen flex flex-col items-center justify-center relative">
          <img src="./images/Logo.svg" class="w-1/4 block max-w-28" />
          <div class="flex flex-col items-center text-font-off-white my-20">
            <p class="font-bold text-3xl">Hello,</p>
            <p class="font-bold text-3xl">Welcome to FairShare</p>
          </div>
          <p class="text-font-off-white font-medium text-sm mx-20 text-center pt-3">
            Welcome to FairShare, your go-to expense tracking app where you can
            start managing your personal and group finances effortlessly!
          </p>

          <div class="flex space-x-1 mt-4">
            <span class="bg-font-off-white w-2 h-2 rounded-full"></span>
            <span class="bg-font-off-white w-2 h-2 rounded-full opacity-50"></span>
            <span class="bg-font-off-white w-2 h-2 rounded-full opacity-50"></span>
            <span class="bg-font-off-white w-2 h-2 rounded-full opacity-50"></span>
          </div>
          <div class="flex flex-col text-font-off-white font-normal text-lg mt-10 text-center w-56">
            <a href="/auth/login">
              <button class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl w-full py-[0.5rem]  ">
                Start
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
