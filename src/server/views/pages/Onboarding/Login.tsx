export const Login = () => {
  return (
    <>
      <div class="w-screen h-screen">
        <div class="absolute h-2/3 z-10">
          {/* <div class="absolute bg-[radial-gradient(circle,_rgba(0,145,255,0.9)_0%,_rgba(0,255,187,0)_50%)] w-2/3 aspect-square rounded-full skew-x-12 blur-xl"></div>
          <div class="absolute top-0 right-0 bg-[radial-gradient(circle,_rgba(44,0,255,1)_0%,_rgba(44,0,255,0)_50%)] w-2/3 aspect-square rounded-full skew-x-12 blur-xl"></div>
          <div class="absolute right-0 bottom-0 bg-[radial-gradient(circle,_rgba(255,168,0,0.9)_0%,_rgba(255,168,0,0)_50%)] w-full aspect-square rounded-full skew-x-12 blur-xl"></div>
          <div class="absolute bottom-0 left-0 bg-[radial-gradient(circle,_rgba(0,255,187,0.9)_0%,_rgba(0,255,187,0)_50%)] w-4/5 aspect-square rounded-full -skew-x-6 blur-xl"></div> */}
          <div class="bg-[linear-gradient(0deg,_rgba(24,22,22,1)_20%,_rgba(0,0,0,0)_50%)] w-full h-full absolute"></div>
          <img src="./images/color.png" class="w-screen h-full"></img>
        </div>
        <div class="z-20 w-screen h-screen flex flex-col items-center justify-center relative">
          <img src="./images/Logo.svg" class="w-1/4 block max-w-28" />
          <div class="flex flex-col items-center text-font-off-white my-20">
            <p class="font-bold text-3xl">FairShare</p>
            <p class="text-lg font-semibold">
              Making sure you get your fair share
            </p>
          </div>
          <div class="flex flex-col text-font-off-white font-semibold text-lg mt-10">
            <a href="/auth/login">
              <button class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl w-56 py-[0.5rem]  ">
                Log In
              </button>
            </a>
            <a href="/auth/register">
              <button class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl w-56 py-[0.5rem] mt-4">
                Register
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
