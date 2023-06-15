import { DriveStep } from "./driver";
import { AllowedButtons } from "./popover";

export type Config = {
  animate?: boolean;
  backdropColor?: string;
  smoothScroll?: boolean;
  allowClose?: boolean;
  opacity?: number;
  stagePadding?: number;
  stageRadius?: number;
  popoverOffset?: number;
  showButtons?: AllowedButtons[];

  onHighlightStarted?: (element: Element | undefined, step: DriveStep) => void;
  onHighlighted?: (element: Element | undefined, step: DriveStep) => void;

  onDeselected?: (element: Element | undefined, step: DriveStep) => void;

  onClose?: (element: Element | undefined, step: DriveStep) => void;
};

let currentConfig: Config = {};

export function configure(config: Config = {}) {
  currentConfig = {
    animate: true,
    allowClose: true,
    opacity: 0.7,
    smoothScroll: false,
    stagePadding: 10,
    stageRadius: 5,
    popoverOffset: 10,
    showButtons: ["next", "previous", "done"],
    backdropColor: "#000",
    ...config,
  };
}

export function getConfig(): Config;
export function getConfig<K extends keyof Config>(key: K): Config[K];
export function getConfig<K extends keyof Config>(key?: K) {
  return key ? currentConfig[key] : currentConfig;
}
