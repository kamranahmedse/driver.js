import Overlay from './overlay';
import Element from './element';
import './polyfill';

/**
 * Plugin class that drives the plugin
 */
export default class Sholo {
  constructor({
    opacity = 0.75,
    padding = 5,
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

  bind() {
    // @todo: add throttling in all the listeners
    this.document.addEventListener('scroll', this.onScroll, false);
    this.document.addEventListener('DOMMouseScroll', this.onScroll, false);
    this.window.addEventListener('resize', this.onResize, false);
    this.window.addEventListener('keyup', this.onKeyUp, false);
  }

  onScroll() {
    // Refresh without animation on scroll
    this.overlay.refresh(false);
  }

  onResize() {
    // Refresh with animation
    this.overlay.refresh(true);
  }

  onKeyUp(event) {
    if (event.keyCode === 27) {
      this.overlay.clear();
    }
  }

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
