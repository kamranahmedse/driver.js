import { destroyPopover, Popover } from "./popover";
import { destroyStage } from "./stage";
import { destroyEvents, initEvents } from "./events";
import { Config, configure, getConfig } from "./config";
import { destroyHighlight, highlight, refreshActiveHighlight } from "./highlight";
import { destroyEmitter, listen } from "./emitter";

import "./style.css";
import { getState, resetState, setState } from "./state";

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

    const activeStep = getState("activeStep");
    const activeElement = getState("activeElement");
    const onDeselected = getConfig("onDeselected");
    if (activeStep && activeElement && onDeselected) {
      onDeselected(activeElement, activeStep);
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

    listen("overlayClick", handleClose);
    listen("escape", handleClose);
  }

  function destroy() {
    document.body.classList.remove("driver-active", "driver-fade", "driver-simple");

    destroyEvents();
    destroyPopover();
    destroyHighlight();
    destroyStage();
    destroyEmitter();

    resetState();
  }

  return {
    isActive: () => getState("isInitialized") || false,
    refresh: () => {
      refreshActiveHighlight();
    },
    drive: (steps: DriveStep[]) => console.log(steps),
    highlight: (step: DriveStep) => {
      init();
      highlight({
        ...step,
        popover: step.popover
          ? {
              showButtons: false,
              ...step.popover!,
            }
          : undefined,
      });
    },
    destroy,
  };
}
