export type Popover = {
  title?: string;
  description: string;
  preferredPosition?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

export function renderPopover(element: Element) {
  console.log("rendering", element);
}

export function refreshPopover() {}
