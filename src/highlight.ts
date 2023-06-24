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

  transferHighlight(elemObj, step);
}

export function refreshActiveHighlight() {
  const activeHighlight = getState("activeElement");
  const activeStep = getState("activeStep")!;

  if (!activeHighlight) {
    return;
  }

  trackActiveElement(activeHighlight);
  refreshStage();
  repositionPopover(activeHighlight, activeStep);
}

function transferHighlight(toElement: Element, toStep: DriveStep) {
  const duration = 400;
  const start = Date.now();

  const fromStep = getState("activeStep");
  const fromElement = getState("activeElement") || toElement;

  // If it's the first time we're highlighting an element, we show
  // the popover immediately. Otherwise, we wait for the animation
  // to finish before showing the popover.
  const isFirstHighlight = !fromElement || fromElement === toElement;
  const isToDummyElement = toElement.id === "driver-dummy-element";
  const isFromDummyElement = fromElement.id === "driver-dummy-element";

  const isAnimatedTour = getConfig("animate");
  const highlightStartedHook = getConfig("onHighlightStarted");
  const highlightedHook = getConfig("onHighlighted");
  const deselectedHook = fromStep?.onDeselected || getConfig("onDeselected");

  const config = getConfig();
  const state = getState();

  if (!isFirstHighlight && deselectedHook) {
    deselectedHook(isFromDummyElement ? undefined : fromElement, fromStep!, {
      config,
      state,
    });
  }

  if (highlightStartedHook) {
    highlightStartedHook(isToDummyElement ? undefined : toElement, toStep, {
      config,
      state,
    });
  }

  const hasDelayedPopover = !isFirstHighlight && isAnimatedTour;
  let isPopoverRendered = false;

  hidePopover();

  const animate = () => {
    const transitionCallback = getState("__transitionCallback");

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
      renderPopover(toElement, toStep);
      isPopoverRendered = true;
    }

    if (getConfig("animate") && elapsed < duration) {
      transitionStage(elapsed, duration, fromElement, toElement);
    } else {
      trackActiveElement(toElement);

      if (highlightedHook) {
        highlightedHook(isToDummyElement ? undefined : toElement, toStep, {
          config: getConfig(),
          state: getState(),
        });
      }

      setState("__transitionCallback", undefined);
      setState("previousStep", fromStep);
      setState("previousElement", fromElement);
      setState("activeStep", toStep);
      setState("activeElement", toElement);
    }

    window.requestAnimationFrame(animate);
  };

  setState("__transitionCallback", animate);
  window.requestAnimationFrame(animate);

  bringInView(toElement);
  if (!hasDelayedPopover && toStep.popover) {
    renderPopover(toElement, toStep);
  }

  fromElement.classList.remove("driver-active-element");
  toElement.classList.add("driver-active-element");
}

export function destroyHighlight() {
  document.getElementById("driver-dummy-element")?.remove();
  document.querySelectorAll(".driver-active-element").forEach(element => {
    element.classList.remove("driver-active-element");
  });
}
