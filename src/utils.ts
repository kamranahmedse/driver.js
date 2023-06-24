import { getConfig } from "./config";

export function easeInOutQuad(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed + initialValue;
  }
  return (-amountOfChange / 2) * (--elapsed * (elapsed - 2) - 1) + initialValue;
}

export function bringInView(element: Element) {
  if (!element || isElementInView(element)) {
    return;
  }

  const shouldSmoothScroll = getConfig("smoothScroll");

  element.scrollIntoView({
    // Removing the smooth scrolling for elements which exist inside the scrollable parent
    // This was causing the highlight to not properly render
    behavior: !shouldSmoothScroll || hasScrollableParent(element) ? "auto" : "smooth",
    inline: "center",
    block: "center",
  });
}

function hasScrollableParent(e: Element) {
  if (!e || !e.parentElement) {
    return;
  }

  const parent = e.parentElement as HTMLElement & { scrollTopMax?: number };

  return parent.scrollHeight > parent.clientHeight;
}

function isElementInView(element: Element) {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
