import Overlay from './overlay';
import Element from './element';
import './polyfill';
import Popover from './popover';
import {
  CLASS_CLOSE_BTN,
  CLASS_NEXT_STEP_BTN,
  CLASS_PREV_STEP_BTN,
  ESC_KEY_CODE,
  ID_POPOVER,
  OVERLAY_ANIMATE,
  OVERLAY_OPACITY,
  OVERLAY_PADDING,
} from './constants';

/**
 * Plugin class that drives the plugin
 */
export default class Sholo {
  /**
   * @param options
   */
  constructor(options = {}) {
    this.options = Object.assign({
      animate: OVERLAY_ANIMATE,     // Whether to animate or not
      opacity: OVERLAY_OPACITY,     // Overlay opacity
      padding: OVERLAY_PADDING,     // Spacing around the element from the overlay
    }, options);

    this.document = document;
    this.window = window;

    this.overlay = new Overlay(this.options, this.window, this.document);

    this.steps = [];            // steps to be presented if any
    this.currentStep = 0;       // index for the currently highlighted step

    this.onScroll = this.onScroll.bind(this);
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
    this.document.addEventListener('scroll', this.onScroll, false);
    this.document.addEventListener('DOMMouseScroll', this.onScroll, false);
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
    if (!this.hasHighlightedElement()) {
      // Has no highlighted element so ignore the click
      return;
    }

    const highlightedElement = this.overlay.getHighlightedElement();
    const popover = this.document.getElementById(ID_POPOVER);

    const clickedHighlightedElement = highlightedElement.node.contains(e.target);
    const clickedPopover = popover && popover.contains(e.target);

    // Remove the overlay If clicked outside the highlighted element
    if (!clickedHighlightedElement && !clickedPopover) {
      this.overlay.clear();
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
   * Resets the steps if any and clears the overlay
   */
  reset() {
    this.currentStep = 0;
    this.overlay.clear();
  }

  /**
   * Checks if there is any highlighted element or not
   * @returns {boolean}
   */
  hasHighlightedElement() {
    const highlightedElement = this.overlay.getHighlightedElement();
    return highlightedElement && highlightedElement.node;
  }

  /**
   * Handler for the onScroll event on document
   * Refreshes without animation on scroll to make sure
   * that the highlighted part travels with the scroll
   */
  onScroll() {
    this.overlay.refresh(false);
  }

  /**
   * Handler for the onResize DOM event
   * Refreshes with animation on scroll to make sure that
   * the highlighted part travels with the width change of window
   */
  onResize() {
    // Refresh with animation
    this.overlay.refresh(true);
  }

  /**
   * Clears the overlay on escape key process
   * @param event
   */
  onKeyUp(event) {
    if (event.keyCode === ESC_KEY_CODE) {
      this.overlay.clear();
    }
  }

  defineSteps(steps) {
    this.steps = [];

    steps.forEach((step, index) => {
      if (!step.element || typeof step.element !== 'string') {
        throw new Error(`Element (query selector string) missing in step ${index}`);
      }

      const elementOptions = Object.assign({}, this.options, step);
      const domElement = this.document.querySelector(step.element);
      if (!domElement) {
        console.warn(`Element to highlight ${step.element} not found`);
        return;
      }

      let popover = null;
      const popoverOptions = Object.assign({}, this.options, elementOptions.popover || {});
      if (elementOptions.popover && elementOptions.popover.description) {
        popover = new Popover(popoverOptions, this.window, this.document);
      }

      const element = new Element(domElement, elementOptions, popover, this.overlay, this.window, this.document);

      this.steps.push(element);
    });
  }

  start() {
    if (!this.steps || this.steps.length === 0) {
      throw new Error('There are no steps defined to iterate');
    }

    this.currentStep = 0;
    this.overlay.highlight(this.steps[0]);
  }

  /**
   * Highlights the given selector
   * @param selector string query selector
   * @todo make it accept json or query selector
   */
  highlight(selector) {
    const domElement = this.document.querySelector(selector);
    if (!domElement) {
      console.warn(`Element to highlight ${selector} not found`);
      return;
    }

    // @todo add options such as position, button texts, additional classes etc
    const popover = new Popover(this.options, this.window, this.document);
    const element = new Element(domElement, this.options, popover, this.overlay, this.window, this.document);
    this.overlay.highlight(element);
  }
}
