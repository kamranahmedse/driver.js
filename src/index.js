import Overlay from './core/overlay';
import Element from './core/element';
import Popover from './core/popover';
import './common/polyfill';
import {
  CLASS_CLOSE_BTN,
  CLASS_NEXT_STEP_BTN,
  CLASS_PREV_STEP_BTN,
  ESC_KEY_CODE,
  ID_POPOVER,
  LEFT_KEY_CODE,
  OVERLAY_ANIMATE,
  OVERLAY_OPACITY,
  OVERLAY_PADDING,
  RIGHT_KEY_CODE,
} from './common/constants';
import Stage from './core/stage';

/**
 * Plugin class that drives the plugin
 */
export default class Driver {
  /**
   * @param {Object} options
   */
  constructor(options = {}) {
    this.options = Object.assign({
      animate: OVERLAY_ANIMATE,     // Whether to animate or not
      opacity: OVERLAY_OPACITY,     // Overlay opacity
      padding: OVERLAY_PADDING,     // Spacing around the element from the overlay
      scrollIntoViewOptions: null,  // Options to be passed to `scrollIntoView`
      onHighlightStarted: () => {   // When element is about to be highlighted
      },
      onHighlighted: () => {        // When element has been highlighted
      },
      onDeselected: () => {         // When the element has been deselected
      },
    }, options);

    this.document = document;
    this.window = window;
    this.isActivated = false;
    this.steps = [];            // steps to be presented if any
    this.currentStep = 0;       // index for the currently highlighted step

    this.overlay = new Overlay(this.options, window, document);

    this.onResize = this.onResize.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onClick = this.onClick.bind(this);

    // Event bindings
    this.bind();
  }

  /**
   * Binds any DOM events listeners
   * @todo: add throttling in all the listeners
   */
  bind() {
    this.window.addEventListener('resize', this.onResize, false);
    this.window.addEventListener('keyup', this.onKeyUp, false);
    this.window.addEventListener('click', this.onClick, false);
  }

  /**
   * Removes the popover if clicked outside the highlighted element
   * or outside the
   * @param e
   */
  onClick(e) {
    if (!this.isActivated || !this.hasHighlightedElement()) {
      return;
    }

    const highlightedElement = this.overlay.getHighlightedElement();
    const popover = this.document.getElementById(ID_POPOVER);

    const clickedHighlightedElement = highlightedElement.node.contains(e.target);
    const clickedPopover = popover && popover.contains(e.target);

    // Remove the overlay If clicked outside the highlighted element
    if (!clickedHighlightedElement && !clickedPopover) {
      this.reset();
      return;
    }

    const nextClicked = e.target.classList.contains(CLASS_NEXT_STEP_BTN);
    const prevClicked = e.target.classList.contains(CLASS_PREV_STEP_BTN);
    const closeClicked = e.target.classList.contains(CLASS_CLOSE_BTN);

    if (closeClicked) {
      this.reset();
      return;
    }

    if (nextClicked) {
      this.moveNext();
    } else if (prevClicked) {
      this.movePrevious();
    }
  }

  /**
   * Moves to the previous step if possible
   * otherwise resets the overlay
   */
  movePrevious() {
    this.currentStep -= 1;
    if (this.steps[this.currentStep]) {
      this.overlay.highlight(this.steps[this.currentStep]);
    } else {
      this.reset();
    }
  }

  /**
   * Moves to the next step if possible
   * otherwise resets the overlay
   */
  moveNext() {
    this.currentStep += 1;
    if (this.steps[this.currentStep]) {
      this.overlay.highlight(this.steps[this.currentStep]);
    } else {
      this.reset();
    }
  }

  /**
   * @returns {boolean}
   */
  hasNextStep() {
    return !!this.steps[this.currentStep + 1];
  }

  /**
   * @returns {boolean}
   */
  hasPreviousStep() {
    return !!this.steps[this.currentStep - 1];
  }

