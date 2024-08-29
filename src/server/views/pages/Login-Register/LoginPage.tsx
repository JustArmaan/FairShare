export const LoginPage = () => {
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
      <h1 class="text-[2rem] mb-4 font-kanit">Welcome back!</h1>
      <form class="space-y-4" action="/auth/email" method="get">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-font-off-white"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="Enter Email"
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
        <div class="px-[3.38rem] mt-2">
          <button
            type="submit"
            class="w-full py-2 bg-accent-blue text-white rounded-lg transition mt-8"
          >
            Login
          </button>
        </div>
      </form>

      <div class="flex items-center justify-center my-4">
        <hr class="w-2/5 border-font-grey" />
        <span class="mx-2 text-sm text-font-grey">OR</span>
        <hr class="w-2/5 border-font-grey" />
      </div>
      <div class="px-[3.38rem]">
        <a href="/auth/apple">
          <button
            type="button"
            id="loginWithApple"
            class="w-full py-2 bg-accent-blue text-white rounded-lg  transition flex items-center justify-center "
          >
            Login with Apple
          </button>
        </a>
        <a href="/auth/google">
          <button
            type="button"
            id="loginWithGoogle"
            class="w-full py-2 bg-accent-blue text-white rounded-lg  transition flex items-center justify-center mt-3 "
          >
            Login with Google
          </button>
        </a>
      </div>
    </div>
  );
};
