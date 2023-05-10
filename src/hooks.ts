type allowedHooks = "overlayClick";

let registeredHooks: Partial<{ [key in allowedHooks]: () => void }> = {};

export function register(hook: allowedHooks, callback: () => void) {
  registeredHooks[hook] = callback;
}

export function trigger(hook: allowedHooks) {
  registeredHooks[hook]?.();
}

export function destroyHooks() {
  registeredHooks = {};
}
