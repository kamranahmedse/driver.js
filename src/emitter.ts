type allowedEvents = "overlayClick" | "escapePress" | "nextClick" | "prevClick" | "closeClick";

let registeredListeners: Partial<{ [key in allowedEvents]: () => void }> = {};

export function listen(hook: allowedEvents, callback: () => void) {
  registeredListeners[hook] = callback;
}

export function emit(hook: allowedEvents) {
  registeredListeners[hook]?.();
}

export function destroyEmitter() {
  registeredListeners = {};
}
