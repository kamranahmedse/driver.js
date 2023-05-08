import { easeInOutQuad } from "./math";

export type StageDefinition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

let activeStagePosition: StageDefinition | undefined;
let stageSvg: SVGSVGElement | undefined;

// This method calculates the animated new position of the
// stage (called for each frame by requestAnimationFrame)
export function transitionStage(
  elapsed: number,
  duration: number,
  from: Element,
  to: Element
) {
  const fromDefinition = activeStagePosition
    ? activeStagePosition
    : from.getBoundingClientRect();

  const toDefinition = to.getBoundingClientRect();

  const x = easeInOutQuad(
    elapsed,
    fromDefinition.x,
    toDefinition.x - fromDefinition.x,
    duration
  );

  const y = easeInOutQuad(
    elapsed,
    fromDefinition.y,
    toDefinition.y - fromDefinition.y,
    duration
  );

  const width = easeInOutQuad(
    elapsed,
    fromDefinition.width,
    toDefinition.width - fromDefinition.width,
    duration
  );

  const height = easeInOutQuad(
    elapsed,
    fromDefinition.height,
    toDefinition.height - fromDefinition.height,
    duration
  );

  activeStagePosition = {
    x,
    y,
    width,
    height,
  };

  renderStage(activeStagePosition);
}

export function trackActiveElement(element: Element) {
  if (!element) {
    return;
  }

  const definition = element.getBoundingClientRect();

  activeStagePosition = {
    x: definition.x,
    y: definition.y,
    width: definition.width,
    height: definition.height,
  };

  renderStage(activeStagePosition);
}

export function refreshStage() {
  if (!activeStagePosition) {
    return;
  }

  if (!stageSvg) {
    console.warn("No stage svg found.");
    return;
  }

  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  stageSvg.setAttribute("viewBox", `0 0 ${windowX} ${windowY}`);
}

function renderStage(stagePosition: StageDefinition) {
  if (!stageSvg) {
    stageSvg = createStageSvg(stagePosition);
    document.body.appendChild(stageSvg);

    return;
  }

  const pathElement = stageSvg.firstElementChild as SVGPathElement | null;
  if (pathElement?.tagName !== "path") {
    throw new Error("no path element found in stage svg");
  }

  pathElement.setAttribute("d", generateSvgCutoutPathString(stagePosition));
}

function createStageSvg(stage: StageDefinition): SVGSVGElement {
  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("driver-stage", "driver-stage-animated");

  svg.setAttribute("viewBox", `0 0 ${windowX} ${windowY}`);
  svg.setAttribute("xmlSpace", "preserve");
  svg.setAttribute("xmlnsXlink", "http://www.w3.org/1999/xlink");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("preserveAspectRatio", "xMinYMin slice");

  svg.style.fillRule = "evenodd";
  svg.style.clipRule = "evenodd";
  svg.style.strokeLinejoin = "round";
  svg.style.strokeMiterlimit = "2";
  svg.style.zIndex = "10000";
  svg.style.position = "fixed";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";

  const cutoutPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  cutoutPath.setAttribute("d", generateSvgCutoutPathString(stage));

  cutoutPath.style.fill = "rgb(0,0,0)";
  cutoutPath.style.opacity = `0.7`;
  cutoutPath.style.pointerEvents = "auto";
  cutoutPath.style.cursor = "auto";

  svg.appendChild(cutoutPath);

  return svg;
}

function generateSvgCutoutPathString(stage: StageDefinition) {
  const padding = 4;
  const radius = 5;

  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  const stageWidth = stage.width + padding * 2;
  const stageHeight = stage.height + padding * 2;

  // prevent glitches when stage is too small for radius
  const limitedRadius = Math.min(radius, stageWidth / 2, stageHeight / 2);

  // no value below 0 allowed + round down
  const normalizedRadius = Math.floor(Math.max(limitedRadius, 0));

  const highlightBoxX = stage.x - padding + normalizedRadius;
  const highlightBoxY = stage.y - padding;
  const highlightBoxWidth = stageWidth - normalizedRadius * 2;
  const highlightBoxHeight = stageHeight - normalizedRadius * 2;

  return `M${windowX},0L0,0L0,${windowY}L${windowX},${windowY}L${windowX},0Z
    M${highlightBoxX},${highlightBoxY} h${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},${normalizedRadius} v${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},${normalizedRadius} h-${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},-${normalizedRadius} v-${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},-${normalizedRadius} z`;
}

export function destroyStage() {
  if (stageSvg) {
    stageSvg.remove();
    stageSvg = undefined;
  }

  activeStagePosition = undefined;
}
