import { initEvents, destroyEvents } from "./events";
import { destroyHighlight, highlight } from "./highlight";
import { destroyStage } from "./stage";
import "./style.css";

export type DriveStep = {
  element?: string | Element;
};

export function driver() {
  function init() {
    document.body.classList.add("driver-active", "driver-fade");

    initEvents();
  }

  function destroy() {
    document.body.classList.remove("driver-active", "driver-fade");

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
