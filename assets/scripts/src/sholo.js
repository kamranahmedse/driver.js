import Overlay from './overlay';
import Element from './element';


/**
 * Plugin class that drives the plugin
 */
export default class Sholo {
  constructor({ alpha = 0.75 } = {}) {
    this.overlay = new Overlay({ alpha });
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
    this.overlay.highglight(element);
  }
}
