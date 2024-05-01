export const Card = () => {
  return (
    <div class="bg-primary-red text-font-off-white rounded-lg shadow-lg p-4 relative h-48 overflow-hidden mb-3 max-w-96 ">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center mb-2">
          <img src="/cardAssets/scotiabank.svg" class="h-8 mr-2" />{" "}
          <h2 class="text-xl font-bold">ScotiaBank</h2>
        </div>
      </div>
      <div class="text-2xl font-semibold tracking-wider">
        8763 2736 9873 ****
      </div>
      <div class="flex justify-between items-center mt-6 mr-2 ml-2">
        <div>
          <p class="text-xs text-gray-300">Card Holder</p>
          <p class="font-medium">John Doe</p>
        </div>
        <div>
          <p class="text-xs text-gray-300">Expiry Date</p>
          <p class="font-medium">10/28</p>
        </div>
        <div class="flex items-center">
          <div class="bg-accent-yellow h-10 w-10 rounded-full"></div>
          <div class="bg-accent-red h-10 w-10 rounded-full -ml-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Card;