  /**
   * Resets the steps if any and clears the overlay
   */
  reset() {
    this.currentStep = 0;
    this.isActivated = false;
    this.overlay.clear();
  }

  /**
   * Checks if there is any highlighted element or not
   * @returns {boolean}
   */
  hasHighlightedElement() {
    const highlightedElement = this.overlay.getHighlightedElement();
    return highlightedElement && highlightedElement.node && highlightedElement.highlightFinished;
  }

  /**
   * Gets the currently highlighted element in overlay
   * @returns {Element}
   */
  getHighlightedElement() {
    return this.overlay.getHighlightedElement();
  }

  /**
   * Gets the element that was highlighted before currently highlighted element
   * @returns {Element}
   */
  getLastHighlightedElement() {
    return this.overlay.getLastHighlightedElement();
  }

  /**
   * Handler for the onResize DOM event
   * Refreshes with animation on scroll to make sure that
   * the highlighted part travels with the width change of window
   */
  onResize() {
    if (!this.isActivated) {
      return;
    }

    // Refresh with animation
    this.overlay.refresh();
  }

  /**
   * Clears the overlay on escape key process
   * @param event
   */
  onKeyUp(event) {
    if (!this.isActivated) {
      return;
    }

    if (event.keyCode === ESC_KEY_CODE) {
      this.reset();
    } else if (event.keyCode === RIGHT_KEY_CODE) {
      this.moveNext();
    } else if (event.keyCode === LEFT_KEY_CODE) {
      this.movePrevious();
    }
  }

  /**
   * Defines steps to be highlighted
   * @param {array} steps
   */
  defineSteps(steps) {
    this.steps = [];

    steps.forEach((step, index) => {
      if (!step.element || typeof step.element !== 'string') {
        throw new Error(`Element (query selector string) missing in step ${index}`);
      }

      const element = this.prepareElementFromStep(step, steps, index);
      if (!element) {
        return;
      }

      this.steps.push(element);
    });
  }

  /**
   * Prepares the step received from the user and returns an instance
   * of Element
   *
   * @param currentStep Step that is being prepared
   * @param allSteps  List of all the steps
   * @param index Index of the current step
   * @returns {null|Element}
   */
  prepareElementFromStep(currentStep, allSteps = [], index = 0) {
    let querySelector = '';
    let elementOptions = {};

    // If it is just a query selector string
    if (typeof currentStep === 'string') {
      querySelector = currentStep;
    } else {
      querySelector = currentStep.element;
      elementOptions = Object.assign(
        {},
        this.options,
        currentStep,
      );
    }

    const domElement = this.document.querySelector(querySelector);
    if (!domElement) {
      console.warn(`Element to highlight ${querySelector} not found`);
      return null;
    }

    let popover = null;
    if (elementOptions.popover && elementOptions.popover.description) {
      const popoverOptions = Object.assign(
        {},
        this.options,
        elementOptions.popover,
        {
          totalCount: allSteps.length,
          currentIndex: index,
          isFirst: index === 0,
          isLast: index === allSteps.length - 1,
        },
      );

      popover = new Popover(popoverOptions, this.window, this.document);
    }

    const stage = new Stage(this.options, this.window, this.document);

    return new Element({
      node: domElement,
      options: elementOptions,
      popover,
      stage,
      overlay: this.overlay,
      window: this.window,
      document: this.document,
    });
  }

  /**
   * Initiates highlighting steps from first step
   * @param {number} index at which highlight is to be started
   */
  start(index = 0) {
    if (!this.steps || this.steps.length === 0) {
      throw new Error('There are no steps defined to iterate');
    }

    this.isActivated = true;

    this.currentStep = index;
    this.overlay.highlight(this.steps[index]);
  }

  /**
   * Highlights the given element
   * @param {string|{element: string, popover: {}}} selector Query selector or a step definition
   */
  highlight(selector) {
    this.isActivated = true;

    const element = this.prepareElementFromStep(selector);
    if (!element) {
      return;
    }

    this.overlay.highlight(element);
  }
}
