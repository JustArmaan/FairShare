import heic2any from "heic2any";

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

  if (imagePreviewAddPage) {
    console.log("handleReceivedImage: Adding image to DOM");

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
    console.log("handleReceivedImage: imagePreviewAddPage element not found");
  }
}

// This still only works about 90% on iphone
function compressImage(imageSrc: string, maxSize: number) {
  return new Promise((resolve, reject) => {
    try {
      if (imageSrc.startsWith("data:image/heic")) {
        heic2any({ blob: dataURItoBlob(imageSrc), toType: "image/jpeg" })
          .then((convertedBlob) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              compressImageFromDataURI(event.target?.result as string, maxSize)
                .then(resolve)
                .catch((err) => {
                  console.error("Error compressing image from data URI:", err);
                  reject(err);
                });
            };
            reader.onerror = (err) => {
              console.error("Error reading converted blob as data URL:", err);
              reject(err);
            };
            reader.readAsDataURL(convertedBlob as Blob);
          })
          .catch((err) => {
            console.error("Error converting HEIC to JPEG:", err);
            reject(err);
          });
      } else {
        compressImageFromDataURI(imageSrc, maxSize)
          .then(resolve)
          .catch((err) => {
            console.error("Error compressing image from data URI:", err);
            reject(err);
          });
      }
    } catch (err) {
      console.error("Unexpected error in compressImage function:", err);
      reject(err);
    }
  });
}

function compressImageFromDataURI(imageSrc: string, maxSize: number) {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const ratio = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        } catch (err) {
          console.error("Error drawing image on canvas:", err);
          reject(err);
        }
      };
      img.onerror = (err) => {
        console.error("Error loading image for compression:", err);
        reject(err);
      };
    } catch (err) {
      console.error(
        "Unexpected error in compressImageFromDataURI function:",
        err
      );
      reject(err);
    }
  });
}

function dataURItoBlob(dataURI: string) {
  try {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  } catch (err) {
    console.error("Error converting data URI to Blob:", err);
    throw err;
  }
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

async function sendImagesSeparately() {
  try {
    const serializedImagesInput = document.getElementById(
      "serializedImages"
    ) as HTMLInputElement;
    const images = JSON.parse(serializedImagesInput.value);

    for (const image of images) {
      const response = await fetch("/receipt/next", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: image.src }),
      });
      if (response.status === 403) {
        const errorText = await response.text();
        const errorContainer = document.getElementById("errorContainer");

        if (errorContainer) {
          errorContainer.textContent = errorText;
          errorContainer.classList.remove("hidden");
          setTimeout(() => {
            errorContainer.classList.add("hidden");
          }, 8000);
        }
        break;
      } else if (response.status === 413) {
        const errorContainer = document.getElementById("errorContainer");

        if (errorContainer) {
          errorContainer.textContent =
            "Image size was too large for the server to process. Please try again";
        }
      }
    }
  } catch (e) {
    console.error("Error sending images separately:", e);
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
          sendImagesSeparately();
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
          console.log("Take Picture button clicked");
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
        console.log("Take Picture button clicked");
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

      console.log("Take Another Picture button clicked");

      if ((window as any).ReactNativeWebView) {
        openCamera();
      }
    });

    // const addFromLibraryButton = document.createElement("button");
    // addFromLibraryButton.innerText = "Add from Library";
    // addFromLibraryButton.className =
    //   "button bg-accent-blue text-font-off-white px-2 py-1 rounded-lg text-center cursor-pointer w-[8rem] text-sm mx-1";
    // addFromLibraryButton.addEventListener("click", (event) => {
    //   event.preventDefault();
    //   event.stopPropagation();

    //   openImageLibrary();
    // });

    buttonContainer.appendChild(retakeButton);
    buttonContainer.appendChild(takeAnotherPictureButton);
    // buttonContainer.appendChild(addFromLibraryButton);

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
        console.log("Take Picture button clicked");
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

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");
  initializeChooseFromLibraryButton();
  addTakePictureButton();
});
