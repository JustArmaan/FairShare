import htmx from "htmx.org";

function handleReceivedImage(base64Image: string): void {
  const imagePreviewAddPage = document.getElementById("imagePreviewAddPage");

  if (imagePreviewAddPage) {
    const imgContainer = document.createElement("div");
    imgContainer.className = "relative w-full max-w-xs mx-auto mb-1";

    const img = document.createElement("img");
    img.src = `data:image/png;base64,${base64Image}`;
    img.className = "w-full";

    const deleteButton = document.createElement("button");
    deleteButton.className = "absolute top-0 right-0 p-2 rounded-full";
    deleteButton.innerHTML = `<img src="/icons/delete.svg" alt="Delete" class="w-6 h-6 cursor-pointer">`;
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      imagePreviewAddPage.removeChild(imgContainer);
      updateUIAfterDeletion();
    });

    imgContainer.appendChild(img);
    imgContainer.appendChild(deleteButton);
    imagePreviewAddPage.appendChild(imgContainer);
    imagePreviewAddPage.classList.remove("hidden");

    addRetakeAndAddMoreButtons();
    updateChooseFromLibraryButton();
  } else {
    console.log("imagePreviewAddPage element not found");
  }
}

function compressImage(imageSrc: string, maxSize: number) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = (err) => reject(err);
  });
}

async function updateSerializedImages() {
  const imagePreviewAddPage = document.getElementById("imagePreviewAddPage");
  const serializedImagesInput = document.getElementById(
    "serializedImages"
  ) as HTMLInputElement;

  if (imagePreviewAddPage && serializedImagesInput) {
    const images = Array.from(
      imagePreviewAddPage.querySelectorAll("img")
    ) as HTMLImageElement[];
    const imageDataArray = [];

    for (const img of images) {
      if (!img.src.includes("/icons/delete.svg")) {
        const compressedSrc = await compressImage(img.src, 800);
        imageDataArray.push({
          src: compressedSrc,
        });
      }
    }

    serializedImagesInput.value = JSON.stringify(imageDataArray);
  }
}

function updateChooseFromLibraryButton() {
  const imagePreviewAddPage = document.getElementById("imagePreviewAddPage");
  let chooseFromLibraryButton = document.getElementById(
    "chooseFromLibraryButton"
  );

  if (imagePreviewAddPage) {
    if (imagePreviewAddPage.querySelectorAll("img").length > 0) {
      const nextButton = document.createElement("button");
      nextButton.id = "nextButton";
      nextButton.className =
        "button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg mb-[2rem] text-center cursor-pointer";
      nextButton.innerText = "Next";
      nextButton.setAttribute("hx-post", "/receipt/next"); // Change to the appropriate endpoint
      nextButton.setAttribute("hx-trigger", "click");
      nextButton.setAttribute("hx-swap", "innerHTML");
      nextButton.setAttribute("hx-target", "#app");
      nextButton.setAttribute("hx-include", "#serializedImages");

      if (chooseFromLibraryButton && chooseFromLibraryButton.parentNode) {
        chooseFromLibraryButton.parentNode.replaceChild(
          nextButton,
          chooseFromLibraryButton
        );
        htmx.process(nextButton);
      }
    } else {
      if (!chooseFromLibraryButton) {
        chooseFromLibraryButton = document.createElement("button");
        chooseFromLibraryButton.id = "chooseFromLibraryButton";
        chooseFromLibraryButton.className =
          "button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg mb-[2rem] text-center cursor-pointer";
        chooseFromLibraryButton.innerText = "Choose from Library";
        chooseFromLibraryButton.addEventListener(
          "click",
          triggerFileInputClick
        );

        const parentContainer = document.querySelector(".buttonContainer");

        if (parentContainer) {
          parentContainer.insertBefore(
            chooseFromLibraryButton,
            parentContainer.firstChild
          );
        }
      } else {
        chooseFromLibraryButton.innerText = "Choose from Library";
        chooseFromLibraryButton.addEventListener(
          "click",
          triggerFileInputClick
        );
      }
    }
  }
  updateSerializedImages();
}


function updateUIAfterDeletion() {
  const imagePreviewAddPage = document.getElementById("imagePreviewAddPage");
  console.log(
    "Updating UI after deletion",
    imagePreviewAddPage?.children,
    "hello",
    imagePreviewAddPage
  );

  if (imagePreviewAddPage) {
    const imgElements = imagePreviewAddPage.querySelectorAll("img");

    if (imgElements.length === 0) {
      imagePreviewAddPage.classList.add("hidden");

      const dynamicButtonsContainer = document.querySelector(
        ".dynamic-button-container"
      );
      if (dynamicButtonsContainer) {
        dynamicButtonsContainer.remove();
      }

      const nextButton = document.getElementById("nextButton");
      if (nextButton && nextButton.parentNode) {
        nextButton.parentNode.removeChild(nextButton);
      }

      let chooseFromLibraryButton = document.getElementById(
        "chooseFromLibraryButton"
      );
      if (!chooseFromLibraryButton) {
        chooseFromLibraryButton = document.createElement("label");
        chooseFromLibraryButton.id = "chooseFromLibraryButton";
        chooseFromLibraryButton.className =
          "button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg mb-[2rem] text-center cursor-pointer";
        chooseFromLibraryButton.innerText = "Choose from Library";
        chooseFromLibraryButton.setAttribute("for", "fileInputAddPage");
        chooseFromLibraryButton.addEventListener(
          "click",
          triggerFileInputClick
        );

        const parentContainer = document.querySelector(".buttonContainer");
        if (parentContainer) {
          parentContainer.insertBefore(
            chooseFromLibraryButton,
            parentContainer.firstChild
          );
        }
      }
    }
  }
  updateSerializedImages();
}

