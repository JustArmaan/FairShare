export const LoginPage = () => {
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
      <h1 class="text-3xl mb-4">Welcome back!</h1>
      <form class="space-y-4">
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-font-off-white"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter Username"
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
            placeholder="Enter Password"
            class="mt-1 block w-full px-3 py-2 bg-primary-black text-white rounded-md border border-primary-black focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue"
          />
        </div>
        <div class="flex justify-end">
          <a href="#" class="text-sm text-font-grey hover:underline">
            Forgot Password?
          </a>
        </div>
        <div class="px-[3.38rem] mt-6">
          <button
            type="submit"
            class="w-full py-2 bg-accent-blue text-white rounded-lg transition mt-8"
          >
            Login
          </button>
        </div>
        <div class="flex items-center justify-center my-4">
          <hr class="w-2/5 border-font-grey" />
          <span class="mx-2 text-sm text-font-grey">OR</span>
          <hr class="w-2/5 border-font-grey" />
        </div>
        <div class="px-[3.38rem]">
          <button
            type="button"
            id="login-with-apple"
            hx-get="/auth/apple"
            class="w-full py-2 bg-accent-blue text-white rounded-lg  transition flex items-center justify-center "
          >
            Login with Apple
          </button>
          <button
            type="button"
            id="login-with-google"
            hx-get="/auth/google"
            class="w-full py-2 bg-accent-blue text-white rounded-lg  transition flex items-center justify-center mt-3 "
          >
            Login with Google
          </button>
        </div>
      </form>
    </div>
  );
};
