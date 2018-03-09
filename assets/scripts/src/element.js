import Position from './position';

export default class Element {
  /**
   * DOM element object
   * @param node
   * @param options
   * @param overlay
   * @param window
   * @param document
   */
  constructor(node, options, overlay, window, document) {
    this.node = node;
    this.document = document;
    this.window = window;
    this.options = options;
    this.overlay = overlay;
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

  isInView() {
    let top = this.node.offsetTop;
    let left = this.node.offsetLeft;
    const width = this.node.offsetWidth;
    const height = this.node.offsetHeight;

    let el = this.node;

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top >= this.window.pageYOffset &&
      left >= this.window.pageXOffset &&
      (top + height) <= (this.window.pageYOffset + this.window.innerHeight) &&
      (left + width) <= (this.window.pageXOffset + this.window.innerWidth)
    );
  }

  bringInView() {
    if (this.isInView()) {
      return;
    }

    const elementRect = this.getCalculatedPosition();
    const absoluteElementTop = elementRect.top + this.window.pageYOffset;
    const middle = absoluteElementTop - (this.window.innerHeight / 2);

    this.window.scrollTo(0, middle);
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

    const highlightedElement = this;
    const lastHighlightedElement = this.overlay.getLastHighlightedElement();

    const highlightedNode = this.node;
    const lastHighlightedNode = lastHighlightedElement && lastHighlightedElement.node;

    // If this element is not already highlighted (because this call could
    // be from the resize or scroll) and is not in view
    if (highlightedNode !== lastHighlightedNode && !highlightedElement.isInView()) {
      highlightedElement.bringInView();
    }
  }

  showPopover() {
    this.resetPopover();

    // Position at which the element is
    const position = this.getCalculatedPosition();

    const popoverTip = this.popover.querySelector('.sholo-popover-tip');

    const pageHeight = this.getFullPageSize().height;
    const popoverHeight = this.getPopoverHeight();
    const popoverMargin = this.options.padding + 10;

    this.popover.style.left = `${position.left - this.options.padding}px`;

    // Calculate different dimensions after attaching popover
    const pageHeightAfterPopOver = position.bottom + popoverHeight + popoverMargin;

    // If adding popover would go out of the window height, then show it to the top
    if (pageHeightAfterPopOver >= pageHeight) {
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

  getFullPageSize() {
    // eslint-disable-next-line prefer-destructuring
    const body = this.document.body;
    const html = this.document.documentElement;

    return {
      height: Math.max(body.scrollHeight, body.offsetHeight, html.scrollHeight, html.offsetHeight),
      width: Math.max(body.scrollWidth, body.offsetWidth, html.scrollWidth, html.offsetWidth),
    };
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
