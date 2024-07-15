export const CaptureCameraPage = () => {
  return (
    <div class="camera-capture-container text-center p-5">
      <h1 class="text-font-off-white text-xl mb-5">Capture Receipt</h1>
      <div class="video-container">
        <video
          id="cameraVideo"
          class="w-full max-w-xs mx-auto"
          autoplay
        ></video>
        <button
          id="captureButton"
          class="button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg mt-5"
        >
          Capture Photo
        </button>
        <canvas id="canvas" class="hidden"></canvas>
      </div>
      <div id="imagePreviewCapturePage" class="mt-5"></div>
    </div>
  );
};
