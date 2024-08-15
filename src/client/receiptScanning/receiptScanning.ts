import heic2any from "heic2any";
import htmx from "htmx.org";

function addEventListenerWithFlag(
  element: HTMLElement,
  event: string,
  handler: EventListenerOrEventListenerObject,
  flag: string
) {
  if (element && !element.dataset[flag]) {
    element.addEventListener(event, handler);
    element.dataset[flag] = "true";
  }
}

function handleReceivedImage(base64Image: string): void {
  const imagePreviewAddPage = document.getElementById("imagePreviewAddPage");
  const scanReceiptHelper = document.getElementById("scanReceiptHelper");

  if (imagePreviewAddPage) {
    const imgContainer = document.createElement("div");
    imgContainer.className = "relative w-full max-w-xs mx-auto mb-1";

    const img = document.createElement("img");
    img.src = `data:image/jpeg;base64,${base64Image}`;
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

    if (scanReceiptHelper) {
      scanReceiptHelper.style.display = "none";
    }
  } else {
    console.log("handleReceivedImage: imagePreviewAddPage element not found");
  }
}

export function onMessage(event: MessageEvent): void {
  if (event.imageData) {
    handleReceivedImage(event.imageData);
  } else {
    console.log("No event data received.");
  }
}

function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function convertImage(imageSrc: string) {
  return new Promise<Blob>((resolve, reject) => {
    try {
      if (imageSrc.startsWith("data:image/heic")) {
        heic2any({ blob: dataURItoBlob(imageSrc), toType: "image/jpeg" })
          .then((convertedBlob) => {
            if (Array.isArray(convertedBlob)) {
              resolve(convertedBlob[0]);
            } else {
              resolve(convertedBlob);
            }
          })
          .catch((err) => {
            console.error("Error converting HEIC to JPEG:", err);
            reject(err);
          });
      } else {
        resolve(dataURItoBlob(imageSrc));
      }
    } catch (err) {
      console.error("Unexpected error in convertImage function:", err);
      reject(err);
    }
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
        const blob = await convertImage(img.src);
        imageDataArray.push({
          src: blob,
        });
      }
    }

    serializedImagesInput.value = JSON.stringify(
      imageDataArray.map((image) => URL.createObjectURL(image.src))
    );
  }
}

async function sendImageStream(blob: Blob) {
  const formData = new FormData();
  formData.append("image", blob, "image.jpg");

  const result = await fetch("/receipt/next", {
    method: "POST",
    body: formData,
  });

  return result;
}

async function sendImagesSeparately() {
  try {
    const serializedImagesInput = document.getElementById(
      "serializedImages"
    ) as HTMLInputElement;
    const imageUrls = JSON.parse(serializedImagesInput!.value);
    const loadingSpinner = document.getElementById("loadingSpinner");
    const errorContainer = document.getElementById("errorContainer");

    loadingSpinner?.classList.remove("hidden");

    for (const imageUrl of imageUrls) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const responseResult = await sendImageStream(blob);

      if (!responseResult.ok) {
        const errorText = await responseResult.text();
        if (errorContainer) {
          errorContainer.innerText = errorText;
          errorContainer.classList.remove("hidden");
          setTimeout(() => {
            errorContainer.classList.add("hidden");
          }, 8000);
        }
        break;
      }

      const data = await responseResult.json();

      htmx.ajax("POST", "/receipt/confirmReceipt", {
        swap: "innerHTML",
        target: "#app",
        values: data,
      });
    }

    loadingSpinner?.classList.add("hidden");
  } catch (e) {
    console.error("Error sending images separately:", e);
    const errorContainer = document.getElementById("errorContainer");
    if (errorContainer) {
      errorContainer.innerText =
        "An error occurred while processing the images.";
      errorContainer.classList.remove("hidden");
      setTimeout(() => {
        errorContainer.classList.add("hidden");
      }, 8000);
    }
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner?.classList.add("hidden");
  }
}

