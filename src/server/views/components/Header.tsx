export const Header = () => {
  return (
    <div class="header bg-font-black items-end flex justify-between px-4 py-2">
      <a
        class="absolute"
        hx-trigger="click"
        hx-target="#app"
        hx-get="/home"
        hx-push-url="true"
      >
        <img src="/images/Logo.svg" alt="Logo" class="max-w-s"></img>
      </a>
      <p class="text-2xl text-font-off-white text-center font-bold w-full pt-4">
        Fairshare
      </p>
    </div>
  );
};
