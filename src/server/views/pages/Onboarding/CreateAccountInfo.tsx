export const CreateAccountInfo = () => {
  return (
    <>
      <div class="w-screen h-screen flex flex-col items-center justify-center">
        <div class="flex flex-col items-center">
          <img src="./images/Logo.svg" class="w-2/4 block max-w-28 mb-2" />{" "}
          <p class="font-bold text-3xl text-font-off-white mb-8">
            Let's Finish Up!
          </p>
        </div>

        <div class="w-4/5">
          <div class="mb-4">
            <label
              for="firstName"
              class="block text-font-off-white font-semibold mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              class="text-font-grey bg-primary-black rounded-lg w-full p-2 mb-4"
              placeholder="First name"
            />
            <label
              for="lastName"
              class="block text-font-off-white font-semibold mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              class="text-font-grey bg-primary-black rounded-lg w-full p-2 mb-4"
              placeholder="Last name"
            />
            <label
              for="phone"
              class="block text-font-off-white font-semibold mb-1"
            >
              Phone Number
            </label>
            <div class="flex items-center bg-primary-black rounded-lg p-2">
              <span class="text-font-grey mr-2">+1</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                class="text-font-grey bg-primary-black rounded-lg flex-grow"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div class="flex flex-col text-font-off-white font-normal text-lg w-full text-center">
            <a href="/auth/login">
              <button class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl py-[0.5rem] w-full ">
                Create Account
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
