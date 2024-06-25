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

  const progressContainer = document.getElementById("progressContainer");
  const padding = progressContainer
    ? parseInt(window.getComputedStyle(progressContainer).paddingLeft, 10) * 2
    : 0;

  const viewportWidth = window.innerWidth;
  const progressPixelWidth =
    ((viewportWidth - padding) * progressPercentage) / 100;

  const progressBarElement = document.getElementById("progressBar");
  if (progressBarElement) {
    progressBarElement.style.width = `${progressPixelWidth}px`;
  }

  window.addEventListener("resize", () => {
    const updatedViewportWidth = window.innerWidth;
    const updatedProgressPixelWidth =
      ((updatedViewportWidth - padding) * progressPercentage) / 100;
    if (progressBarElement) {
      progressBarElement.style.width = `${updatedProgressPixelWidth}px`;
    }
  });
}
