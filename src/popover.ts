import { bringInView } from "./utils";
import { STAGE_PADDING } from "./stage";

export type Side = "top" | "right" | "bottom" | "left";
export type Alignment = "start" | "center" | "end";

const POPOVER_OFFSET = 10;

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

  // Reset the popover position
  const popoverWrapper = popover.wrapper;
  popoverWrapper.style.display = "block";
  popoverWrapper.style.left = "";
  popoverWrapper.style.top = "";
  popoverWrapper.style.bottom = "";
  popoverWrapper.style.right = "";

  // Reset the classes responsible for the arrow position
  const popoverArrow = popover.arrow;
  popoverArrow.className = "driver-popover-arrow";

  repositionPopover(element);
  bringInView(popoverWrapper);
}

function getPopoverDimensions() {
  if (!popover?.wrapper) {
    return;
  }

  const boundingClientRect = popover.wrapper.getBoundingClientRect();

  return {
    width: boundingClientRect.width + STAGE_PADDING + POPOVER_OFFSET,
    height: boundingClientRect.height + STAGE_PADDING + POPOVER_OFFSET,

    realWidth: boundingClientRect.width,
    realHeight: boundingClientRect.height,
  };
}

function calculatePopoverPositionForLeftRight(
  alignment: Alignment,
  config: {
    elementDimensions: DOMRect;
    popoverDimensions?: ReturnType<typeof getPopoverDimensions>;
    popoverPadding: number;
    popoverArrowDimensions: { width: number; height: number };
  }
): number {
  const { elementDimensions, popoverDimensions, popoverPadding, popoverArrowDimensions } = config;

  if (alignment === "start") {
    return Math.max(
      Math.min(
        elementDimensions.top - popoverPadding,
        window.innerHeight - popoverDimensions!.realHeight - popoverArrowDimensions.width
      ),
      popoverArrowDimensions.width
    );
  }

  if (alignment === "end") {
    return Math.max(
      Math.min(
        elementDimensions.top - popoverDimensions?.realHeight + elementDimensions.height + popoverPadding,
        window.innerHeight - popoverDimensions?.realHeight - popoverArrowDimensions.width
      ),
      popoverArrowDimensions.width
    );
  }

  if (alignment === "center") {
    return Math.max(
      Math.min(
        elementDimensions.top + elementDimensions.height / 2 - popoverDimensions?.realHeight / 2,
        window.innerHeight - popoverDimensions?.realHeight - popoverArrowDimensions.width
      ),
      popoverArrowDimensions.width
    );
  }

  return 0;
}

// Calculate the left placement for top and bottom sides
function calculateLeftForTopBottom(
  alignment: Alignment,
  config: {
    elementDimensions: DOMRect;
    popoverDimensions?: ReturnType<typeof getPopoverDimensions>;
    popoverPadding: number;
    popoverArrowDimensions: { width: number; height: number };
  }
): number {
  const { elementDimensions, popoverDimensions, popoverPadding, popoverArrowDimensions } = config;

  if (alignment === "start") {
    return Math.max(
      Math.min(
        elementDimensions.left - popoverPadding,
        window.innerWidth - popoverDimensions!.realWidth - popoverArrowDimensions.width
      ),
      popoverArrowDimensions.width
    );
  }

  if (alignment === "end") {
    return Math.max(
      Math.min(
        elementDimensions.left - popoverDimensions?.realWidth + elementDimensions.width + popoverPadding,
        window.innerWidth - popoverDimensions?.realWidth - popoverArrowDimensions.width
      ),
      popoverArrowDimensions.width
    );
  }

  if (alignment === "center") {
    return Math.max(
      Math.min(
        elementDimensions.left + elementDimensions.width / 2 - popoverDimensions?.realWidth / 2,
        window.innerWidth - popoverDimensions?.realWidth - popoverArrowDimensions.width
      ),
      popoverArrowDimensions.width
    );
  }

  return 0;
}