function updateChooseFromLibraryButton() {
  const imagePreviewAddPage = document.getElementById("imagePreviewAddPage");
  let chooseFromLibraryButton = document.getElementById(
    "chooseFromLibraryButton"
  );
  let takePicButton = document.getElementById("takePictureButton");

  if (imagePreviewAddPage) {
    if (imagePreviewAddPage.querySelectorAll("img").length > 0) {
      let nextButton = document.getElementById("nextButton");
      if (!nextButton) {
        nextButton = document.createElement("button");
        nextButton.id = "nextButton";
        nextButton.className =
          "button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg mb-[2rem] text-center cursor-pointer";
        nextButton.innerText = "Next";
        nextButton.setAttribute("type", "button");

        nextButton.addEventListener("click", (event) => {
          event.preventDefault();
          sendImagesSeparately()
            .then(() => {
              console.log("Images sent successfully");
            })
            .catch((err) => {
              console.error("Error sending images:", err);
            });
        });

        if (chooseFromLibraryButton && chooseFromLibraryButton.parentNode) {
          chooseFromLibraryButton.parentNode.insertBefore(
            nextButton,
            chooseFromLibraryButton
          );
        }
      }
      // Remove the take picture button if there are images
      if (takePicButton && takePicButton.parentNode) {
        takePicButton.parentNode.removeChild(takePicButton);
      }
    } else {
      if (!chooseFromLibraryButton) {
        chooseFromLibraryButton = document.createElement("button");
        chooseFromLibraryButton.id = "chooseFromLibraryButton";
        chooseFromLibraryButton.className =
          "button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg mb-[2rem] text-center cursor-pointer";
        chooseFromLibraryButton.innerText = "Choose from Library";
        chooseFromLibraryButton.addEventListener("click", openImageLibrary);

        const parentContainer = document.querySelector(".buttonContainer");

        if (parentContainer) {
          parentContainer.insertBefore(
            chooseFromLibraryButton,
            parentContainer.firstChild
          );
        }
      } else {
        chooseFromLibraryButton.innerText = "Choose from Library";
        chooseFromLibraryButton.addEventListener("click", openImageLibrary);
      }

      if (!takePicButton) {
        takePicButton = document.createElement("button");
        takePicButton.id = "takePictureButton";
        takePicButton.className =
          "button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg mb-[2rem] text-center cursor-pointer";
        takePicButton.innerText = "Take Picture";

        takePicButton.addEventListener("click", () => {
          if ((window as any).ReactNativeWebView) {
            openCamera();
          }
        });

        const parentContainer = document.querySelector(".buttonContainer");

        if (parentContainer) {
          parentContainer.insertBefore(
            takePicButton,
            chooseFromLibraryButton.nextSibling
          );
        }
      }
    }
  }
  updateSerializedImages();
}

function updateUIAfterDeletion() {
  const imagePreviewAddPage = document.getElementById("imagePreviewAddPage");

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
        chooseFromLibraryButton.addEventListener("click", openImageLibrary);

        const parentContainer = document.querySelector(".buttonContainer");
        if (parentContainer) {
          parentContainer.insertBefore(
            chooseFromLibraryButton,
            parentContainer.firstChild
          );
        }
      }
      let takePicButton = document.getElementById("takePictureButton");
      if (!takePicButton) {
        takePicButton = document.createElement("button");
        takePicButton.id = "takePictureButton";
        takePicButton.className =
          "button bg-accent-blue text-font-off-white py-2 px-4 rounded-lg mb-[2rem] text-center cursor-pointer";
      }
      takePicButton.innerText = "Take Picture";
      takePicButton.addEventListener("click", () => {
        if ((window as any).ReactNativeWebView) {
          openCamera();
        }
      });

      const parentContainer = document.querySelector(".buttonContainer");
      const addManuallyButton = document.querySelector("#addManuallyButton");
      if (parentContainer) {
        if (addManuallyButton) {
          parentContainer.insertBefore(takePicButton, addManuallyButton);
        } else {
          parentContainer.appendChild(takePicButton);
        }
      }
    }
  }
  updateSerializedImages();
}

function addRetakeAndAddMoreButtons() {
  const imagePreviewAddPage = document.getElementById("imagePreviewAddPage");

  if (imagePreviewAddPage) {
    const existingButtonsContainer = document.querySelector(
      ".dynamic-button-container"
    );
    if (existingButtonsContainer) {
      existingButtonsContainer.remove();
    }

    const buttonContainer = document.createElement("div");
    buttonContainer.className =
      "flex w-full mt-4 dynamic-button-container justify-between";

    const retakeButton = document.createElement("button");
    retakeButton.innerText = "Retake";
    retakeButton.className =
      "button bg-accent-purple text-font-off-white px-2 py-1 rounded-lg text-center cursor-pointer w-[6rem] text-sm mx-1";
    retakeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

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

    const takeAnotherPictureButton = document.createElement("button");
    takeAnotherPictureButton.innerText = "Add More";
    takeAnotherPictureButton.className =
      "button bg-accent-blue text-font-off-white px-2 py-1 rounded-lg text-center cursor-pointer w-[6rem] text-sm mx-1";
    takeAnotherPictureButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if ((window as any).ReactNativeWebView) {
        openCamera();
      }
    });

    buttonContainer.appendChild(retakeButton);
    buttonContainer.appendChild(takeAnotherPictureButton);

    imagePreviewAddPage.appendChild(buttonContainer);
  }
}

export function addTakePictureButton() {
  const takePicButton = document.getElementById("takePictureButton");

  if (takePicButton) {
    addEventListenerWithFlag(
      takePicButton,
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        if ((window as any).ReactNativeWebView) {
          openCamera();
        }
      },
      "takePictureClick"
    );
  }
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

export function openCamera() {
  if ((window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({ action: "openCamera" })
    );
  }
}

export function openImageLibrary() {
  if ((window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({ action: "openImageLibrary" })
    );
  }
}

export function initializeChooseFromLibraryButton() {
  const chooseFromLibraryButton = document.getElementById(
    "chooseFromLibraryButton"
  );

  if (chooseFromLibraryButton) {
    addEventListenerWithFlag(
      chooseFromLibraryButton,
      "click",
      openImageLibrary,
      "chooseFromLibraryClick"
    );
  }
}
