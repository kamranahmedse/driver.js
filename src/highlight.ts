import { DriveStep } from "./driver";
import { refreshStage, trackActiveElement, transitionStage } from "./stage";
import { getConfig } from "./config";
import { repositionPopover, renderPopover, hidePopover } from "./popover";
import { bringInView } from "./utils";
import { getState, setState } from "./state";

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

  // If the element is not found, we mount a 1px div
  // at the center of the screen to highlight and show
  // the popover on top of that. This is to show a
  // modal-like highlight.
  if (!elemObj) {
    elemObj = mountDummyElement();
  }

  // Keep track of the previous step so that we can
  // animate the transition between the two steps.
  setState("previousStep", getState("activeStep"));
  setState("activeStep", step);

  const transferHighlightFrom = getState("activeElement") || elemObj;
  const transferHighlightTo = elemObj;

  transferHighlight(transferHighlightFrom, transferHighlightTo, step);

  // Keep track of the previous element so that we can
  // animate the transition between the two elements.
  setState("previousElement", transferHighlightFrom);
  setState("activeElement", transferHighlightTo);
}

export function refreshActiveHighlight() {
  const activeHighlight = getState("activeElement");
  if (!activeHighlight) {
    return;
  }

  trackActiveElement(activeHighlight);
  refreshStage();
  repositionPopover(activeHighlight);
}

function transferHighlight(from: Element, to: Element, toStep: DriveStep) {
  const duration = 400;
  const start = Date.now();

  const previousStep = getState("previousStep");

  // If it's the first time we're highlighting an element, we show
  // the popover immediately. Otherwise, we wait for the animation
  // to finish before showing the popover.
  const isFirstHighlight = !from || from === to;
  const hasNoPreviousPopover = previousStep && !previousStep.popover;
  const isNextOrPrevDummyElement = to.id === "driver-dummy-element" || from.id === "driver-dummy-element";

  const hasDelayedPopover = !isFirstHighlight && (hasNoPreviousPopover || isNextOrPrevDummyElement);
  let isPopoverRendered = false;

  hidePopover();

  const animate = () => {
    const transitionCallback = getState("transitionCallback");

    // This makes sure that the repeated calls to transferHighlight
    // don't interfere with each other. Only the last call will be
    // executed.
    if (transitionCallback !== animate) {
      return;
    }

    const elapsed = Date.now() - start;
    const timeRemaining = duration - elapsed;
    const isHalfwayThrough = timeRemaining <= duration / 2;

    if (toStep.popover && isHalfwayThrough && !isPopoverRendered && hasDelayedPopover) {
      renderPopover(to);
      isPopoverRendered = true;
    }

    if (getConfig("animate") && elapsed < duration) {
      transitionStage(elapsed, duration, from, to);
    } else {
      trackActiveElement(to);

      setState("transitionCallback", undefined);
    }

    window.requestAnimationFrame(animate);
  };

  setState("transitionCallback", animate);
  window.requestAnimationFrame(animate);

  bringInView(to);
  if (!hasDelayedPopover && toStep.popover) {
    renderPopover(to);
  }

  from.classList.remove("driver-active-element");
  to.classList.add("driver-active-element");
}

export function destroyHighlight() {
  document.getElementById("driver-dummy-element")?.remove();
  document.querySelectorAll(".driver-active-element").forEach(element => {
    element.classList.remove("driver-active-element");
  });
}
