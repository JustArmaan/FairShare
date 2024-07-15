export const AddReceiptPage = () => {
  return (
    <div class="camera-capture-container text-left">
      <div class="flex justify-start w-fit items-center mt-2 mb-1">
        <a
          hx-get={"/home/page/default"}
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          hx-push-url={"/home/page/default"}
          class="text-font-off-white text-4xl cursor-pointer"
        >
          <img
            src="/icons/arrow_back_ios.svg"
            alt="back arrow icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          />
        </a>
      </div>
      <div class="px-[3.69rem]">
        <div class="flex align-center">
          <h1 class="text-font-off-white text-xl mr-1 mb-[1rem]">
            Take photo of Receipt
          </h1>
          <img src="/activeIcons/info.svg" alt="info icon" />
        </div>
        <div id="imagePreviewAddPage" class="mt-1 mb-[2.94rem] hidden"></div>
        <input
          type="file"
          accept="image/*"
          id="fileInputAddPage"
          class="hidden"
        />
        <div class="flex flex-col ">
          <label
            for="fileInputAddPage"
            class="button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg mb-[2rem] text-center cursor-pointer"
          >
            Choose from Library
          </label>
          <button
            class="button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg cursor-pointer"
            hx-get="/receipt/captureCamera"
            hx-target="#app"
            hx-swap="innerHTML"
            hx-trigger="click"
          >
            Open Camera
          </button>
        </div>
      </div>
    </div>
  );
};
