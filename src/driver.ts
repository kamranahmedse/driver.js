import { destroyPopover, Popover } from "./popover";
import { destroyStage } from "./stage";
import { destroyEvents, initEvents, requireRefresh } from "./events";
import { Config, configure, getConfig } from "./config";
import { destroyHighlight, highlight } from "./highlight";
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
    listen("escapePress", handleClose);
  }

  function destroy() {
    const activeElement = getState("activeElement");
    const activeStep = getState("activeStep");

    const onDeselected = getConfig("onDeselected");
    const onDestroyed = getConfig("onDestroyed");

    document.body.classList.remove("driver-active", "driver-fade", "driver-simple");

    destroyEvents();
    destroyPopover();
    destroyHighlight();
    destroyStage();
    destroyEmitter();

    resetState();

    if (activeElement && activeStep) {
      const isActiveDummyElement = activeElement.id === "driver-dummy-element";
      if (onDeselected) {
        onDeselected(isActiveDummyElement ? undefined : activeElement, activeStep);
      }

      if (onDestroyed) {
        onDestroyed(isActiveDummyElement ? undefined : activeElement, activeStep);
      }
    }
  }

  return {
    isActive: () => getState("isInitialized") || false,
    refresh: () => {
      requireRefresh();
    },
    drive: (steps: DriveStep[]) => console.log(steps),
    highlight: (step: DriveStep) => {
      init();
      highlight({
        ...step,
        popover: step.popover
          ? {
              showButtons: [],
              ...step.popover!,
            }
          : undefined,
      });
    },
    destroy,
  };
}
