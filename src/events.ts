import { refreshActiveHighlight } from "./highlight";

let resizeTimeout: number;

function onResize() {
  if (resizeTimeout) {
    window.cancelAnimationFrame(resizeTimeout);
  }

  resizeTimeout = window.requestAnimationFrame(refreshActiveHighlight);
}

export function initEvents() {
  window.addEventListener("resize", onResize);
}

export function destroyEvents() {
  window.removeEventListener("resize", onResize);
}
