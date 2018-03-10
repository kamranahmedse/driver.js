import Element from './element';
import {
  CLASS_POPOVER_DESCRIPTION,
  CLASS_POPOVER_TIP,
  CLASS_POPOVER_TITLE,
  ID_POPOVER,
  OVERLAY_PADDING,
  POPOVER_HTML,
} from './constants';

/**
 * Popover that is displayed on top of the highlighted element
 */
export default class Popover extends Element {
  constructor(options = {
    padding: OVERLAY_PADDING,
  }, window, document) {
    super();

    this.options = options;
    this.window = window;
    this.document = document;

    this.node = this.makeNode();
    this.hide();
  }

  makeNode() {
    let popover = this.document.getElementById(ID_POPOVER);
    if (popover) {
      return popover;
    }

    popover = Popover.createFromString(POPOVER_HTML);
    document.body.appendChild(popover);

    return popover;
  }

  /**
   * Turn a string into a node
   * @param  {String} htmlString to convert
   * @return {Node}   Converted node element
   */
  static createFromString(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
  }

  getHeight() {
    return Math.max(this.node.scrollHeight, this.node.offsetHeight);
  }

  hide() {
    this.node.style.display = 'none';
  }

  reset() {
    this.node.style.display = 'block';
    this.node.style.left = '0';
    this.node.style.top = '0';
    this.node.style.bottom = '';
    this.node.style.right = '';

    // Remove the positional classes from tip
    this.node
      .querySelector(`.${CLASS_POPOVER_TIP}`)
      .className = CLASS_POPOVER_TIP;
  }

  show(position) {
    this.reset();

    const popoverTip = this.node.querySelector(`.${CLASS_POPOVER_TIP}`);
    const popoverTitle = this.node.querySelector(`.${CLASS_POPOVER_TITLE}`);
    const popoverDescription = this.node.querySelector(`.${CLASS_POPOVER_DESCRIPTION}`);

    popoverTitle.innerText = this.options.title;
    popoverDescription.innerText = this.options.description;

    const pageHeight = this.getFullPageSize().height;
    const popoverMargin = this.options.padding + 10;
    const popoverHeight = this.getHeight();

    this.node.style.left = `${position.left - this.options.padding}px`;

    // Calculate different dimensions after attaching popover
    const pageHeightAfterPopOver = position.bottom + popoverHeight + popoverMargin;

    // If adding popover would go out of the window height, then show it to the top
    if (pageHeightAfterPopOver >= pageHeight) {
      this.node.style.top = `${position.top - popoverHeight - popoverMargin}px`;
      popoverTip.classList.add('bottom');
    } else {
      this.node.style.top = `${position.bottom + popoverMargin}px`;
      popoverTip.classList.add('top');
    }
  }
}
