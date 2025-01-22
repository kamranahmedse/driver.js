import { refreshActiveHighlight } from "./highlight";
import { emit } from "./emitter";
import { getState, setState } from "./state";
import { getConfig } from "./config";
import { getFocusableElements } from "./utils";

export function requireRefresh() {
  const resizeTimeout = getState("__resizeTimeout");
  if (resizeTimeout) {
    window.cancelAnimationFrame(resizeTimeout);
  }

  setState("__resizeTimeout", window.requestAnimationFrame(refreshActiveHighlight));
}

function trapFocus(e: KeyboardEvent) {
  const isActivated = getState("isInitialized");
  if (!isActivated) {
    return;
  }

  const isTabKey = e.key === "Tab" || e.keyCode === 9;
  if (!isTabKey) {
    return;
  }

  const activeElement = getState("__activeElement");
  const popoverEl = getState("popover")?.wrapper;

  const focusableEls = getFocusableElements([
    ...(popoverEl ? [popoverEl] : []),
    ...(activeElement ? [activeElement] : []),
  ]);

  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];

  e.preventDefault();

  if (e.shiftKey) {
    const previousFocusableEl =
      focusableEls[focusableEls.indexOf(document.activeElement as HTMLElement) - 1] || lastFocusableEl;
    previousFocusableEl?.focus();
  } else {
    const nextFocusableEl =
      focusableEls[focusableEls.indexOf(document.activeElement as HTMLElement) + 1] || firstFocusableEl;
    nextFocusableEl?.focus();
  }
}

function onKeyup(e: KeyboardEvent) {
  const allowKeyboardControl = getConfig("allowKeyboardControl") ?? true;

  if (!allowKeyboardControl) {
    return;
  }

  if (e.key === "Escape") {
    emit("escapePress");
  } else if (e.key === "ArrowRight") {
    emit("arrowRightPress");
  } else if (e.key === "ArrowLeft") {
    emit("arrowLeftPress");
  }
}

type EventCallback = (pointer: MouseEvent | PointerEvent) => void
type EventHandlers = {
  [key: string]: {
    clickedListener?: EventCallback,
    disabledlistener?: EventCallback
  }
}
const driverEventHandlers: EventHandlers = {}

const listenerWrapper = (
  element?: Element,
  listener?: EventCallback,
  shouldPreventDefault?: (target: HTMLElement) => boolean
) => {
  return function (e: MouseEvent | PointerEvent) {
    // event and extra_data will be available here
    const target = e.target as HTMLElement;
    if (!element?.contains(target)) {
      return;
    }

    if (!shouldPreventDefault || shouldPreventDefault(target)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }

    listener?.(e);
  };
};

/**
 * Attaches click handler to the elements created by driver.js. It makes
 * sure to give the listener the first chance to handle the event, and
 * prevents all other pointer-events to make sure no external-library
 * ever knows the click happened.
 *
 * @param {Element} element Element to listen for click events
 * @param {(pointer: MouseEvent | PointerEvent) => void} listener Click handler
 * @param {(target: HTMLElement) => boolean} shouldPreventDefault Whether to prevent default action i.e. link clicks etc
 */
export function onDriverClick(
  element: Element,
  listener: EventCallback,
  shouldPreventDefault?: (target: HTMLElement) => boolean
) {
  // event handlers
  const clickedListener = listenerWrapper(element, listener, shouldPreventDefault);
  const disabledlistener = listenerWrapper();

  // save event handlers so we can remove events later
  // use the element ID as the object key
  // save event handlers as values
  driverEventHandlers[element.id] = { clickedListener }

  if (element.classList.contains('driver-popover')) {
    // save event handlers so we can remove events later
    // use the element ID as the object key
    // save event handlers as values
    driverEventHandlers[element.id].disabledlistener = disabledlistener

    // Events to disable
    document.addEventListener("pointerdown", disabledlistener, true);
    document.addEventListener("mousedown", disabledlistener, true);
    document.addEventListener("pointerup", disabledlistener, true);
    document.addEventListener("mouseup", disabledlistener, true);
  }
  // Actual click handler
  document.addEventListener('click', clickedListener, true)
}

export function destroyDriverEvents (element: Element) {
  // extract the saved event handlers to delete these events
  const { clickedListener, disabledlistener } = driverEventHandlers[element.id];

  clickedListener && document.removeEventListener('click', clickedListener, true);

  if (disabledlistener) {
    document.removeEventListener("pointerdown", disabledlistener, true);
    document.removeEventListener("mousedown", disabledlistener, true);
    document.removeEventListener("pointerup", disabledlistener, true);
    document.removeEventListener("mouseup", disabledlistener, true);
  }

  // clear driverEventHandlers
  delete driverEventHandlers[element.id]
}

export function initEvents() {
  window.addEventListener("keyup", onKeyup, false);
  window.addEventListener("keydown", trapFocus, false);
  window.addEventListener("resize", requireRefresh);
  window.addEventListener("scroll", requireRefresh);
}

export function destroyEvents() {
  window.removeEventListener("keyup", onKeyup);
  window.removeEventListener("keydown", trapFocus);
  window.removeEventListener("resize", requireRefresh);
  window.removeEventListener("scroll", requireRefresh);
}
