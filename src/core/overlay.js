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

    this.highlightedElement = null;              // currently highlighted dom element (instance of Element)
    this.lastHighlightedElement = null;          // element that was highlighted before current one
    this.hideTimer = null;

    this.window = window;
    this.document = document;

    this.removeNode = this.removeNode.bind(this);
  }

  /**
   * Prepares the overlay
   * @private
   */
  attachNode() {
    let pageOverlay = this.document.getElementById(ID_OVERLAY);
    if (!pageOverlay) {
      pageOverlay = createNodeFromString(OVERLAY_HTML);
      document.body.appendChild(pageOverlay);
    }

    this.node = pageOverlay;
    this.node.style.opacity = '0';

    if (!this.options.animate) {
      // For non-animation cases remove the overlay because we achieve this overlay by having
      // a higher box-shadow on the stage. Why are we doing it that way? Because the stage that
      // is shown "behind" the highlighted element to make it pop out of the screen, it introduces
      // some stacking contexts issues. To avoid those issues we just make the stage background
      // transparent and achieve the overlay using the shadow so to make the element below it visible
      // through the stage even if there are stacking issues.
      if (this.node.parentElement) {
        this.node.parentElement.removeChild(this.node);
      }
    }
  }

  /**
   * Highlights the dom element on the screen
   * @param {Element} element
   * @public
   */
  highlight(element) {
    if (!element || !element.node) {
      console.warn('Invalid element to highlight. Must be an instance of `Element`');
      return;
    }

    // If highlighted element is not changed from last time
    if (element.isSame(this.highlightedElement)) {
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

    this.show();

    // Element has been highlighted
    this.highlightedElement.onHighlighted();
  }

  /**
   * Shows the overlay on whole screen
   * @public
   */
  show() {
    if (this.node && this.node.parentElement) {
      return;
    }

    this.attachNode();

    window.setTimeout(() => {
      this.node.style.opacity = `${this.options.opacity}`;
      this.node.style.position = 'fixed';
      this.node.style.left = '0';
      this.node.style.top = '0';
      this.node.style.bottom = '0';
      this.node.style.right = '0';
    });
  }

  /**
   * Returns the currently selected element
   * @returns {null|*}
   * @public
   */
  getHighlightedElement() {
    return this.highlightedElement;
  }

  /**
   * Gets the element that was highlighted before current element
   * @returns {null|*}
   * @public
   */
  getLastHighlightedElement() {
    return this.lastHighlightedElement;
  }

  /**
   * Removes the overlay and cancel any listeners
   * @public
   */
  clear(immediate = false) {
    // Callback for when overlay is about to be reset
    if (this.options.onReset) {
      this.options.onReset(this.highlightedElement);
    }

    // Deselect the highlighted element if any
    if (this.highlightedElement) {
      const hideStage = true;
      this.highlightedElement.onDeselected(hideStage);
    }

    this.highlightedElement = null;
    this.lastHighlightedElement = null;

    if (!this.node) {
      return;
    }

    // Clear any existing timers and remove node
    this.window.clearTimeout(this.hideTimer);

    if (this.options.animate && !immediate) {
      this.node.style.opacity = '0';
      this.hideTimer = this.window.setTimeout(this.removeNode, ANIMATION_DURATION_MS);
    } else {
      this.removeNode();
    }
  }

  /**
   * Removes the overlay node if it exists
   * @private
   */
  removeNode() {
    if (this.node && this.node.parentElement) {
      this.node.parentElement.removeChild(this.node);
    }
  }

  /**
   * Refreshes the overlay i.e. sets the size according to current window size
   * And moves the highlight around if necessary
   * @public
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
