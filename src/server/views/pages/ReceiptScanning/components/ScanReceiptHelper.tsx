export const ScanReceiptHelper = () => {
  return (
    <div class="w-full  text-font-off-white bg-primary-black rounded-md p-2 mb-4">
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-xl text-center font-semibold w-full mb-[1.59rem]">
          Capture or upload a receipt for automatic transcription!
        </h1>
        <img
          src="/images/scan_receipt_helper.svg"
          alt="Scan Receipt"
          class="w-[7.9rem] mb-[1.59rem]"
        />
      </div>
      <div class="pl-3">
        <p class="text-sm font-semibold">For Best Results:</p>
        <ul class="list-disc text-sm pl-5 mb-2">
          <li>Use a dark background for better contrast.</li>
          <li>Ensure good lighting without shadows.</li>
          <li>Position the receipt flat and within the border.</li>
          <li>Take multiple images for longer receipts.</li>
        </ul>
      </div>
    </div>
  );
};
