export const EnterInfoRegisterPage = (props: { email: string }) => {
  return (
    <div class="animate-fade-in p-6 max-w-md mx-auto text-font-off-white rounded-lg">
      <a
        hx-get="/onboard"
        hx-trigger="click"
        hx-target="body"
        hx-swap="innerHTML"
        hx-push-url="/onboard"
        class="absolute top-6 left-6 text-font-off-white text-4xl cursor-pointer flex"
      >
        <img
          src="/icons/arrow_back.svg"
          alt="back arrow icon"
          class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
        />
      </a>
      <img
        src="./images/Logo.svg"
        class="w-1/3 block max-w-32 mx-auto mb-8 mt-[7rem]"
      />
      <h1 class="text-3xl mb-4">Let's finish up!</h1>
      <form
        class="space-y-4"
        hx-post="/auth/register"
        hx-trigger="submit"
        hx-target="#app"
        hx-swap="innerHTML"
      >
        <input type="hidden" name="email" value={props.email} />
        <div>
          <label
            for="first-name"
            class="block text-sm font-medium text-font-off-white"
          >
            First Name
          </label>
          <input
            id="first-name"
            name="first-name"
            type="text"
            placeholder="First name"
            required
            class="mt-1 block w-full px-3 py-2 bg-primary-black text-white rounded-md border border-primary-black focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue"
          />
        </div>
        <div>
          <label
            for="last-name"
            class="block text-sm font-medium text-font-off-white"
          >
            Last Name
          </label>
          <input
            id="last-name"
            name="last-name"
            type="text"
            placeholder="Last name"
            required
            class="mt-1 block w-full px-3 py-2 bg-primary-black text-white rounded-md border border-primary-black focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue"
          />
        </div>
        <div>
          <label
            for="phone-number"
            class="block text-sm font-medium text-font-off-white"
          >
            Phone Number
          </label>
          <input
            id="phone-number"
            name="phone-number"
            type="tel"
            placeholder="+1"
            required
            class="mt-1 block w-full px-3 py-2 bg-primary-black text-white rounded-md border border-primary-black focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue"
          />
        </div>
        <div class="px-[3.38rem] mt-6">
          <button
            type="submit"
            class="w-full py-2 bg-accent-blue text-white rounded-lg transition mt-8"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};
