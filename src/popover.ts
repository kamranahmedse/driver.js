import { bringInView } from "./utils";

export type Side = "top" | "right" | "bottom" | "left";
export type Alignment = "start" | "center" | "end";

export type Popover = {
  title?: string;
  description: string;
  side?: Side;
  align?: Alignment;
};

type PopoverDOM = {
  wrapper: HTMLElement;
  tip: HTMLElement;
  title: HTMLElement;
  description: HTMLElement;
  footer: HTMLElement;
  previousButton: HTMLElement;
  nextButton: HTMLElement;
  closeButton: HTMLElement;
  footerButtons: HTMLElement;
};

let popover: PopoverDOM | undefined;

export function renderPopover(element: Element) {
  if (!popover) {
    popover = createPopover();
    document.body.appendChild(popover.wrapper);
  }

  const popoverWrapper = popover.wrapper;

  popoverWrapper.style.display = "block";
  popoverWrapper.style.left = "0";
  popoverWrapper.style.top = "0";
  popoverWrapper.style.bottom = "";
  popoverWrapper.style.right = "";

  refreshPopover(element);
  bringInView(popoverWrapper);
}

export function refreshPopover(element: Element) {
  if (!popover) {
    return;
  }

  const popoverTip = popover.tip;

  // const position = calculatePopoverPosition(element);
  popoverTip?.classList.add("driver-popover-tip-left");
}

function calculatePopoverPosition(element: Element) {}

function createPopover(): PopoverDOM {
  const wrapper = document.createElement("div");
  wrapper.classList.add("driver-popover");

  const tip = document.createElement("div");
  tip.classList.add("driver-popover-tip");

  const title = document.createElement("div");
  title.classList.add("driver-popover-title");
  title.innerText = "Popover Title";

  const description = document.createElement("div");
  description.classList.add("driver-popover-description");
  description.innerText = "Popover Description";

  const footer = document.createElement("div");
  footer.classList.add("driver-popover-footer");

  const closeButton = document.createElement("button");
  closeButton.classList.add("driver-popover-close-btn");
  closeButton.innerText = "Close";

  const footerButtons = document.createElement("span");
  footerButtons.classList.add("driver-popover-footer-btns");

  const previousButton = document.createElement("button");
  previousButton.classList.add("driver-popover-prev-btn");
  previousButton.innerHTML = "&larr; Previous";

  const nextButton = document.createElement("button");
  nextButton.classList.add("driver-popover-next-btn");
  nextButton.innerHTML = "Next &rarr;";

  footerButtons.appendChild(previousButton);
  footerButtons.appendChild(nextButton);

  footer.appendChild(closeButton);
  footer.appendChild(footerButtons);

  wrapper.appendChild(tip);
  wrapper.appendChild(title);
  wrapper.appendChild(description);
  wrapper.appendChild(footer);

  return {
    wrapper,
    tip,
    title,
    description,
    footer,
    previousButton,
    nextButton,
    closeButton,
    footerButtons,
  };
}

export function destroyPopover() {
  if (!popover) {
    return;
  }

  popover.wrapper.parentElement?.removeChild(popover.wrapper);
  popover = undefined;
}
