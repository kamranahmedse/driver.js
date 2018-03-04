import Overlay from './overlay';
import Element from './element';


/**
 * Plugin class that drives the plugin
 */
export default class Sholo {
  constructor({ opacity = 0.75 } = {}) {
    this.overlay = new Overlay({ opacity });
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

    const element = new Element(domElement);
    this.overlay.highlight(element);
  }
}
