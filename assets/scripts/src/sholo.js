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

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

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
    this.window.addEventListener('mouseup', this.onMouseUp, false);
  }

  onMouseUp(e) {
    const highlightedElement = this.overlay.getHighlightedElement();
    const popover = document.getElementById('sholo-popover-item');

    if (!highlightedElement || !highlightedElement.node) {
      return;
    }

    // Remove the overlay If clicked outside the highlighted element
    if (!highlightedElement.node.contains(e.target) && (!popover || !popover.contains(e.target))) {
      this.overlay.clear();
    }
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

  /**
   * Highlights the given selector
   * @param selector
   */
  highlight(selector) {
    let domElement;

    if (typeof selector === 'string') {
      domElement = document.querySelector(selector);
    } else if (typeof selector === 'object') {
      domElement = selector;
    } else {
      throw new Error('Element can only be string or the dom element');
    }

    if (domElement) {
      const element = new Element(domElement, this.options);
      this.overlay.highlight(element);
    } else {
      this.overlay.clear();
    }
  }
}
