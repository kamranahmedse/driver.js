import { DriveStep } from "./driver";
import { refreshOverlay, trackActiveElement, transitionStage } from "./overlay";
import { getConfig } from "./config";
import { hidePopover, renderPopover, repositionPopover } from "./popover";
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
  let elemObj: Element | null = null;

  if (typeof element === "string") {
    elemObj = document.querySelector(element);
    if (! elemObj || elemObj.getBoundingClientRect().width === 0) {
      elemObj = null;
      document.querySelectorAll(element).forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (!elemObj && rect.width > 0 && rect.height > 0) {
          elemObj = el;
          return;
        }
      });
    }
  } else if (element instanceof Element) {
    elemObj = element;
  }

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
  const activeHighlight = getState("__activeElement");
  const activeStep = getState("__activeStep")!;

  if (!activeHighlight) {
    return;
  }

  trackActiveElement(activeHighlight);
  refreshOverlay();
  repositionPopover(activeHighlight, activeStep);
}


function transferHighlight(toElement: Element, toStep: DriveStep) {
  const duration = 400;
  const start = Date.now();

  const fromStep = getState("__activeStep");
  const fromElement = getState("__activeElement") || toElement;

  // If it's the first time we're highlighting an element, we show
  // the popover immediately. Otherwise, we wait for the animation
  // to finish before showing the popover.
  const isFirstHighlight = !fromElement || fromElement === toElement;
  const isToDummyElement = toElement.id === "driver-dummy-element";
  const isFromDummyElement = fromElement.id === "driver-dummy-element";

  const isAnimatedTour = getConfig("animate");
  const highlightStartedHook = toStep.onHighlightStarted || getConfig("onHighlightStarted");
  const highlightedHook = toStep?.onHighlighted || getConfig("onHighlighted");
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

  setState("previousStep", fromStep);
  setState("previousElement", fromElement);
  setState("activeStep", toStep);
  setState("activeElement", toElement);

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
      setState("__previousStep", fromStep);
      setState("__previousElement", fromElement);
      setState("__activeStep", toStep);
      setState("__activeElement", toElement);
    }

    window.requestAnimationFrame(animate);
  };

  setState("__transitionCallback", animate);

  window.requestAnimationFrame(animate);

  bringInView(toElement);
  if (!hasDelayedPopover && toStep.popover) {
    renderPopover(toElement, toStep);
  }

  fromElement.classList.remove("driver-active-element", "driver-no-interaction");
  fromElement.removeAttribute("aria-haspopup");
  fromElement.removeAttribute("aria-expanded");
  fromElement.removeAttribute("aria-controls");

  const disableActiveInteraction = toStep.disableActiveInteraction ?? getConfig("disableActiveInteraction");
  if (disableActiveInteraction) {
    toElement.classList.add("driver-no-interaction");
  }

  toElement.classList.add("driver-active-element");
  toElement.setAttribute("aria-haspopup", "dialog");
  toElement.setAttribute("aria-expanded", "true");
  toElement.setAttribute("aria-controls", "driver-popover-content");
}

export function destroyHighlight() {
  document.getElementById("driver-dummy-element")?.remove();
  document.querySelectorAll(".driver-active-element").forEach(element => {
    element.classList.remove("driver-active-element", "driver-no-interaction");
    element.removeAttribute("aria-haspopup");
    element.removeAttribute("aria-expanded");
    element.removeAttribute("aria-controls");
  });
}
