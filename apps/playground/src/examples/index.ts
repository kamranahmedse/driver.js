import type { Example, ExampleGroup } from "./types";
import { highlightGroup } from "./highlight";
import { popoverGroup } from "./popover";
import { arrowGroup } from "./arrow";
import { tourGroup } from "./tour";
import { apiGroup } from "./api";
import { durationGroup } from "./duration";
import { scrollGroup } from "./scroll";
import { instancesGroup } from "./instances";
import { skipMissingGroup } from "./skip-missing";
import { advanceWaitGroup } from "./advance-wait";
import { hintsGroup } from "./hints";
import { anchorlessGroup } from "./anchorless";

export const exampleGroups: ExampleGroup[] = [
  highlightGroup,
  popoverGroup,
  arrowGroup,
  tourGroup,
  hintsGroup,
  advanceWaitGroup,
  skipMissingGroup,
  instancesGroup,
  durationGroup,
  scrollGroup,
  apiGroup,
  anchorlessGroup,
];

export const examples: Example[] = exampleGroups.flatMap(group => group.examples);

export function findExample(id: string | undefined): Example | undefined {
  return examples.find(example => example.id === id);
}

export type { Example, ExampleGroup };
