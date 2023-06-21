import { AllowedButtons, destroyPopover, Popover } from "./popover";
import { destroyStage } from "./stage";
import { destroyEvents, initEvents, requireRefresh } from "./events";
import { Config, configure, getConfig } from "./config";
import { destroyHighlight, highlight } from "./highlight";
import { destroyEmitter, listen } from "./emitter";

import "./style.css";
import { getState, resetState, setState } from "./state";

export type DriveStep = {
  element?: string | Element;
  onDeselected?: (element: Element | undefined, step: DriveStep) => void;
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

  function moveNext() {
    const activeIndex = getState("activeIndex");
    const steps = getConfig("steps") || [];
    if (typeof activeIndex === "undefined") {
      return;
    }

    const nextStepIndex = activeIndex + 1;
    if (steps[nextStepIndex]) {
      drive(nextStepIndex);
    } else {
      destroy();
    }
  }

  function movePrevious() {
    const activeIndex = getState("activeIndex");
    const steps = getConfig("steps") || [];
    if (typeof activeIndex === "undefined") {
      return;
    }

    const previousStepIndex = activeIndex - 1;
    if (steps[previousStepIndex]) {
      drive(previousStepIndex);
    } else {
      destroy();
    }
  }

  function handleArrowLeft() {
    const steps = getConfig("steps") || [];
    const currentStepIndex = getState("activeIndex");
    if (typeof currentStepIndex === "undefined") {
      return;
    }

    const previousStepIndex = currentStepIndex - 1;
    if (steps[previousStepIndex]) {
      drive(previousStepIndex);
    }
  }

  function handleArrowRight() {
    const activeIndex = getState("activeIndex");
    const activeStep = getState("activeStep");
    const activeElement = getState("activeElement");
    if (typeof activeIndex === "undefined" || typeof activeStep === "undefined") {
      return;
    }

    const onNextClick = activeStep.popover?.onNextClick || getConfig("onNextClick");
    if (onNextClick) {
      return onNextClick(activeElement, activeStep);
    }

    moveNext();
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
    listen("arrowLeftPress", handleArrowLeft);
    listen("arrowRightPress", handleArrowRight);
  }

  function drive(stepIndex: number = 0) {
    const steps = getConfig("steps");
    if (!steps) {
      console.error("No steps to drive through");
      destroy();
      return;
    }

    if (!steps[stepIndex]) {
      console.warn(`Step not found at index: ${stepIndex}`);
      destroy();
    }

    setState("activeIndex", stepIndex);

    const currentStep = steps[stepIndex];
    const hasNextStep = steps[stepIndex + 1];
    const hasPreviousStep = steps[stepIndex - 1];

    const doneBtnText = currentStep.popover?.doneBtnText || getConfig("doneBtnText") || "Done";
    const allowsClosing = getConfig("allowClose");
    const showProgress =
      typeof currentStep.popover?.showProgress !== "undefined"
        ? currentStep.popover?.showProgress
        : getConfig("showProgress");
    const progressText = currentStep.popover?.progressText || getConfig("progressText") || "{{current}} of {{total}}";
    const progressTextReplaced = progressText
      .replace("{{current}}", `${stepIndex + 1}`)
      .replace("{{total}}", `${steps.length}`);

    console.log(showProgress);
    highlight({
      ...currentStep,
      popover: {
        showButtons: ["next", "previous", ...(allowsClosing ? ["close" as AllowedButtons] : [])],
        nextBtnText: !hasNextStep ? doneBtnText : undefined,
        disableButtons: [...(!hasPreviousStep ? ["previous" as AllowedButtons] : [])],
        showProgress: showProgress,
        progressText: progressTextReplaced,
        onNextClick: () => {
          if (!hasNextStep) {
            destroy();
          } else {
            drive(stepIndex + 1);
          }
        },
        onPrevClick: () => {
          drive(stepIndex - 1);
        },
        onCloseClick: () => {
          destroy();
        },
        ...(currentStep?.popover || {}),
      },
    });
  }

  function destroy(withOnDestroyStartedHook = true) {
    const activeElement = getState("activeElement");
    const activeStep = getState("activeStep");

    const onDestroyStarted = getConfig("onDestroyStarted");
    // `onDestroyStarted` is used to confirm the exit of tour. If we trigger
    // the hook for when user calls `destroy`, driver will get into infinite loop
    // not causing tour to be destroyed.
    if (withOnDestroyStartedHook && onDestroyStarted) {
      onDestroyStarted(activeElement, activeStep!);
      return;
    }

    const onDeselected = activeStep?.onDeselected || getConfig("onDeselected");
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
    refresh: requireRefresh,
    drive: (stepIndex: number = 0) => {
      init();
      drive(stepIndex);
    },
    moveNext,
    movePrevious,
    hasNextStep: () => {
      const steps = getConfig("steps") || [];
      const activeIndex = getState("activeIndex");

      return activeIndex !== undefined && steps[activeIndex + 1];
    },
    hasPreviousStep: () => {
      const steps = getConfig("steps") || [];
      const activeIndex = getState("activeIndex");

      return activeIndex !== undefined && steps[activeIndex - 1];
    },
    highlight: (step: DriveStep) => {
      init();
      highlight({
        ...step,
        popover: step.popover
          ? {
              showButtons: [],
              showProgress: false,
              progressText: "",
              ...step.popover!,
            }
          : undefined,
      });
    },
    destroy: () => {
      destroy(false);
    },
  };
}
