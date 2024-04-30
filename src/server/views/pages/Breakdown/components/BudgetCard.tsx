export const BudgetCard = () => {
  return (
    <div class="mt-6 rounded bg-primary-faded-black p-4 flex flex-col">
      <div class="items-center flex mb-2">
        <p class="text-2xl">Rent</p>
        <div class="ml-4 rounded-full bg-accent-purple w-5 h-5"></div>
      </div>
      <p class="text-3xl tracking-tighter">$1,760.76</p>
      <div class="flex w-full items-center flex-col mt-2">
        <p class="text-2xl mb-2 font-bold">57%</p>
        <div class="bg-none drop-shadow-graph rounded-full w-3/5 aspect-square overflow-hidden relative">
          <div
            class="hover:opacity-80 transition-all absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-purple w-[174%] h-[174%]" // min size of rectange is radius*sqrt(3), or (sqrt(3)*100)%, or roughly 173.2%
            style="clip-path: polygon(50% 50%, 20% 100%, 0% 50%, 50% 0%)"
          ></div>
        </div>
      </div>
      <div class="mt-4">
        <p class="font-bold">Transactions</p>
        <div>TODO: add transaction component here</div>
      </div>
    </div>
  );
};
