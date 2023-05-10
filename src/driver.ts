import { initEvents, destroyEvents } from "./events";
import { destroyHighlight, highlight } from "./highlight";
import { destroyStage } from "./stage";
import { configure, Config, getConfig } from "./config";

import "./style.css";

export type DriveStep = {
  element?: string | Element;
};

export function driver(options: Config = {}) {
  configure(options);

  const shouldAnimate = getConfig("animate");

  function init() {
    document.body.classList.add(
      "driver-active",
      shouldAnimate ? "driver-fade" : "driver-simple"
    );

    initEvents();
  }

  function destroy() {
    document.body.classList.remove(
      "driver-active",
      shouldAnimate ? "driver-fade" : "driver-simple"
    );

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
