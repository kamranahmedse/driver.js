import { DriveStep } from "./driver";
import { AllowedButtons, PopoverDOM } from "./popover";

export type Config = {
  steps?: DriveStep[];

  animate?: boolean;
  backdropColor?: string;
  smoothScroll?: boolean;
  allowClose?: boolean;
  opacity?: number;
  stagePadding?: number;
  stageRadius?: number;

  allowKeyboardControl?: boolean;

  // Popover specific configuration
  popoverClass?: string;
  popoverOffset?: number;
  showButtons?: AllowedButtons[];
  disableButtons?: AllowedButtons[];
  showProgress?: boolean;

  // Button texts
  progressText?: string;
  nextBtnText?: string;
  prevBtnText?: string;
  doneBtnText?: string;

  // Called after the popover is rendered
  onPopoverRendered?: (popover: PopoverDOM) => void;

  // State based callbacks, called upon state changes
  onOverlayClick?: (element: Element | undefined, step: DriveStep) => void;
  onHighlightStarted?: (element: Element | undefined, step: DriveStep) => void;
  onHighlighted?: (element: Element | undefined, step: DriveStep) => void;
  onDeselected?: (element: Element | undefined, step: DriveStep) => void;
  onDestroyStarted?: (element: Element | undefined, step: DriveStep) => void;
  onDestroyed?: (element: Element | undefined, step: DriveStep) => void;

  // Event based callbacks, called upon events
  onNextClick?: (element: Element | undefined, step: DriveStep) => void;
  onPrevClick?: (element: Element | undefined, step: DriveStep) => void;
  onCloseClick?: (element: Element | undefined, step: DriveStep) => void;
};

let currentConfig: Config = {};

export function configure(config: Config = {}) {
  currentConfig = {
    animate: true,
    allowClose: true,
    opacity: 0.7,
    smoothScroll: false,
    showProgress: false,
    stagePadding: 10,
    stageRadius: 5,
    popoverOffset: 10,
    showButtons: ["next", "previous", "close"],
    disableButtons: [],
    backdropColor: "#000",
    ...config,
  };
}

export function getConfig(): Config;
export function getConfig<K extends keyof Config>(key: K): Config[K];
export function getConfig<K extends keyof Config>(key?: K) {
  return key ? currentConfig[key] : currentConfig;
}
