import { DriveStep } from "./driver";
import { refreshStage, trackActiveElement, transitionStage } from "./stage";
import { getConfig } from "./config";
import { repositionPopover, renderPopover, hidePopover } from "./popover";
import { bringInView } from "./utils";

let previousHighlight: Element | undefined;
let activeHighlight: Element | undefined;
let currentTransitionCallback: undefined | (() => void);

function mountDummyElement(): Element {
  const existingDummy = document.getElementById("driver-dummy-element");
  if (existingDummy) {
    return existingDummy;
  }

  let element = document.createElement("div");

  element.id = "driver-dummy-element";
  element.style.width = "0";
  element.style.height = "0";
  element.style.pointerEvents = "none";
  element.style.opacity = "0";
  element.style.position = "fixed";
  element.style.top = "50%";
  element.style.left = "50%";

  document.body.appendChild(element);

  return element;
}

export function highlight(step: DriveStep) {
  const { element } = step;
  let elemObj = typeof element === "string" ? document.querySelector(element) : element;

  if (!elemObj) {
    elemObj = mountDummyElement();
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
  repositionPopover(activeHighlight);
}

function transferHighlight(from: Element, to: Element) {
  const duration = 400;
  const start = Date.now();

  // If it's the first time we're highlighting an element, we show
  // the popover immediately. Otherwise, we wait for the animation
  // to finish before showing the popover.
  const hasDelayedPopover = !from || from !== to;

  hidePopover();

  const animate = () => {
    // This makes sure that the repeated calls to transferHighlight
    // don't interfere with each other. Only the last call will be
    // executed.
    if (currentTransitionCallback !== animate) {
      return;
    }

    const elapsed = Date.now() - start;

    if (getConfig("animate") && elapsed < duration) {
      transitionStage(elapsed, duration, from, to);
    } else {
      trackActiveElement(to);

      if (hasDelayedPopover) {
        renderPopover(to);
      }

      currentTransitionCallback = undefined;
    }

    window.requestAnimationFrame(animate);
  };

  currentTransitionCallback = animate;
  window.requestAnimationFrame(animate);

  bringInView(to);
  if (!hasDelayedPopover) {
    renderPopover(to);
  }

  from.classList.remove("driver-active-element");
  to.classList.add("driver-active-element");
}

export function destroyHighlight() {
  activeHighlight = undefined;
  currentTransitionCallback = undefined;
  previousHighlight = undefined;
  activeHighlight = undefined;
  document.getElementById("driver-dummy-element")?.remove();

  document.querySelectorAll(".driver-active-element").forEach(element => {
    element.classList.remove("driver-active-element");
  });
}
