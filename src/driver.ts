import { destroyStage } from "./stage";
import { destroyEvents, initEvents } from "./events";
import { Config, configure, getConfig } from "./config";
import { destroyHighlight, highlight } from "./highlight";

import "./style.css";
import { destroyHooks, register } from "./hooks";

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

    register("overlayClick", destroy);
  }

  function destroy() {
    document.body.classList.remove(
      "driver-active",
      shouldAnimate ? "driver-fade" : "driver-simple"
    );

    destroyEvents();
    destroyHighlight();
    destroyStage();
    destroyHooks();
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
