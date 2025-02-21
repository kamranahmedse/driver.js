import { easeInOutQuad } from "./utils";
import { onDriverClick } from "./events";
import { emit } from "./emitter";
import { getConfig } from "./config";
import { getState, setState } from "./state";

const overlayDarkPathClass = 'driver-overlay-dark-path';
const overlayHighlightPathClass = 'driver-overlay-highlight-path';

export type StageDefinition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// This method calculates the animated new position of the
// stage (called for each frame by requestAnimationFrame)
export function transitionStage(elapsed: number, duration: number, from: Element, to: Element) {
  let activeStagePosition = getState("__activeStagePosition");

  const fromDefinition = activeStagePosition ? activeStagePosition : from.getBoundingClientRect();
  const toDefinition = to.getBoundingClientRect();

  const x = easeInOutQuad(elapsed, fromDefinition.x, toDefinition.x - fromDefinition.x, duration);
  const y = easeInOutQuad(elapsed, fromDefinition.y, toDefinition.y - fromDefinition.y, duration);
  const width = easeInOutQuad(elapsed, fromDefinition.width, toDefinition.width - fromDefinition.width, duration);
  const height = easeInOutQuad(elapsed, fromDefinition.height, toDefinition.height - fromDefinition.height, duration);

  activeStagePosition = {
    x,
    y,
    width,
    height,
  };

  renderOverlay(activeStagePosition);
  setState("__activeStagePosition", activeStagePosition);
}

export function trackActiveElement(element: Element) {
  if (!element) {
    return;
  }

  const definition = element.getBoundingClientRect();

  const activeStagePosition: StageDefinition = {
    x: definition.x,
    y: definition.y,
    width: definition.width,
    height: definition.height,
  };

  setState("__activeStagePosition", activeStagePosition);

  renderOverlay(activeStagePosition);
}

export function refreshOverlay() {
  const activeStagePosition = getState("__activeStagePosition");
  const overlaySvg = getState("__overlaySvg");

  if (!activeStagePosition) {
    return;
  }

  if (!overlaySvg) {
    console.warn("No stage svg found.");
    return;
  }

  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  overlaySvg.setAttribute("viewBox", `0 0 ${windowX} ${windowY}`);
  
  updateHighlightElement(activeStagePosition);
}

function mountOverlay(stagePosition: StageDefinition) {
  const overlaySvg = createOverlaySvg(stagePosition);
  document.body.appendChild(overlaySvg);

  onDriverClick(overlaySvg, e => {
    const target = e.target as SVGElement;
    if (target.tagName !== "path") {
      return;
    }

    emit("overlayClick");
  });

  setState("__overlaySvg", overlaySvg);
}

function renderOverlay(stagePosition: StageDefinition) {
  const overlaySvg = getState("__overlaySvg");

  // TODO: cancel rendering if element is not visible
  if (!overlaySvg) {
    mountOverlay(stagePosition);

    return;
  }

  const pathElement = overlaySvg.querySelector(`path.${overlayDarkPathClass}`) as SVGPathElement | null;
  if (!pathElement) {
    throw new Error("no path element found in stage svg");
  }

  pathElement.setAttribute("d", generateStageSvgPathString(stagePosition));
  
  // Update or create highlight element
  updateHighlightElement(stagePosition);
}

function updateHighlightElement(stagePosition: StageDefinition) {
  const highlightColor = getConfig("highlightColor");
  
  // Only proceed if highlighting is enabled
  if (!highlightColor) {
    return;
  }
  
  const overlaySvg = getState("__overlaySvg");
  if (!overlaySvg) {
    return;
  }
  
  // Find existing highlight element
  let highlightElement = overlaySvg.querySelector(`path.${overlayHighlightPathClass}`) as SVGPathElement | null;
  
  // If no existing highlight element then create one
  if (!highlightElement) {
    highlightElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    highlightElement.classList.add(overlayHighlightPathClass);
    highlightElement.style.pointerEvents = "none"; // Don't interfere with clicks
    overlaySvg.appendChild(highlightElement);
  }
  
  // Generate path for the highlighted area (inner cutout)
  const highlightPath = generateHighlightSvgPathString(stagePosition);
  highlightElement.setAttribute("d", highlightPath);
  
  // Match any animation timing with the overlay
  if (overlaySvg.classList.contains('driver-overlay-animated')) {
    highlightElement.setAttribute("d", highlightPath);
  }
}

