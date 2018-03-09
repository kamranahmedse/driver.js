import Overlay from './overlay';
import Element from './element';
import './polyfill';

/**
 * Plugin class that drives the plugin
 */
export default class Sholo {
  /**
   * @param options
   */
  constructor(options = {}) {
    this.options = Object.assign({
      padding: 10,
      animate: true,
      opacity: 0.75,
    }, options);

    this.overlay = new Overlay(options);

    this.document = document;
    this.window = window;

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
    const popover = document.getElementById('sholo-popover-item');

    const clickedHighlightedElement = highlightedElement.node.contains(e.target);
    const clickedPopover = popover && popover.contains(e.target);

    // Remove the overlay If clicked outside the highlighted element
    if (!clickedHighlightedElement && !clickedPopover) {
      this.overlay.clear();
      return;
    }

    const nextClicked = e.target.classList.contains('sholo-next-btn');
    const prevClicked = e.target.classList.contains('sholo-prev-btn');
    const closeClicked = e.target.classList.contains('sholo-close-btn');

    if (nextClicked) {
      this.moveNext();
    } else if (prevClicked) {
      this.movePrevious();
    } else if (closeClicked) {
      this.reset();
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
    if (event.keyCode === 27) {
      this.overlay.clear();
    }
  }

  defineSteps(steps) {
    this.steps = [];

    steps.forEach((step, index) => {
      if (!step.element) {
        throw new Error(`Element (query selector or a dom element) missing in step ${index}`);
      }

      const domElement = Sholo.findDomElement(step.element);
      const element = new Element(domElement, Object.assign({}, this.options, step));

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
   * @param selector
   */
  highlight(selector) {
    const domElement = Sholo.findDomElement(selector);

    const element = new Element(domElement, this.options);
    this.overlay.highlight(element);
  }

  static findDomElement(selector) {
    if (typeof selector === 'string') {
      return document.querySelector(selector);
    }

    if (typeof selector === 'object') {
      return selector;
    }

    throw new Error('Element can only be string or the dom element');
  }
}
