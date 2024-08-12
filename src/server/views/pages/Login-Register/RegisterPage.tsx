export const RegisterPage = () => {
  return (
    <div class="animate-fade-in p-6 max-w-md mx-auto text-font-off-white rounded-lg shadow-lg">
      <a
        hx-get="/onboard"
        hx-trigger="click"
        hx-target="#app"
        hx-swap="innerHTML"
        hx-push-url="/onboard"
        class="text-font-off-white text-4xl cursor-pointer my-2 flex items-center"
      >
        <img
          src="/icons/arrow_back_ios.svg"
          alt="back arrow icon"
          class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
        />
      </a>
      <img
        src="./images/Logo.svg"
        class="w-1/3 block max-w-32 mx-auto mb-8 mt-2"
      />
      <h1 class="text-3xl mb-4">Create an account</h1>
      <form class="space-y-4">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-font-off-white"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            required
            class="mt-1 block w-full px-3 py-2 bg-primary-black text-white rounded-md border border-primary-black focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue"
          />
        </div>
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-font-off-white"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Create password"
            class="mt-1 block w-full px-3 py-2 bg-primary-black text-white rounded-md border border-primary-black focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue"
          />
        </div>
        <div>
          <label
            for="confirm-password"
            class="block text-sm font-medium text-font-off-white"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            required
            placeholder="Re-enter password"
            class="mt-1 block w-full px-3 py-2 bg-primary-black text-white rounded-md border border-primary-black focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue"
          />
        </div>
        <div class="px-[3.38rem] mt-6">
          <button
            hx-post="/auth/registerContinue"
            hx-trigger="click"
            hx-target="body"
            hx-swap="innerHTML"
            class="w-full py-2 bg-accent-blue text-white rounded-lg transition mt-8"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};
