export const SignIn = () => {
  return (
    <>
      <div class="w-screen h-screen flex flex-col items-center justify-center">
        <div class="flex flex-col items-center">
          <img src="./images/Logo.svg" class="w-2/4 block max-w-28 mb-2" />{" "}
          <p class="font-bold text-3xl text-font-off-white mb-8">
            Welcome back!
          </p>
        </div>

        <div class="w-4/5">
          <div class="mb-4">
            <label
              for="username"
              class="block text-font-off-white font-semibold mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="userName"
              class="text-font-grey bg-primary-black rounded-lg w-full p-2"
              placeholder="Enter Username"
            />
          </div>

          <div class="mb-4">
            <label
              for="password"
              class="block text-font-off-white font-semibold mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="addEmail"
              class="text-font-grey bg-primary-black rounded-lg w-full p-2"
              placeholder="Enter Password"
            />
            <p class="text-right text-primary-grey mt-2">Forgot Password?</p>
          </div>
          <div class="flex flex-col text-font-off-white font-normal text-lg mt-10 text-center w-full">
            <a href="/auth/login">
              <button class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl w-full py-[0.5rem]  ">
                Log In
              </button>
            </a>
          </div>
          <div class="flex items-center my-4">
            <hr class="flex-grow border-primary-grey" />
            <span class="px-2 text-primary-grey">OR</span>
            <hr class="flex-grow border-primary-grey" />
          </div>
          <div class="flex flex-col text-font-off-white font-normal text-lg mt-10 text-center w-full">
          <a href="">
            <button class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl w-full py-[0.5rem] mb-4">
              Login with Apple
            </button>
          </a>
          <a href="">
            <button class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl w-full py-[0.5rem]  ">
              Login with Google
            </button>
          </a>
          </div>
        </div>
      </div>
    </>
  );
};
