import { driver } from "driver.js";
import type { ExampleGroup } from "./types";

// Reproduces upstream issue #549: tour with multiple CONSECUTIVE steps that
// are not attached to any element. Each one renders a centered modal-style
// popover over the shared dummy element. Switching between them flashes a
// small white square at the popover's reset position (top:0 / right:0).
//
// The slow duration makes any flash easy to spot. Use Next/Previous (or the
// arrow keys) to move between steps and watch the popover area.

const anchorlessSteps = [0, 1, 2, 3].map(i => ({
  popover: {
    title: `Step ${i + 1}`,
    description:
      `This popover is NOT attached to any element. Press Next to switch ` +
      `to the next anchor-less step and watch for a white square flash.`,
  },
}));

function runAnchorless(duration: number) {
  driver({
    animate: true,
    duration,
    showProgress: true,
    showButtons: ["next", "previous", "close"],
    steps: anchorlessSteps,
  }).drive();
}

export const anchorlessGroup: ExampleGroup = {
  title: "Anchor-less Transition (test)",
  examples: [
    {
      id: "anchorless-fast",
      title: "Fast (150ms)",
      description:
        "LOOK: quick switch between anchor-less steps — any white flash is brief.",
      run() {
        runAnchorless(150);
      },
    },
    {
      id: "anchorless-default",
      title: "Default (400ms)",
      description:
        "LOOK: the reported bug — a white square flashes while switching between anchor-less steps.",
      run() {
        runAnchorless(400);
      },
    },
    {
      id: "anchorless-slow",
      title: "Slow (1500ms)",
      description:
        "LOOK: exaggerated duration. The white square (popover at top:0/right:0) is easy to see while moving between steps.",
      run() {
        runAnchorless(1500);
      },
    },
  ],
};
