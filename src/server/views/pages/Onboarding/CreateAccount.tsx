export const CreateAccount = () => {
  return (
    <>
      <div class="w-screen h-screen flex flex-col items-center justify-center">
        <div class="flex flex-col items-center">
          <img src="./images/Logo.svg" class="w-2/4 block max-w-28 mb-2" />{" "}
          <p class="font-bold text-3xl text-font-off-white mb-8">
            Create an account
          </p>
        </div>

        <div class="w-4/5">
          <div class="mb-4">
            <label
              for="email"
              class="block text-font-off-white font-semibold mb-1"
            >
              Email address
            </label>
            <input
              type="text"
              id="email"
              name="email"
              class="text-font-grey bg-primary-black rounded-lg w-full p-2"
              placeholder="Enter email"
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
              class="text-font-grey bg-primary-black rounded-lg w-full p-2 mb-4"
              placeholder="Create password"
            />
            <input
              type="password"
              id="password"
              name="addEmail"
              class="text-font-grey bg-primary-black rounded-lg w-full p-2"
              placeholder="Re-enter password"
            />
          </div>
          <div class="flex flex-col text-font-off-white font-normal text-lg w-full text-center">
            <a href="/auth/login">
              <button class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl py-[0.5rem] w-full ">
                Continue
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
