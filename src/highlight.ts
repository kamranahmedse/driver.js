import { DriveStep } from "./driver";
import { refreshStage, trackActiveElement, transitionStage } from "./stage";

let previousHighlight: Element | undefined;
let activeHighlight: Element | undefined;
let isTransitioning = false;

export function highlight(step: DriveStep) {
  const { element } = step;
  const elemObj =
    typeof element === "string" ? document.querySelector(element) : element;

  if (!elemObj) {
    return;
  }

  previousHighlight = activeHighlight;
  activeHighlight = elemObj;

  transferHighlight(previousHighlight || elemObj, elemObj);
}

export function refreshActiveHighlight() {
  if (!activeHighlight) {
    return;
  }

  trackActiveElement(activeHighlight);
  refreshStage();
}

function transferHighlight(from: Element, to: Element) {
  const duration = 400;
  const start = Date.now();
  isTransitioning = true;

  const animate = () => {
    if (!isTransitioning) {
      return;
    }

    const elapsed = Date.now() - start;

    if (elapsed < duration) {
      transitionStage(elapsed, duration, from, to);
    } else {
      trackActiveElement(to);

      isTransitioning = false;
    }

    refreshStage();
    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);

  from.classList.remove("driver-active-element");
  to.classList.add("driver-active-element");

  isTransitioning = true;
}

export function destroyHighlight() {
  activeHighlight = undefined;
  isTransitioning = false;
  previousHighlight = undefined;
  activeHighlight = undefined;

  document.querySelectorAll(".driver-active-element").forEach(element => {
    element.classList.remove("driver-active-element");
  });
}
