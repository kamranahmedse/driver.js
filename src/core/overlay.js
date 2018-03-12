import Position from './position';

/**
 * Responsible for overlay creation and manipulation i.e.
 * cutting out the visible part, animating between the sections etc
 */
export default class Overlay {
  /**
   * @param {Object} options
   * @param {Window} window
   * @param {Document} document
   */
  constructor(options, window, document) {
    this.options = options;

    this.positionToHighlight = new Position({}); // position at which layover is to be patched at
    this.highlightedPosition = new Position({}); // position at which layover is patched currently
    this.highlightedElement = null;              // currently highlighted dom element (instance of Element)
    this.lastHighlightedElement = null;          // element that was highlighted before current one

    this.draw = this.draw.bind(this);  // To pass the context of class, as it is to be used in redraw animation callback

    this.window = window;
    this.document = document;

    this.resetOverlay();
  }

  /**
   * Prepares the overlay
   */
  resetOverlay() {
    // @todo: append the elements if not there already

    this.pageOverlay = this.document.getElementById('driver-page-overlay');
    this.highlightStage = this.document.getElementById('driver-highlighted-element-stage');
  }

  /**
   * Highlights the dom element on the screen
   * @param {Element} element
   * @param {boolean} animate
   */
  highlight(element, animate = true) {
    if (!element || !element.node) {
      console.warn('Invalid element to highlight. Must be an instance of `Element`');
      return;
    }

    // Trigger the hook for highlight started
    element.onHighlightStarted();

    // Old element has been deselected
    if (this.highlightedElement) {
      this.highlightedElement.onDeselected();
    }

    // get the position of element around which we need to draw
    const position = element.getCalculatedPosition();
    if (!position.canHighlight()) {
      return;
    }

    this.lastHighlightedElement = this.highlightedElement;
    this.highlightedElement = element;
    this.positionToHighlight = position;

    // If animation is not required then set the last path to be same
    // as the current path so that there is no easing towards it
    if (!this.options.animate || !animate) {
      this.highlightedPosition = this.positionToHighlight;
    }

    this.draw();
  }

  /**
   * Returns the currently selected element
   * @returns {null|*}
   */
  getHighlightedElement() {
    return this.highlightedElement;
  }

  /**
   * Gets the element that was highlighted before current element
   * @returns {null|*}
   */
  getLastHighlightedElement() {
    return this.lastHighlightedElement;
  }

  /**
   * Removes the overlay and cancel any listeners
   */
  clear() {
    this.positionToHighlight = new Position();
    if (this.highlightedElement) {
      this.highlightedElement.onDeselected();
    }

    this.highlightedElement = null;
    this.lastHighlightedElement = null;

    this.pageOverlay.style.opacity = '0';
    this.highlightStage.style.display = 'none';
  }

  /**
   * `draw` is called for every frame . Puts back the
   * filled overlay on body (i.e. while removing existing highlight if any) and
   * Slowly eases towards the item to be selected.
   */
  draw() {
    if (!this.highlightedElement || !this.positionToHighlight.canHighlight()) {
      return;
    }

    // Make it two times the padding because, half will be given on left and half on right
    const requiredPadding = this.options.padding * 2;

    // Show the overlay
    this.pageOverlay.style.opacity = `${this.options.opacity}`;

    const width = (this.positionToHighlight.right - this.positionToHighlight.left) + (requiredPadding);
    const height = (this.positionToHighlight.bottom - this.positionToHighlight.top) + (requiredPadding);

    // Show the stage
    this.highlightStage.style.display = 'block';
    this.highlightStage.style.position = 'absolute';
    this.highlightStage.style.width = `${width}px`;
    this.highlightStage.style.height = `${height}px`;
    this.highlightStage.style.top = `${this.positionToHighlight.top - (requiredPadding / 2)}px`;
    this.highlightStage.style.left = `${this.positionToHighlight.left - (requiredPadding / 2)}px`;

    // Element has been highlighted
    this.highlightedElement.onHighlighted();
  }

  /**
   * Refreshes the overlay i.e. sets the size according to current window size
   * And moves the highlight around if necessary
   *
   * @param {boolean} animate
   */
  refresh(animate = true) {
    // If the highlighted element was there Cancel the
    // existing animation frame if any and highlight it again
    // as its position might have been changed
    if (this.highlightedElement) {
      this.highlight(this.highlightedElement, animate);
      this.highlightedElement.onHighlighted();
    }
  }
}
