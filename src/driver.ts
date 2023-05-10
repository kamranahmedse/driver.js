import { destroyStage } from "./stage";
import { destroyEvents, initEvents } from "./events";
import { Config, configure, getConfig } from "./config";
import { destroyHighlight, highlight } from "./highlight";

import "./style.css";
import { destroyHooks, register } from "./hooks";

export type DriveStep = {
  element?: string | Element;
};

let isInitialized = false;

export function driver(options: Config = {}) {
  configure(options);

  function init() {
    // Avoid multiple initialization
    if (isInitialized) {
      return;
    }

    isInitialized = true;
    document.body.classList.add(
      "driver-active",
      getConfig("animate") ? "driver-fade" : "driver-simple"
    );

    initEvents();

    // Register hooks
    register("overlayClick", () => {
      if (!getConfig("allowClose")) {
        return;
      }

      destroy();
    });
  }

  function destroy() {
    isInitialized = false;
    document.body.classList.remove(
      "driver-active",
      getConfig("animate") ? "driver-fade" : "driver-simple"
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