export function repositionPopover(element: Element) {
  if (!popover) {
    return;
  }

  // Configure the popover positioning
  const requiredAlignment: Alignment = "start";
  const popoverPadding = STAGE_PADDING;

  const popoverDimensions = getPopoverDimensions();
  const popoverArrowDimensions = popover.arrow.getBoundingClientRect();
  const elementDimensions = element.getBoundingClientRect();

  const topValue = elementDimensions.top - popoverDimensions!.height;
  const isTopOptimal = topValue >= 0;

  const bottomValue = window.innerHeight - (elementDimensions.bottom + popoverDimensions!.height);
  const isBottomOptimal = bottomValue >= 0;

  const leftValue = elementDimensions.left - popoverDimensions!.width;
  const isLeftOptimal = leftValue >= 0;

  const rightValue = window.innerWidth - (elementDimensions.right + popoverDimensions!.width);
  const isRightOptimal = rightValue >= 0;

  const noneOptimal = !isTopOptimal && !isBottomOptimal && !isLeftOptimal && !isRightOptimal;
  let popoverRenderedSide: Side;

  if (noneOptimal) {
    const leftValue = window.innerWidth / 2 - popoverDimensions?.realWidth! / 2;
    const bottomValue = 10;

    popover.wrapper.style.left = `${leftValue}px`;
    popover.wrapper.style.right = `auto`;
    popover.wrapper.style.bottom = `${bottomValue}px`;
    popover.wrapper.style.top = `auto`;
  } else if (isLeftOptimal) {
    const leftToSet = Math.min(
      leftValue,
      window.innerWidth - popoverDimensions?.realWidth - popoverArrowDimensions.width
    );

    const topToSet = calculatePopoverPositionForLeftRight(requiredAlignment, {
      elementDimensions,
      popoverDimensions,
      popoverPadding,
      popoverArrowDimensions,
    });

    popover.wrapper.style.left = `${leftToSet}px`;
    popover.wrapper.style.top = `${topToSet}px`;
    popover.wrapper.style.bottom = `auto`;
    popover.wrapper.style.right = "auto";

    popoverRenderedSide = "left";
  } else if (isRightOptimal) {
    const rightToSet = Math.min(
      rightValue,
      window.innerWidth - popoverDimensions?.realWidth - popoverArrowDimensions.width
    );
    const topToSet = calculatePopoverPositionForLeftRight(requiredAlignment, {
      elementDimensions,
      popoverDimensions,
      popoverPadding,
      popoverArrowDimensions,
    });

    popover.wrapper.style.right = `${rightToSet}px`;
    popover.wrapper.style.top = `${topToSet}px`;
    popover.wrapper.style.bottom = `auto`;
    popover.wrapper.style.left = "auto";

    popoverRenderedSide = "right";
  } else if (isTopOptimal) {
    const topToSet = Math.min(
      topValue,
      window.innerHeight - popoverDimensions!.realHeight - popoverArrowDimensions.width
    );
    let leftToSet = calculateLeftForTopBottom(requiredAlignment, {
      elementDimensions,
      popoverDimensions,
      popoverPadding,
      popoverArrowDimensions,
    });

    popover.wrapper.style.top = `${topToSet}px`;
    popover.wrapper.style.left = `${leftToSet}px`;
    popover.wrapper.style.bottom = `auto`;
    popover.wrapper.style.right = "auto";

    popoverRenderedSide = "top";
  } else if (isBottomOptimal) {
    const bottomToSet = Math.min(
      bottomValue,
      window.innerHeight - popoverDimensions?.realHeight - popoverArrowDimensions.width
    );

    let leftToSet = calculateLeftForTopBottom(requiredAlignment, {
      elementDimensions,
      popoverDimensions,
      popoverPadding,
      popoverArrowDimensions,
    });

    popover.wrapper.style.left = `${leftToSet}px`;
    popover.wrapper.style.bottom = `${bottomToSet}px`;
    popover.wrapper.style.top = `auto`;
    popover.wrapper.style.right = "auto";

    popoverRenderedSide = "bottom";
  }

  // Popover stays on the screen if the element scrolls out of the visible area.
  // Render the arrow again to make sure it's in the correct position
  // e.g. if element scrolled out of the screen to the top, the arrow should be rendered
  // pointing to the top. If the element scrolled out of the screen to the bottom,
  // the arrow should be rendered pointing to the bottom.
  renderPopoverArrow(requiredAlignment, popoverRenderedSide, element);
}

