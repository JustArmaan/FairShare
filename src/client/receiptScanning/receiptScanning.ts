function handleReceivedImage(base64Image: string): void {
  alert("handleReceivedImage called with data: " + base64Image);

  const imagePreviewAddPage = document.getElementById("imagePreviewAddPage");

  if (imagePreviewAddPage) {
    const img = document.createElement("img");
    img.src = `data:image/png;base64,${base64Image}`;
    img.className = "w-full max-w-xs mx-auto";
    imagePreviewAddPage.innerHTML = ""; // Clear any existing content
    imagePreviewAddPage.appendChild(img);
    imagePreviewAddPage.classList.remove("hidden");

    addRetakeAndAddMoreButtons(); // Add the retake and add more buttons
  } else {
    alert("imagePreviewAddPage element not found");
  }
}

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

function addRetakeAndAddMoreButtons() {
  const imagePreviewAddPage = document.getElementById("imagePreviewAddPage");

  if (imagePreviewAddPage) {
    const existingButtons =
      imagePreviewAddPage.querySelectorAll(".dynamic-button");
    existingButtons.forEach((button) => button.remove());

    const buttonContainer = document.createElement("div");
    buttonContainer.className =
      "flex justify-between w-full mt-4 dynamic-button";

    const retakeButton = document.createElement("button");
    retakeButton.innerText = "Retake";
    retakeButton.className =
      "button bg-accent-purple text-font-off-white px-2 py-1 rounded-lg text-center cursor-pointer w-[6rem] text-sm";
    retakeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      imagePreviewAddPage.innerHTML = "";

      if ((window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(
          JSON.stringify({ action: "openCamera" })
        );
      }

      imagePreviewAddPage.classList.add("hidden");
    });

    const addMoreButton = document.createElement("button");
    addMoreButton.innerText = "Add More";
    addMoreButton.className =
      "button bg-accent-blue text-font-off-white px-2 py-1 rounded-lg text-center cursor-pointer w-[6rem] text-sm";
    addMoreButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      console.log("Add More button clicked");
    });

    buttonContainer.appendChild(retakeButton);
    buttonContainer.appendChild(addMoreButton);

    imagePreviewAddPage.appendChild(buttonContainer);
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
          reader.onload = function(event) {
            const img = document.createElement("img");
            img.src = event.target?.result as string;
            img.className = "w-full max-w-xs mx-auto";
            imagePreviewAddPage.innerHTML = "";
            imagePreviewAddPage.appendChild(img);
            addRetakeAndAddMoreButtons();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });
}

export interface MessageEvent {
  data: {
    type: string;
    imageData: string;
  };
}

interface Window {
  ReactNativeWebView?: ReactNativeWebView;
}

interface ReactNativeWebView {
  postMessage(message: string): void;
}

export function onMessage(event: MessageEvent): void {
  console.log("message called");
  // alert("onMessage function called");

  if (event.data) {
    if (typeof event.data === "string") {
      alert("Raw event data: " + event.data);
    }
    const data =
      typeof event.data === "string" ? JSON.parse(event.data) : event.data;

    if (data.type === "image") {
      console.log("Image data received: ", data.imageData);
      alert("Image data received: " + data.imageData);
      handleReceivedImage(data.imageData);
    } else {
      console.log('Message type is not "image".');
      // alert('Message type is not "image".');
    }
  } else {
    alert("No event data received.");
  }
}

export function openCamera() {
  if ((window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({ action: "openCamera" })
    );
  }
}