function triggerFileInputClick(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  const fileInputAddPage = document.getElementById(
    "fileInputAddPage"
  ) as HTMLInputElement;
  if (fileInputAddPage) {
    fileInputAddPage.click();
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
  const fileInputAddPage = document.getElementById("fileInputAddPage");

  if (imagePreviewAddPage && fileInputAddPage) {
    const existingButtonsContainer = document.querySelector(
      ".dynamic-button-container"
    );
    if (existingButtonsContainer) {
      existingButtonsContainer.remove();
    }

    const buttonContainer = document.createElement("div");
    buttonContainer.className =
      "flex justify-between w-full mt-4 dynamic-button-container";

    const retakeButton = document.createElement("button");
    retakeButton.innerText = "Retake";
    retakeButton.className =
      "button bg-accent-purple text-font-off-white px-2 py-1 rounded-lg text-center cursor-pointer w-[6rem] text-sm";
    retakeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Remove the last image without clearing the entire content
      const imgContainers =
        imagePreviewAddPage.querySelectorAll("div.relative");
      if (imgContainers.length > 0) {
        const lastImgContainer = imgContainers[imgContainers.length - 1];
        lastImgContainer.remove();
        updateUIAfterDeletion();
      }

      if ((window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(
          JSON.stringify({ action: "openCamera" })
        );
      }
      updateChooseFromLibraryButton();
    });

    const addMoreButton = document.createElement("button");
    addMoreButton.innerText = "Add More";
    addMoreButton.className =
      "button bg-accent-blue text-font-off-white px-2 py-1 rounded-lg text-center cursor-pointer w-[6rem] text-sm";
    addMoreButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      console.log("Add More button clicked");
      // Trigger click event on file input
      fileInputAddPage.click();
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
          reader.onload = function (event) {
            const uniqueId = `${file.lastModified}-${file.size}`;

            const existingImg = document.querySelector(
              `img[data-id="${uniqueId}"]`
            );
            if (existingImg) {
              console.log("Image already exists, not adding again.");
              return;
            }

            const imgContainer = document.createElement("div");
            imgContainer.className = "relative w-full max-w-xs mx-auto mb-1";

            const img = document.createElement("img");
            img.src = event.target?.result as string;
            img.className = "w-full";
            img.setAttribute("data-id", uniqueId);

            const deleteButton = document.createElement("button");
            deleteButton.className = "absolute top-0 right-0 p-2 rounded-full";
            deleteButton.innerHTML = `<img src="/icons/delete.svg" alt="Delete" class="w-6 h-6 cursor-pointer">`;
            deleteButton.addEventListener("click", (event) => {
              event.preventDefault();
              event.stopPropagation();
              imagePreviewAddPage.removeChild(imgContainer);
              updateUIAfterDeletion();
            });

            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteButton);
            imagePreviewAddPage.appendChild(imgContainer);
            imagePreviewAddPage.classList.remove("hidden");
            addRetakeAndAddMoreButtons();
            updateChooseFromLibraryButton();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });
}

export interface MessageEvent {
  type: string;
  imageData: string;
}

interface Window {
  ReactNativeWebView?: ReactNativeWebView;
}

interface ReactNativeWebView {
  postMessage(message: string): void;
}

export function onMessage(event: MessageEvent): void {
  if (event.imageData) {
    if (typeof event.imageData === "string") {
      console.log("Raw event data: " + event.imageData);
    }

    let data;
    try {
      data = typeof event === "string" ? JSON.parse(event) : event;
    } catch (error) {
      console.error("Failed to parse event data:", error);
      return;
    }

    if (data.type === "image") {
      console.log("Image data received: " + data.imageData);
      handleReceivedImage(data.imageData);
    } else {
      console.log('Message type is not "image".');
    }
  } else {
    console.log("No event data received.");
  }
}

export function openCamera() {
  if ((window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({ action: "openCamera" })
    );
  }
}

export function initializeChooseFromLibraryButton() {
  const chooseFromLibraryButton = document.getElementById(
    "chooseFromLibraryButton"
  );

  if (chooseFromLibraryButton) {
    chooseFromLibraryButton.addEventListener("click", triggerFileInputClick);
  }
}
