import Overlay from './overlay';
import Element from './element';
import './polyfill';

/**
 * Plugin class that drives the plugin
 */
export default class Sholo {
  /**
   * @param opacity number
   * @param padding number
   * @param animate boolean
   */
  constructor({
    opacity = 0.75,
    padding = 10,
    animate = true,
  } = {}) {
    this.overlay = new Overlay({
      opacity,
      padding,
      animate,
    });

    this.document = document;
    this.window = window;

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

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
      const element = new Element(domElement);
      this.overlay.highlight(element);
    } else {
      this.overlay.clear();
    }
  }
}
