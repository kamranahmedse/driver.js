import { destroyPopover, Popover } from "./popover";
import { destroyStage } from "./stage";
import { destroyEvents, initEvents } from "./events";
import { Config, configure, getConfig } from "./config";
import { destroyHighlight, highlight } from "./highlight";
import { destroyEmitter, listen } from "./emitter";

import "./style.css";
import { getState, setState } from "./state";

export type DriveStep = {
  element?: string | Element;
  popover?: Popover;
};

export function driver(options: Config = {}) {
  configure(options);

  function handleClose() {
    if (!getConfig("allowClose")) {
      return;
    }

    destroy();
  }

  function init() {
    if (getState("isInitialized")) {
      return;
    }

    setState("isInitialized", true);
    document.body.classList.add("driver-active", getConfig("animate") ? "driver-fade" : "driver-simple");

    initEvents();

    // Register hooks
    listen("overlayClick", handleClose);
    listen("escape", handleClose);
  }

  function destroy() {
    setState("isInitialized", false);

    document.body.classList.remove("driver-active", "driver-fade", "driver-simple");

    destroyEvents();
    destroyPopover();
    destroyHighlight();
    destroyStage();
    destroyEmitter();
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
