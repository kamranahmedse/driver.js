import Position from './position';

export default class Element {
  /**
   * DOM element object
   * @param node
   * @param options
   */
  constructor(node, options) {
    this.node = node;
    this.document = document;
    this.window = window;
    this.options = options;
    this.popover = this.getPopover();
  }

  /**
   * Gets the screen co-ordinates (x,y) for the current dom element
   * @returns {{x: number, y: number}}
   */
  getScreenCoordinates() {
    let tempNode = this.node;

    let x = this.document.documentElement.offsetLeft;
    let y = this.document.documentElement.offsetTop;

    if (tempNode.offsetParent) {
      do {
        x += tempNode.offsetLeft;
        y += tempNode.offsetTop;
      } while (tempNode = tempNode.offsetParent);
    }

    return { x, y };
  }

  /**
   * Gets the calculated position on screen, around which
   * we need to draw
   */
  getCalculatedPosition() {
    const coordinates = this.getScreenCoordinates();
    const position = new Position({
      left: Number.MAX_VALUE,
      top: Number.MAX_VALUE,
      right: 0,
      bottom: 0,
    });

    // If we have the position for this element
    // and the element is visible on screen (has some height)
    if (typeof coordinates.x === 'number' && typeof coordinates.y === 'number' && (this.node.offsetWidth > 0 || this.node.offsetHeight > 0)) {
      position.left = Math.min(position.left, coordinates.x);
      position.top = Math.min(position.top, coordinates.y);
      position.right = Math.max(position.right, coordinates.x + this.node.offsetWidth);
      position.bottom = Math.max(position.bottom, coordinates.y + this.node.offsetHeight);
    }

    return position;
  }

  onDeselected() {
    // Will be called when element is about to be deselected
    this.hidePopover();
  }

  onHighlightStarted() {
    // Will be triggered when the element is about to be highlighted
    // i.e. overlay has started transitioning towards this element
    this.showPopover();
  }

  onHighlighted() {
    this.showPopover();
  }

  showPopover() {
    this.resetPopover();

    // Position at which the element is
    const position = this.getCalculatedPosition();

    const popoverTip = this.popover.querySelector('.sholo-popover-tip');

    const documentHeight = this.getDocumentHeight();
    const popoverHeight = this.getPopoverHeight();
    const popoverMargin = this.options.padding + 10;

    this.popover.style.left = `${position.left - this.options.padding}px`;

    // Calculate different dimensions after attaching popover
    const documentHeightAfterPopOver = position.bottom + popoverHeight + popoverMargin;

    // If adding popover would go out of the window height, then show it to the top
    if (documentHeightAfterPopOver >= documentHeight) {
      this.popover.style.top = `${position.top - popoverHeight - popoverMargin}px`;
      popoverTip.classList.add('bottom');
    } else {
      this.popover.style.top = `${position.bottom + popoverMargin}px`;
      popoverTip.classList.add('top');
    }
  }

  getPopover() {
    // @todo: Create if not there
    const popover = this.document.getElementById('sholo-popover-item');
    popover.style.position = 'absolute';

    return popover;
  }

  hidePopover() {
    this.popover.style.display = 'none';
  }

  getDocumentHeight() {
    // eslint-disable-next-line prefer-destructuring
    const body = this.document.body;
    const html = this.document.documentElement;

    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  }

  getPopoverHeight() {
    return Math.max(this.popover.scrollHeight, this.popover.offsetHeight);
  }

  resetPopover() {
    this.popover.style.display = 'block';
    this.popover.style.left = '';
    this.popover.style.top = '';
    this.popover.style.bottom = '';
    this.popover.style.right = '';

    // Remove the positional classes from tip
    this.popover
      .querySelector('.sholo-popover-tip')
      .className = 'sholo-popover-tip';
  }
}
