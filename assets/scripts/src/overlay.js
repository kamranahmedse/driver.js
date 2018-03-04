import Position from './position';

/**
 * Responsible for overlay creation and manipulation i.e.
 * cutting out the visible part, animating between the sections etc
 */
export default class Overlay {
  constructor({
    opacity = 0.75,
    padding = 10,
    animate = true,
  }) {
    this.opacity = opacity; // Fixed opacity for the layover
    this.padding = padding; // Padding around the highlighted item
    this.animate = animate; // Should animate between the transitions

    this.overlayAlpha = 0;                       // Is used to animate the layover
    this.positionToHighlight = new Position({}); // position at which layover is to be patched at
    this.highlightedPosition = new Position({}); // position at which layover is patched currently
    this.redrawAnimation = null;                 // used to cancel the redraw animation
    this.highlightedElement = null;              // currently highlighted dom element (instance of Element)

    this.draw = this.draw.bind(this);  // To pass the context of class, as it is to be used in redraw animation callback

    this.window = window;
    this.document = document;

    this.prepareContext();
    this.setSize();
  }

  // Prepares the overlay
  prepareContext() {
    const overlay = this.document.createElement('canvas');

    this.overlay = overlay;
    this.context = overlay.getContext('2d');

    this.overlay.style.pointerEvents = 'none';
    this.overlay.style.background = 'transparent';
    this.overlay.style.position = 'fixed';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.zIndex = '999999999';
  }

  // Highlights the dom element on the screen
  highlight(element, animate = true) {
    if (!element) {
      return;
    }

    // get the position of element around which we need to draw
    const position = element.getPosition();
    if (!position.canHighlight()) {
      return;
    }

    this.highlightedElement = element;
    this.positionToHighlight = position;

    // If animation is not required then set the last path to be same
    // as the current path so that there is no easing towards it
    if (!this.animate || !animate) {
      this.highlightedPosition = this.positionToHighlight;
    }

    this.draw();
  }

  clear() {
    this.positionToHighlight = new Position();
    this.highlightedElement = null;

    // If animation is not required, cancel the immediately remove the canvas
    // This will stop the animation from the animation frames above
    if (!this.animate) {
      this.window.cancelAnimationFrame(this.redrawAnimation);
      this.document.body.removeChild(this.overlay);
    }
  }

  /**
   * `draw` is called for in requestAnimationFrame. Here is what it does
   * - Puts back the filled overlay on body (i.e. while clearing existing highlight if any)
   * - Slowly eases towards the item to be selected
   */
  draw() {
    // Cache the response of this for re-use below
    const canHighlight = this.positionToHighlight.canHighlight();

    // Remove the existing cloak from the body
    // it might be torn i.e. have patches from last highlight
    this.removeCloak();
    // Add the overlay on top of the whole body
    this.addCloak();

    if (canHighlight) {
      const isFadingIn = this.overlayAlpha < 0.1;

      if (isFadingIn) {
        // Ignore the animation, just highlight the item
        this.highlightedPosition = this.positionToHighlight;
      } else {
        // Slowly move towards the position to highlight
        this.highlightedPosition.left += (this.positionToHighlight.left - this.highlightedPosition.left) * 0.18;
        this.highlightedPosition.top += (this.positionToHighlight.top - this.highlightedPosition.top) * 0.18;
        this.highlightedPosition.right += (this.positionToHighlight.right - this.highlightedPosition.right) * 0.18;
        this.highlightedPosition.bottom += (this.positionToHighlight.bottom - this.highlightedPosition.bottom) * 0.18;
      }
    }

    // Remove the cloak from the position to highlight
    this.removeCloak({
      posX: this.highlightedPosition.left - window.scrollX - this.padding,
      posY: this.highlightedPosition.top - window.scrollY - this.padding,
      width: (this.highlightedPosition.right - this.highlightedPosition.left) + (this.padding * 2),
      height: (this.highlightedPosition.bottom - this.highlightedPosition.top) + (this.padding * 2),
    });

    if (canHighlight) {
      // Fade the overlay in if we can highlight
      if (!this.animate) {
        this.overlayAlpha = this.opacity;
      } else {
        this.overlayAlpha += (this.opacity - this.overlayAlpha) * 0.08;
      }
    } else {
      // otherwise fade out
      this.overlayAlpha = Math.max((this.overlayAlpha * 0.85) - 0.02, 0);
    }

    // cancel any existing animation frames
    // to avoid the overlapping of frames
    this.window.cancelAnimationFrame(this.redrawAnimation);

    // Continue drawing while we can highlight or we are still fading out
    if (canHighlight || this.overlayAlpha > 0) {
      // Add the overlay if not already there
      if (!this.overlay.parentNode) {
        document.body.appendChild(this.overlay);
      }

      // Stage a new animation frame only if the position has not been reached
      // of the alpha has not yet fully reached fully required opacity
      if (
        !this.positionToHighlight.equals(this.highlightedPosition) ||
        this.overlayAlpha.toFixed(2) !== this.opacity.toFixed(2)
      ) {
        this.redrawAnimation = this.window.requestAnimationFrame(this.draw);
      }
    } else {
      this.document.body.removeChild(this.overlay);
    }
  }

  // Removes the patch of given width and height from the given position (x,y)
  removeCloak({
    posX = 0,
    posY = 0,
    width = this.overlay.width,
    height = this.overlay.height,
  } = {}) {
    this.context.clearRect(posX, posY, width, height);
  }

  // Adds the cloak i.e. covers the given position with dark overlay
  addCloak({
    posX = 0,
    posY = 0,
    width = this.overlay.width,
    height = this.overlay.height,
  } = {}) {
    this.context.fillStyle = `rgba( 0, 0, 0, ${this.overlayAlpha} )`;
    this.context.fillRect(posX, posY, width, height);
  }

  setSize(width = null, height = null) {
    // By default it is going to cover the whole page and then we will
    // cut out a chunk for the element to be visible out of it
    this.overlay.width = width || this.window.innerWidth;
    this.overlay.height = height || this.window.innerHeight;
  }

  // Refreshes the overlay i.e. sets the size according to current window size
  // And moves the highlight around if necessary
  refresh(animate = true) {
    this.setSize();

    // If the highlighted element was there Cancel the
    // existing animation frame if any and highlight it again
    // as its position might have been changed
    if (this.highlightedElement) {
      this.window.cancelAnimationFrame(this.redrawAnimation);
      this.highlight(this.highlightedElement, animate);
    }
  }
}
