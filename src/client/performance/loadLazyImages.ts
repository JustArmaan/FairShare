export const loadLazyImages = () => {
  window.addEventListener("htmx:afterSwap", () => {
    // all elements wioth background images that should be lazy loaded
    const lazyImages = document.querySelectorAll(".lazybg");
    console.log(lazyImages, "here");

    // show background image

    lazyImages.forEach((node) => node.classList.remove("lazybg"));
  });
};
