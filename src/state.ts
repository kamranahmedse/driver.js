import { StageDefinition } from "./stage";
import { PopoverDOM } from "./popover";
import { DriveStep } from "./driver";

export type State = {
  // Whether driver is initialized or not
  isInitialized?: boolean;
  // Used to bounce the resize event
  resizeTimeout?: number;

  activeIndex?: number;
  activeElement?: Element;
  activeStep?: DriveStep;

  previousElement?: Element;
  previousStep?: DriveStep;

  transitionCallback?: () => void;

  activeStagePosition?: StageDefinition;
  stageSvg?: SVGSVGElement;

  popover?: PopoverDOM;
};

let currentState: State = {};

export function setState<K extends keyof State>(key: K, value: State[K]) {
  currentState[key] = value;
}

export function getState(): State;
export function getState<K extends keyof State>(key: K): State[K];
export function getState<K extends keyof State>(key?: K) {
  return key ? currentState[key] : currentState;
}

export function resetState() {
  currentState = {};
}