function createOverlaySvg(stage: StageDefinition): SVGSVGElement {
  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("driver-overlay", "driver-overlay-animated");

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

  const stagePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  stagePath.classList.add(overlayDarkPathClass);

  stagePath.setAttribute("d", generateStageSvgPathString(stage));

  stagePath.style.fill = getConfig("overlayColor") || "rgb(0,0,0)";
  stagePath.style.opacity = `${getConfig("overlayOpacity")}`;
  stagePath.style.pointerEvents = "auto";
  stagePath.style.cursor = "auto";

  svg.appendChild(stagePath);
  
  // If highlight color is configured, add the highlight element
  const highlightColor = getConfig("highlightColor");
  if (highlightColor) {
    const highlightPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    highlightPath.classList.add(overlayHighlightPathClass);
    
    highlightPath.setAttribute("d", generateHighlightSvgPathString(stage));
    
    highlightPath.style.fill = highlightColor;
    highlightPath.style.opacity = `${getConfig("highlightOpacity")}`;
    highlightPath.style.pointerEvents = "none";  // Prevent interfering with clicks
    
    svg.appendChild(highlightPath);
  }

  return svg;
}

function generateStageSvgPathString(stage: StageDefinition) {
  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  const stagePadding = getConfig("stagePadding") || 0;
  const stageRadius = getConfig("stageRadius") || 0;

  const stageWidth = stage.width + stagePadding * 2;
  const stageHeight = stage.height + stagePadding * 2;

  // prevent glitches when stage is too small for radius
  const limitedRadius = Math.min(stageRadius, stageWidth / 2, stageHeight / 2);

  // no value below 0 allowed + round down
  const normalizedRadius = Math.floor(Math.max(limitedRadius, 0));

  const highlightBoxX = stage.x - stagePadding + normalizedRadius;
  const highlightBoxY = stage.y - stagePadding;
  const highlightBoxWidth = stageWidth - normalizedRadius * 2;
  const highlightBoxHeight = stageHeight - normalizedRadius * 2;

  return `M${windowX},0L0,0L0,${windowY}L${windowX},${windowY}L${windowX},0Z
    M${highlightBoxX},${highlightBoxY} h${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},${normalizedRadius} v${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},${normalizedRadius} h-${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},-${normalizedRadius} v-${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},-${normalizedRadius} z`;
}

// Generate path for just the highlight area (inner cutout)
function generateHighlightSvgPathString(stage: StageDefinition) {
  const stagePadding = getConfig("stagePadding") || 0;
  const stageRadius = getConfig("stageRadius") || 0;

  const stageWidth = stage.width + stagePadding * 2;
  const stageHeight = stage.height + stagePadding * 2;

  // Prevent glitches when stage is too small for radius
  const limitedRadius = Math.min(stageRadius, stageWidth / 2, stageHeight / 2);

  // No value below 0 allowed + round down
  const normalizedRadius = Math.floor(Math.max(limitedRadius, 0));

  const highlightBoxX = stage.x - stagePadding + normalizedRadius;
  const highlightBoxY = stage.y - stagePadding;
  const highlightBoxWidth = stageWidth - normalizedRadius * 2;
  const highlightBoxHeight = stageHeight - normalizedRadius * 2;

  return `M${highlightBoxX},${highlightBoxY} h${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},${normalizedRadius} v${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},${normalizedRadius} h-${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},-${normalizedRadius} v-${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},-${normalizedRadius} z`;
}

export function destroyOverlay() {
  const overlaySvg = getState("__overlaySvg");
  if (overlaySvg) {
    overlaySvg.remove();
  }
}