function renderPopoverArrow(alignment: Alignment, side: Side, element: Element) {
  if (!popover) {
    return;
  }

  const elementDimensions = element.getBoundingClientRect();
  const popoverDimensions = getPopoverDimensions();
  const popoverArrow = popover.arrow;

  const popoverWidth = popoverDimensions?.width;
  const windowWidth = window.innerWidth;
  const elementWidth = elementDimensions.width;
  const elementLeft = elementDimensions.left;

  const popoverHeight = popoverDimensions?.height;
  const windowHeight = window.innerHeight;
  const elementTop = elementDimensions.top;
  const elementHeight = elementDimensions.height;

  // Remove all arrow classes
  popoverArrow.className = "driver-popover-arrow";

  let arrowSide = side;
  let arrowAlignment = alignment;

  if (side === "top") {
    if (elementLeft + elementWidth <= 0) {
      arrowSide = "right";
      arrowAlignment = "end";
    } else if (elementLeft + elementWidth - popoverWidth <= 0) {
      arrowSide = "top";
      arrowAlignment = "start";
    }
    if (elementLeft >= windowWidth) {
      arrowSide = "left";
      arrowAlignment = "end";
    } else if (elementLeft + popoverWidth >= windowWidth) {
      arrowSide = "top";
      arrowAlignment = "end";
    }
  } else if (side === "bottom") {
    if (elementLeft + elementWidth <= 0) {
      arrowSide = "right";
      arrowAlignment = "start";
    } else if (elementLeft + elementWidth - popoverWidth <= 0) {
      arrowSide = "bottom";
      arrowAlignment = "start";
    }
    if (elementLeft >= windowWidth) {
      arrowSide = "left";
      arrowAlignment = "start";
    } else if (elementLeft + popoverWidth >= windowWidth) {
      arrowSide = "bottom";
      arrowAlignment = "end";
    }
  } else if (side === "left") {
    if (elementTop + elementHeight <= 0) {
      arrowSide = "bottom";
      arrowAlignment = "end";
    } else if (elementTop + elementHeight - popoverHeight <= 0) {
      arrowSide = "left";
      arrowAlignment = "start";
    }

    if (elementTop >= windowHeight) {
      arrowSide = "top";
      arrowAlignment = "end";
    } else if (elementTop + popoverHeight >= windowHeight) {
      arrowSide = "left";
      arrowAlignment = "end";
    }
  } else if (side === "right") {
    if (elementTop + elementHeight <= 0) {
      arrowSide = "bottom";
      arrowAlignment = "start";
    } else if (elementTop + elementHeight - popoverHeight <= 0) {
      arrowSide = "right";
      arrowAlignment = "start";
    }

    if (elementTop >= windowHeight) {
      arrowSide = "top";
      arrowAlignment = "start";
    } else if (elementTop + popoverHeight >= windowHeight) {
      arrowSide = "right";
      arrowAlignment = "end";
    }
  } else {
  }

  if (!arrowSide) {
    popoverArrow.classList.add("driver-popover-arrow-none");
  } else {
    popoverArrow.classList.add(`driver-popover-arrow-side-${arrowSide}`);
    popoverArrow.classList.add(`driver-popover-arrow-align-${arrowAlignment}`);
  }
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
  description.innerText = "Popover description is here";

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
