export function ErrorPage(props: { status: number | string }) {
  return (
    <div class="text-font-off-white flex flex-col items-center justify-center h-[80vh] mx-10">
      <h1 class="text-3xl font-semibold">{props.status}</h1>
      <p class="text-center mb-10 mt-4">
        An error has occurred. We'll look into it as soon as we can.
      </p>
      <a href="/">
        <button class="rounded-2xl py-3 px-4 bg-accent-blue hover:-translate-y-0.5 transition-all">
          <p class="font-semibold text-lg">Head back home</p>
        </button>
      </a>
    </div>
  );
}
