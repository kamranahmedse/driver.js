import {
  ATTRIBUTE_STEP,
  ATTRIBUTE_TITLE,
  ATTRIBUTE_DESCRIPTION,
  ATTRIBUTE_POSITION,
  ATTRIBUTE_DRIVER,
  ATTRIBUTE_SHOW_BUTTONS,
  ATTRIBUTE_DONE_BTN_TEXT,
  ATTRIBUTE_CLOSE_BTN_TEXT,
  ATTRIBUTE_NEXT_BTN_TEXT,
  ATTRIBUTE_PREV_BTN_TEXT,
  ATTRIBUTE_STAGE_BACKGROUND,
} from '../common/constants';
import Driver from '../index';

/**
 * Map given element to step
 * @param {element} element
 */
function mapElement(element) {
  const step =  {
    element,
    step: element.getAttribute(ATTRIBUTE_STEP) ? parseInt(element.getAttribute(ATTRIBUTE_STEP), 10) : 99,
    stageBackground: element.getAttribute(ATTRIBUTE_STAGE_BACKGROUND),
    popover: {
      title: element.getAttribute(ATTRIBUTE_TITLE),
      description: element.getAttribute(ATTRIBUTE_DESCRIPTION),
      position: element.getAttribute(ATTRIBUTE_POSITION),
      showButtons: element.getAttribute(ATTRIBUTE_SHOW_BUTTONS) !== 'false',
      doneBtnText: element.getAttribute(ATTRIBUTE_DONE_BTN_TEXT),
      closeBtnText: element.getAttribute(ATTRIBUTE_CLOSE_BTN_TEXT),
      nextBtnText: element.getAttribute(ATTRIBUTE_NEXT_BTN_TEXT),
      prevBtnText: element.getAttribute(ATTRIBUTE_PREV_BTN_TEXT),
    },
  };

  if (!step.stageBackground) delete step.stageBackground;
  if (!step.popover.position) delete step.popover.position;
  if (!step.popover.doneBtnText) delete step.popover.doneBtnText;
  if (!step.popover.closeBtnText) delete step.popover.closeBtnText;
  if (!step.popover.nextBtnText) delete step.popover.nextBtnText;
  if (!step.popover.prevBtnText) delete step.popover.prevBtnText;

  return step;
}

/**
 * Compare steps of A and B elements
 * @param {element} elA
 * @param {element} elB
 */
function elementCompare(elA, elB) {
  return elA.step - elB.step;
  // if (elA.step < elB.step) return -1;
  // if (elA.step > elB.step) return 1;
  // return 0;
}

/**
 * Instantiate Driver.js using element attributes
 * @param {Object} options
 * @param {string|element} rootElement
 */
export default function bootstrapper(options, rootElement) {
  if (typeof rootElement === 'string') {
    rootElement = document.getElementById(rootElement);
  }

  const elements = rootElement.querySelectorAll(`[${ATTRIBUTE_DRIVER}]`);

  const driver = new Driver(options);
  if (!elements || elements.length === 0) {
    return driver;
  }

  const steps = Array.prototype.slice.call(elements)
    .map(mapElement)
    .sort(elementCompare);

  if (steps.length === 1) {
    driver.highlight(steps[0]);
  } else {
    driver.defineSteps(steps);
  }

  return driver;
}
