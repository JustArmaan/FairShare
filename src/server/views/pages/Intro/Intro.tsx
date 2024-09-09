const steps = [0, 1, 2, 3, 4];

export const Intro = (props: { index: number }) => {
  props.index = 0;
  return (
    <div class="text-font-off-white h-screen">
      <div class="h-2/5 flex justify-center items-center">
        <div class="absolute z-0 animate-fade-in">
          <div class="bg-[radial-gradient(circle,_rgba(0,0,0,0)_0%,_rgba(24,22,22,1)_90%)] w-full h-full absolute"></div>
          <div class="bg-[linear-gradient(0deg,_rgba(24,22,22,1)_20%,_rgba(0,0,0,0)_50%)] w-full h-full absolute"></div>
          <img src="/images/color.png" class="w-screen h-full "></img>
        </div>
        <img src="/images/Logo.svg" class="relative block w-36 z-40" />
      </div>
      <div class="z-30 relative flex items-center justify-between flex-col h-3/5">
        <div class="text-center mx-2">
          <h1 class="text-4xl font-semibold mb-2">Hello,</h1>
          <h2 class="text-3xl font-semibold">Welcome to FairShare</h2>
        </div>
        <div class="mx-16 flex flex-col items-center justify-center h-4/5 gap-6">
          <p class="text-center font-medium">
            Welcome to FairShare, your go-to expense tracking app where you can
            start managing your personal and group finances effortlessly!
          </p>
          <div class="flex flex-row items-center justify-center gap-1.5">
            {steps.map((step) => (
              <div
                class={`rounded-full bg-font-off-white h-[0.5rem] ${props.index !== step ? "w-[0.5rem] bg-opacity-80" : "w-[1.2rem]"}`}
              />
            ))}
          </div>
          <button class="flex items-center py-2 px-28 bg-accent-blue rounded-lg">
            <span class="font-semibold">Start</span>
          </button>
        </div>
      </div>
    </div>
  );
};
