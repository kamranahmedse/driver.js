import Position from './position';
import { ID_OVERLAY, OVERLAY_HTML } from '../common/constants';
import { createNodeFromString } from '../common/utils';

/**
 * Responsible for overlay creation and manipulation i.e.
 * cutting out the visible part, animating between the sections etc
 */
export default class Overlay {
  /**
   * @param {Object} options
   * @param {Window} window
   * @param {Stage} stage
   * @param {Document} document
   */
  constructor(options, stage, window, document) {
    this.options = options;

    this.positionToHighlight = new Position({}); // position at which layover is to be patched at
    this.highlightedElement = null;              // currently highlighted dom element (instance of Element)
    this.lastHighlightedElement = null;          // element that was highlighted before current one

    this.draw = this.draw.bind(this);  // To pass the context of class, as it is to be used in redraw animation callback

    this.window = window;
    this.document = document;
    this.stage = stage;

    this.makeNode();
  }

  /**
   * Prepares the overlay
   */
  makeNode() {
    let pageOverlay = this.document.getElementById(ID_OVERLAY);
    if (!pageOverlay) {
      pageOverlay = createNodeFromString(OVERLAY_HTML);
      document.body.appendChild(pageOverlay);
    }

    this.node = pageOverlay;
  }

  /**
   * Highlights the dom element on the screen
   * @param {Element} element
   * @param {boolean} animate
   */
  highlight(element) {
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

    this.node.style.opacity = '0';
    this.stage.hide();
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

    // Show the overlay
    this.node.style.opacity = `${this.options.opacity}`;

    // Show the stage
    this.stage.show(this.positionToHighlight);

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
