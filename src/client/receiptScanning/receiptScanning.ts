function isMobileDevice(): boolean {
  return /Mobi|Android/i.test(navigator.userAgent);
}

export function initializeCamera(): void {
  const video = document.getElementById("cameraVideo") as HTMLVideoElement;
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const captureButton = document.getElementById("captureButton");
  const imagePreviewCapturePage = document.getElementById(
    "imagePreviewCapturePage"
  );

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error("getUserMedia not supported on this browser.");
    return;
  }

  if (video && canvas && captureButton && imagePreviewCapturePage) {
    console.log("Elements found, initializing camera...");

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: isMobileDevice() ? "environment" : "user" },
      })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        console.log("Camera stream started");
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
      });

    captureButton.addEventListener("click", () => {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      const img = document.createElement("img");
      img.src = canvas.toDataURL("image/png");
      img.className = "w-full max-w-xs mx-auto";
      imagePreviewCapturePage.innerHTML = "";
      imagePreviewCapturePage.appendChild(img);

      const stream = video.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    });
  } else {
    console.error("Required elements not found for initializing camera");
  }
}

export function addFileInput() {
  document.addEventListener("htmx:afterSwap", () => {
    const fileInputAddPage = document.getElementById("fileInputAddPage");
    const imagePreviewAddPage = document.getElementById("imagePreviewAddPage");

    if (fileInputAddPage && imagePreviewAddPage) {
      fileInputAddPage.addEventListener("change", (e) => {
        const file = (e.target as HTMLInputElement)?.files?.[0];
        if (file) {
          const reader = new FileReader();
          imagePreviewAddPage.classList.remove("hidden");
          reader.onload = function (event) {
            const img = document.createElement("img");
            img.src = event.target?.result as string;
            img.className = "w-full max-w-xs mx-auto";
            imagePreviewAddPage.innerHTML = "";
            imagePreviewAddPage.appendChild(img);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });
}
