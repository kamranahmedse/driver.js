import { DriveStep } from "./driver";

export type Config = {
  animate?: boolean;
  backdropColor?: string;
  smoothScroll?: boolean;
  allowClose?: boolean;
  opacity?: number;
  stagePadding?: number;
  stageRadius?: number;
  popoverOffset?: number;
  showButtons?: boolean;

  onHighlightStarted?: (element: Element, step: DriveStep) => void;
  onHighlighted?: (element: Element, step: DriveStep) => void;

  onDeselected?: (element: Element, step: DriveStep) => void;
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
    showButtons: true,
    backdropColor: "#000",
    ...config,
  };
}

export function getConfig(): Config;
export function getConfig<K extends keyof Config>(key: K): Config[K];
export function getConfig<K extends keyof Config>(key?: K) {
  return key ? currentConfig[key] : currentConfig;
}
