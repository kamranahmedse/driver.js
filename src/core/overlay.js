import Position from './position';
import { ANIMATION_DURATION_MS, ID_OVERLAY, OVERLAY_HTML } from '../common/constants';
import { createNodeFromString } from '../common/utils';

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
    this.highlightedElement = null;              // currently highlighted dom element (instance of Element)
    this.lastHighlightedElement = null;          // element that was highlighted before current one
    this.hideTimer = null;

    this.window = window;
    this.document = document;
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
    this.node.style.opacity = '0';
  }

  /**
   * Highlights the dom element on the screen
   * @param {Element} element
   */
  highlight(element) {
    if (!element || !element.node) {
      console.warn('Invalid element to highlight. Must be an instance of `Element`');
      return;
    }

    // If highlighted element is not changed from last time
    if (this.highlightedElement && this.highlightedElement.isSame(this.lastHighlightedElement)) {
      return;
    }

    // There might be hide timer from last time
    // which might be getting triggered
    this.window.clearTimeout(this.hideTimer);

    // Trigger the hook for highlight started
    element.onHighlightStarted();

    // Old element has been deselected
    if (this.highlightedElement && !this.highlightedElement.isSame(this.lastHighlightedElement)) {
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

    this.showOverlay();

    // Element has been highlighted
    this.highlightedElement.onHighlighted();
  }

  showOverlay() {
    this.makeNode();

    window.setTimeout(() => {
      this.node.style.opacity = `${this.options.opacity}`;
      this.node.style.position = 'fixed';
      this.node.style.left = '0';
      this.node.style.top = '0';
      this.node.style.bottom = '0';
      this.node.style.right = '0';
    });
  }

  hideOverlay() {
    this.node.style.opacity = '0';

    this.hideTimer = window.setTimeout(() => {
      this.node.style.position = 'absolute';
      this.node.style.left = '';
      this.node.style.top = '';
      this.node.style.bottom = '';
      this.node.style.right = '';

      this.node.parentElement.removeChild(this.node);
    }, ANIMATION_DURATION_MS);
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
      this.highlightedElement.onDeselected(true);
    }

    this.highlightedElement = null;
    this.lastHighlightedElement = null;

    this.hideOverlay();
  }

  /**
   * Refreshes the overlay i.e. sets the size according to current window size
   * And moves the highlight around if necessary
   */
  refresh() {
    // If no highlighted element, cancel the refresh
    if (!this.highlightedElement) {
      return;
    }

    // Reposition the stage and show popover
    this.highlightedElement.showPopover();
    this.highlightedElement.showStage();
  }
}
