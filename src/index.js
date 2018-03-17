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
  OVERLAY_OPACITY,
  OVERLAY_PADDING,
  RIGHT_KEY_CODE,
  SHOULD_ANIMATE_OVERLAY,
  SHOULD_OUTSIDE_CLICK_CLOSE,
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
    this.options = {
      animate: SHOULD_ANIMATE_OVERLAY, // Whether to animate or not
      opacity: OVERLAY_OPACITY, // Overlay opacity
      padding: OVERLAY_PADDING, // Spacing around the element from the overlay
      scrollIntoViewOptions: null,  // Options to be passed to `scrollIntoView`
      allowClose: SHOULD_OUTSIDE_CLICK_CLOSE,    // Whether to close overlay on click outside the element
      stageBackground: '#ffffff',   // Background color for the stage
      onHighlightStarted: () => {   // When element is about to be highlighted
      },
      onHighlighted: () => {        // When element has been highlighted
      },
      onDeselected: () => {         // When the element has been deselected
      },
      ...options,
    };

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
   * @private
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
   * @private
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
    if (!clickedHighlightedElement && !clickedPopover && this.options.allowClose) {
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
   * Handler for the onResize DOM event
   * Makes sure highlighted element stays at valid position
   * @private
   */
  onResize() {
    if (!this.isActivated) {
      return;
    }

    this.overlay.refresh();
  }

  /**
   * Clears the overlay on escape key process
   * @param event
   * @private
   */
  onKeyUp(event) {
    if (!this.isActivated) {
      return;
    }

    // If escape was pressed and it is allowed to click outside to close
    if (event.keyCode === ESC_KEY_CODE && this.options.allowClose) {
      this.reset();
      return;
    }

    // Arrow keys to only perform if it is stepped introduction
    if (this.steps.length !== 0) {
      if (event.keyCode === RIGHT_KEY_CODE) {
        this.moveNext();
      } else if (event.keyCode === LEFT_KEY_CODE) {
        this.movePrevious();
      }
    }
  }

  /**
   * Moves to the previous step if possible
   * otherwise resets the overlay
   * @public
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
   * @public
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
   * @public
   */
  hasNextStep() {
    return !!this.steps[this.currentStep + 1];
  }

  /**
   * @returns {boolean}
   * @public
   */
  hasPreviousStep() {
    return !!this.steps[this.currentStep - 1];
  }

  /**
   * Resets the steps if any and clears the overlay
   * @param {boolean} immediate
   * @public
   */
  reset(immediate = false) {
    this.currentStep = 0;
    this.isActivated = false;
    this.overlay.clear(immediate);
  }

  /**
   * Checks if there is any highlighted element or not
   * @returns {boolean}
   * @public
   */
  hasHighlightedElement() {
    const highlightedElement = this.overlay.getHighlightedElement();
    return highlightedElement && highlightedElement.node;
  }

  /**
   * Gets the currently highlighted element in overlay
   * @returns {Element}
   * @public
   */
  getHighlightedElement() {
    return this.overlay.getHighlightedElement();
  }

  /**
   * Gets the element that was highlighted before currently highlighted element
   * @returns {Element}
   * @public
   */
  getLastHighlightedElement() {
    return this.overlay.getLastHighlightedElement();
  }

  /**
   * Defines steps to be highlighted
   * @param {array} steps
   * @public
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
   * @private
   */
  prepareElementFromStep(currentStep, allSteps = [], index = 0) {
    let querySelector = '';
    let elementOptions = {};

    // If it is just a query selector string
    if (typeof currentStep === 'string') {
      querySelector = currentStep;
    } else {
      querySelector = currentStep.element;
      elementOptions = {
        ...this.options,
        ...currentStep,
      };
    }

    const domElement = this.document.querySelector(querySelector);
    if (!domElement) {
      console.warn(`Element to highlight ${querySelector} not found`);
      return null;
    }

    let popover = null;
    if (elementOptions.popover && elementOptions.popover.description) {
      const popoverOptions = {
        ...this.options,
        ...elementOptions.popover,
        totalCount: allSteps.length,
        currentIndex: index,
        isFirst: index === 0,
        isLast: index === allSteps.length - 1,
      };

      popover = new Popover(popoverOptions, this.window, this.document);
    }

    const stageOptions = {
      ...this.options,
      ...elementOptions,
    };

    const stage = new Stage(stageOptions, this.window, this.document);

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
   * @public
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
   * @public
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
