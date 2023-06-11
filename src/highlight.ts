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

  if (!elemObj) {
    elemObj = mountDummyElement();
  }

  const previousHighlight = getState("activeHighlight");

  const transferHighlightFrom = previousHighlight || elemObj;
  const transferHighlightTo = elemObj;

  transferHighlight(transferHighlightFrom, transferHighlightTo);

  setState("previousHighlight", transferHighlightFrom);
  setState("activeHighlight", transferHighlightTo);
}

export function refreshActiveHighlight() {
  const activeHighlight = getState("activeHighlight");
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
  const hasDelayedPopover = to && (!from || from !== to);

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

    if (getConfig("animate") && elapsed < duration) {
      transitionStage(elapsed, duration, from, to);
    } else {
      trackActiveElement(to);

      if (hasDelayedPopover) {
        renderPopover(to);
      }

      setState("transitionCallback", undefined);
    }

    window.requestAnimationFrame(animate);
  };

  setState("transitionCallback", animate);
  window.requestAnimationFrame(animate);

  bringInView(to);
  if (!hasDelayedPopover) {
    renderPopover(to);
  }

  from.classList.remove("driver-active-element");
  to.classList.add("driver-active-element");
}

export function destroyHighlight() {
  setState("activeHighlight", undefined);
  setState("previousHighlight", undefined);

  setState("transitionCallback", undefined);

  document.getElementById("driver-dummy-element")?.remove();

  document.querySelectorAll(".driver-active-element").forEach(element => {
    element.classList.remove("driver-active-element");
  });
}
