import { bringInView } from "./utils";

export type Popover = {
  title?: string;
  description: string;
  preferredPosition?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

let popoverEl: HTMLElement | undefined;

export function renderPopover(element: Element) {
  if (!popoverEl) {
    const popover = createPopover();
    document.body.appendChild(popover.popoverWrapper);

    popoverEl = popover.popoverWrapper;
  }

  popoverEl.style.display = "block";
  popoverEl.style.left = "0";
  popoverEl.style.top = "0";
  popoverEl.style.bottom = "";
  popoverEl.style.right = "";

  refreshPopover();
  bringInView(popoverEl);
}

export function refreshPopover() {
  console.log("rendering popover");
}

function createPopover() {
  const popoverWrapper = document.createElement("div");
  popoverWrapper.classList.add("driver-popover");

  const popoverTip = document.createElement("div");
  popoverTip.classList.add("driver-popover-tip");

  const popoverTitle = document.createElement("div");
  popoverTitle.classList.add("driver-popover-title");
  popoverTitle.innerText = "Popover Title";

  const popoverDescription = document.createElement("div");
  popoverDescription.classList.add("driver-popover-description");
  popoverDescription.innerText = "Popover Description";

  const popoverFooter = document.createElement("div");
  popoverFooter.classList.add("driver-popover-footer");

  const popoverCloseBtn = document.createElement("button");
  popoverCloseBtn.classList.add("driver-popover-close-btn");
  popoverCloseBtn.innerText = "Close";

  const popoverFooterBtnGroup = document.createElement("span");
  popoverFooterBtnGroup.classList.add("driver-popover-footer-btns");

  const popoverPrevBtn = document.createElement("button");
  popoverPrevBtn.classList.add("driver-popover-prev-btn");
  popoverPrevBtn.innerHTML = "&larr; Previous";

  const popoverNextBtn = document.createElement("button");
  popoverNextBtn.classList.add("driver-popover-next-btn");
  popoverNextBtn.innerHTML = "Next &rarr;";

  popoverFooterBtnGroup.appendChild(popoverPrevBtn);
  popoverFooterBtnGroup.appendChild(popoverNextBtn);

  popoverFooter.appendChild(popoverCloseBtn);
  popoverFooter.appendChild(popoverFooterBtnGroup);

  popoverWrapper.appendChild(popoverTip);
  popoverWrapper.appendChild(popoverTitle);
  popoverWrapper.appendChild(popoverDescription);
  popoverWrapper.appendChild(popoverFooter);

  return {
    popoverWrapper,
    popoverTip,
    popoverTitle,
    popoverDescription,
    popoverFooter,
    popoverPrevBtn,
    popoverNextBtn,
    popoverCloseBtn,
    popoverFooterBtnGroup,
  };
}

export function destroyPopover() {
  if (!popoverEl) {
    return;
  }

  popoverEl.parentElement?.removeChild(popoverEl);
  popoverEl = undefined;
}
