const steps = [0, 1, 2, 3, 4];

type PageDetails = {
  header: string;
  description: string;
  src: string;
  gradient: string;
  buttonColor: string;
};

const pages: PageDetails[] = [
  {
    header: "Scan & Save Your Receipts",
    description:
      "Easily add receipts by taking a picture, uploading an image, or inputting manually.",
    src: "/icons/scanLogo.svg",
    gradient:
      "bg-gradient-to-r from-[#453F62] via-[#A294E4] via-[#AE99DF] to-[#C5B6E7]",
    buttonColor: "5A49AE",
  },
  {
    header: "Shared Expenses? No Problem!",
    description:
      "Add receipts to your personal profile or shared group expenses, and tailor the categories to your preferences.",
    src: "/icons/sharedLogo.svg",
    gradient: "bg-[linear-gradient(265deg,_#99493F_-40.41%,_#FF7969_102.86%)]",
    buttonColor: "BE4D3F",
  },
  {
    header: "Embark on a Financial Clarity Journey",
    description:
      "Discover detailed reports for a deeper understanding of your finances. Unlock insights easily with our user-friendly summaries.",
    src: "/icons/journeyLogo.svg",
    gradient: "bg-[linear-gradient(141deg,_#2D6692_5.44%,_#56ADEE_81.91%)]",
    buttonColor: "1C649B",
  },
  {
    header: "Master Financial Stability",
    description:
      "Set goals and budgets for yourself or your groups, and stay on track to collect achievements!",
    src: "/icons/groupLogo.svg",
    gradient: "bg-[linear-gradient(293deg,_#20B58D_4.54%,_#0E4F3E_94.23%)]",
    buttonColor: "0A4737",
  },
];

export const Intro = (props: { index: number }) => {
  const activePage = pages[props.index - 1];
  return (
    <div
      id="onboarding-intro"
      class={`animate-fade-in text-font-off-white h-screen ${props.index !== 0 ? activePage.gradient : ""} flex flex-col`}
    >
      <div class="flex flex-row justify-between items-center w-full z-40 pt-6 px-6 ">
        {props.index !== 0 && (
          <img
            hx-get={`/onboard/welcome?step=${props.index - 1}`}
            hx-swap="outerHTML"
            hx-target="#onboarding-intro"
            hx-push-url={`/onboard/welcome?step=${props.index - 1}`}
            src="/icons/arrow_back.svg"
            class="w-6 h-6 hover:-translate-y-0.5 transition-transform rotate-[0.000001deg] cursor-pointer"
          />
        )}
        <button
          hx-get="/onboard/welcome?step=4"
          hx-swap="outerHTML"
          hx-target="#onboarding-intro"
          hx-push-url="/onboard/welcome?step=4"
          class="hover:-translate-y-0.5 hover:opacity-90 transition-transform rotate-[0.000001deg] cursor-pointer"
        >
          <span class="font-semibold">Skip</span>
        </button>
      </div>
      {props.index === 0 && <Page1Splash />}
      <div
        class={`z-30 relative flex items-center flex-col ${props.index === 0 ? "h-3/5 justify-between" : "justify-center h-full"}`}
      >
        <div class="text-center mx-2 ">
          {props.index === 0 ? (
            <>
              <h1 class="text-3xl font-semibold mb-2">Hello,</h1>
              <h2 class="text-3xl font-semibold">Welcome to FairShare</h2>
            </>
          ) : (
            <h1 class="text-4xl font-semibold my-2 mx-2">
              {activePage.header}
            </h1>
          )}
        </div>
        {props.index !== 0 && (
          <img
            src={activePage.src}
            class="max-w-80 w-full h-96 px-10 block animate-fade-in"
          />
        )}
        <div
          class={`mx-10 mb-16 flex flex-col items-center  ${props.index === 0 ? "h-4/5 justify-center" : " justify-start"} gap-6 `}
        >
          <p class="text-center font-medium w-fit">
            {props.index === 0
              ? `Welcome to FairShare, your go-to expense tracking app where you can
            start managing your personal and group finances effortlessly!`
              : activePage.description}
          </p>
          <div class="flex flex-row items-center justify-center gap-1.5">
            {steps.map((step) => (
              <div
                class={`rounded-full bg-font-off-white aspect-square h-[9px] ${props.index !== step ? "w-[9px] bg-opacity-80" : "w-[1.0rem]"}`}
              />
            ))}
          </div>
          <button
            hx-get={
              props.index !== 4
                ? `/onboard/welcome?step=${props.index + 1}`
                : "/onboard/connect"
            }
            hx-swap="outerHTML"
            hx-target="#onboarding-intro"
            hx-push-url={
              props.index !== 4
                ? `/onboard/welcome?step=${props.index + 1}`
                : "/onboard/connect"
            }
            class={`${props.index === 0 && "bg-accent-blue"} cursor-pointer flex items-center py-3 w-full max-w-64 justify-center mx-0 bg-accent-blue rounded-lg hover:-translate-y-0.5 transition-transform drop-shadow-lg rotate-[0.000001deg]`}
            style={
              props.index !== 0
                ? `background-color: #${activePage.buttonColor};`
                : undefined
            }
          >
            <span class="font-medium">
              {props.index === 0
                ? "Start"
                : props.index === 4
                  ? "All Done"
                  : "Next"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Page1Splash = () => {
  return (
    <div class="h-2/5 flex justify-center items-center">
      <div class="absolute z-0 animate-fade-in top-0 h-full">
        <div class="bg-[radial-gradient(circle,_rgba(0,0,0,0)_0%,_rgba(24,22,22,1)_90%)] w-full h-full absolute"></div>
        <div class="bg-[linear-gradient(0deg,_rgba(24,22,22,1)_20%,_rgba(0,0,0,0)_50%)] w-full h-full absolute"></div>
        <img src="/images/color.webp" class="w-screen h-full"></img>
      </div>
      <img src="/images/Logo.svg" class="relative block w-36 z-40" />
    </div>
  );
};
