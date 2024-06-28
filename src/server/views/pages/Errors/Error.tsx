export function ErrorPage(props: { status: number | string }) {
  return (
    <div class="bg-primary-black-page flex flex-col items-center justify-center h-full my-20">
      <p class="font-semibold text-6xl text-font-off-white mb-6">
        {props.status}
      </p>
      <img
        id="notfound"
        class="h-48"
        src="/activeIcons/notfound.svg"
        alt="not found icon"
      />
      <p class="font-semibold text-4xl text-font-off-white mb-7 mt-4">
        Page Not Found
      </p>
      <p class="text-primary-grey text-lg text-center max-w-screen-sm px-6 sm:px-6 md:px-8">
        Oops, seems like you wandered off track. Let's get you back to managing
        your expenses!
      </p>
      <div class="flex flex-row justify-center text-card-black mt-8">
        <a
          href="/"
          class="hover:-translate-y-0.5 transition-transform font-semibold px-12 py-3 bg-font-off-white rounded-xl h-fit text-xl"
        >
          Back Home
        </a>
      </div>
    </div>
  );
}
