import { initEvents, destroyEvents } from "./events";
import { destroyHighlight, highlight } from "./highlight";
import { destroyStage } from "./stage";

export type DriveStep = {
  element?: string | Element;
  popover: {
    title: string;
    description: string;
    position: "top" | "bottom" | "left" | "right";
  };
};

export function driver() {
  function init() {
    document.body.classList.add("driver-active");

    initEvents();
  }

  function destroy() {
    document.body.classList.remove("driver-active");

    destroyEvents();
    destroyHighlight();
    destroyStage();
  }

  return {
    drive: (steps: DriveStep[]) => console.log(steps),
    highlight: (step: DriveStep) => {
      init();
      highlight(step);
    },
    destroy,
  };
}
