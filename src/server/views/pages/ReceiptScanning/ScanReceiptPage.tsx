import { ScanReceiptHelper } from "./components/ScanReceiptHelper";

const AddReceiptPage = () => {
  return (
    <div class="camera-capture-container text-left">
      {/* <div class="flex justify-start w-fit items-center mt-2 mb-1">
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
      </div> */}
      <div
        id="errorContainer"
        class="text-accent-red bg-opacity-10 border border-accent-red p-4 rounded shadow hidden text-center my-4"
      ></div>
      <div>
        <div class="flex items-center w-full">
          <ScanReceiptHelper />
        </div>
        <div id="imagePreviewAddPage" class="mt-1 mb-[2.94rem] hidden"></div>
        <input
          type="hidden"
          id="serializedImages"
          name="serializedImages"
          value=""
        ></input>
        <div class="flex flex-col px-[1rem] buttonContainer">
          <label
            id="chooseFromLibraryButton"
            for="fileInputAddPage"
            class="button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg mb-[2rem] text-center cursor-pointer"
          >
            Choose from Library
          </label>
          <label
            id="takePictureButton"
            class="button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg mb-[2rem] text-center cursor-pointer"
          >
            Take Picture
          </label>
          <button
            class="button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg cursor-pointer"
            id="addManuallyButton"
            hx-get="/receipt/addManually"
            hx-target="#app"
            hx-swap="innerHTML"
            hx-trigger="click"
            hx-push-url="/receipt/addManually"
          >
            Add Manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReceiptPage;
