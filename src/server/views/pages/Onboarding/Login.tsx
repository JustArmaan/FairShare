export const Login = () => {
  return (
    <>
      <div class="w-screen h-screen">
        <div class="absolute h-2/3 z-10 animate-fade-in">
          <div class="bg-[radial-gradient(circle,_rgba(0,0,0,0)_0%,_rgba(24,22,22,1)_90%)] w-full h-full absolute"></div>
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
            {/* <a href="/auth/login"> */}
            <button
              class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl w-56 py-[0.5rem]"
              hx-get="/auth/loginPage"
              hx-swap="innerHTML"
              hx-target="body"
              hx-trigger="click"
            >
              Log In
            </button>
            {/* </a> */}
            {/* <a href="/auth/register"> */}
            <button
              class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl w-56 py-[0.5rem] mt-4"
              hx-get="/auth/registerPage"
              hx-swap="innerHTML"
              hx-target="body"
              hx-trigger="click"
            >
              Register
            </button>
            {/* </a> */}
          </div>
        </div>
      </div>
    </>
  );
};
