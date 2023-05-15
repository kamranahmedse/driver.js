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
  arrow: HTMLElement;
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

  const popoverArrow = popover.arrow;

  // const position = calculatePopoverPosition(element);
  popoverArrow?.classList.add("driver-popover-arrow-side-bottom", "driver-popover-arrow-align-center");
}

function calculatePopoverPosition(element: Element) {
  if (!popover) {
    return;
  }

  const popoverPadding = 10;

  const popoverDimensions = popover.wrapper.getBoundingClientRect();
  const popoverArrowDimensions = popover.arrow.getBoundingClientRect();
  const elementDimensions = element.getBoundingClientRect();

  const popoverPaddedWidth = popoverDimensions.width + popoverPadding;
  const popoverPaddedHeight = popoverDimensions.height + popoverPadding;

  const topValue = elementDimensions.top - popoverPaddedHeight;
  const isTopOptimal = topValue >= 0;

  const bottomValue = window.innerHeight - (elementDimensions.bottom + popoverPaddedHeight);
  const isBottomOptimal = bottomValue >= 0;

  const leftValue = elementDimensions.left - popoverPaddedWidth;
  const isLeftOptimal = leftValue >= 0;

  const rightValue = window.innerWidth - (elementDimensions.right + popoverPaddedWidth);
  const isRightOptimal = rightValue >= 0;

  const noneOptimal = !isTopOptimal && !isBottomOptimal && !isLeftOptimal && !isRightOptimal;
  if (noneOptimal) {
    return {
      left: window.innerWidth / 2 - popoverDimensions.width / 2,
      bottom: 10,
    };
  }

  // @todo placement based on the side and alignment
}

function getLeftValueAfterAlignment(element: Element) {
  if (!popover) {
    return;
  }

  const popoverRect = popover.wrapper.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const requiredAlignment = 'left';
  const popoverWidth = popoverRect.width;
  const pos = element.getBoundingClientRect().left;
  const end = window.innerWidth;
  const elementLength = elementRect.width;
  const extraPadding = popover.arrow.getBoundingClientRect().width;
}

function createPopover(): PopoverDOM {
  const wrapper = document.createElement("div");
  wrapper.classList.add("driver-popover");

  const arrow = document.createElement("div");
  arrow.classList.add("driver-popover-arrow");

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

  wrapper.appendChild(arrow);
  wrapper.appendChild(title);
  wrapper.appendChild(description);
  wrapper.appendChild(footer);

  return {
    wrapper,
    arrow,
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
