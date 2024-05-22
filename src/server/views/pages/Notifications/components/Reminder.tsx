export const Reminder = () => {
  return (
    <div class="animate-fade-in">
  <button id={``} class={`transaction rounded-xl w-full h-fit`}>
    <div class={`rounded-2xl mt-2`}>
      <div class="hover:-translate-y-0.5 cursor-pointer transition-all mt-4 bg-primary-black p-2 rounded-xl shadow-md mb-1 flex items-center justify-between relative">
        <div class="flex items-center">
          <div class={`p-3 pl-4 pr-4 mr-4 bg-category-color-0 rounded-xl`}>
            <div class="flex items-center justify-center w-10 h-10">
              {/* categories same as tranactions */}
              <img src="/icons/dentist.svg" alt="" class="w-10" />
            </div>
          </div>
          <div class="flex flex-col">
            <p class="text-font-off-white font-semibold w-fit flex items-center">
              Account:{" "}
              {/* account number */}
              <span class="text-font-off-white font-normal ml-1">#1132457</span>
              <span class="absolute text-xs text-font-grey m-2.5 items-end right-0 top-0">2m ago</span>
            </p>
            <p class="text-font-off-white">Will contain some message</p>
            {/* Some function that checks status and either choses blinking blue or check mark */}
            <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-accent-blue opacity-75 items-end right-5 top-[50%]"></span>
            <span class="absolute inline-flex h-2 w-2 rounded-full bg-accent-blue opacity-75 items-end right-5 top-[50%]"></span>
          </div>
        </div>
      </div>
    </div>
  </button>
</div>

  );
};

export default Reminder;
