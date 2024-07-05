export function progressBar() {
  const totalElement = document.getElementById("goal-total");
  const contributionElement = document.getElementById("goal-contribution");

  const total = totalElement
    ? parseInt(totalElement.getAttribute("data-total") ?? "0", 10)
    : 0;
  const contribution = contributionElement
    ? parseInt(contributionElement.getAttribute("data-contribution") ?? "0", 10)
    : 0;

  const progressPercentage = (contribution / total) * 100;

  const percentageLabel = document.getElementById("percentageLabel");
  if (percentageLabel) {
    percentageLabel.innerText = `${Math.floor(progressPercentage)}%`;
  }

  const updateProgressBarWidth = () => {
    const progressContainer = document.getElementById("progressContainer");
    const progressBarWrapper = progressContainer?.querySelector(
      ".progress-bar-wrapper"
    );
    const progressBarElement = document.getElementById("progressBar");
    const outerContainer = document.querySelector(".p-6.animate-fade-in.pb-24");

    if (
      progressContainer &&
      progressBarWrapper &&
      progressBarElement &&
      outerContainer
    ) {
      const containerPadding =
        parseInt(window.getComputedStyle(progressContainer).paddingLeft, 10) *
        2;
      const wrapperPadding =
        parseInt(window.getComputedStyle(progressBarWrapper).paddingLeft, 10) *
        2;
      const outerPadding =
        parseInt(window.getComputedStyle(outerContainer).paddingLeft, 10) * 2;

      const totalPadding = containerPadding + wrapperPadding + outerPadding;

      const viewportWidth = window.innerWidth;
      const progressPixelWidth =
        ((viewportWidth - totalPadding) * progressPercentage) / 100;

      progressBarElement.style.width = `${progressPixelWidth}px`;
    }
  };

  updateProgressBarWidth();

  window.addEventListener("resize", updateProgressBarWidth);

  applyBoxSizing();
}

const applyBoxSizing = () => {
  const progressContainer = document.getElementById("progressContainer");
  const progressBarElement = document.getElementById("progressBar");
  const progressBarWrapper = progressContainer?.querySelector(
    ".progress-bar-wrapper"
  ) as HTMLElement;
  const outerContainer = document.querySelector(
    ".animate-fade-in.pb-24"
  ) as HTMLElement;

  if (progressContainer) {
    progressContainer.style.boxSizing = "border-box";
  }
  if (progressBarElement) {
    progressBarElement.style.boxSizing = "border-box";
  }
  if (progressBarWrapper) {
    progressBarWrapper.style.boxSizing = "border-box";
  }
  if (outerContainer) {
    outerContainer.style.boxSizing = "border-box";
  }
};
