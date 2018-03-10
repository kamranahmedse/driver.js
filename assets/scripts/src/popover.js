import Element from './element';
import { CLASS_POPOVER_TIP, ID_POPOVER } from './constants';

/**
 * Popover that is displayed on top of the highlighted element
 */
export default class Popover extends Element {
  constructor(options = {
    padding: 10,
  }, window, document) {
    super();

    this.options = options;
    this.window = window;
    this.document = document;

    this.node = this.getPopover();
  }

  getPopover() {
    // @todo: Create if not there
    const popover = this.document.getElementById(ID_POPOVER);
    popover.style.position = 'absolute';

    return popover;
  }

  getHeight() {
    return Math.max(this.node.scrollHeight, this.node.offsetHeight);
  }

  hide() {
    this.node.style.display = 'none';
  }

  reset() {
    this.node.style.display = 'block';
    this.node.style.left = '';
    this.node.style.top = '';
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

    const pageHeight = this.getFullPageSize().height;
    const popoverHeight = this.getHeight();
    const popoverMargin = this.options.padding + 10;

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
