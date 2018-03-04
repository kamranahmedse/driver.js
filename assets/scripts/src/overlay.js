import Position from './position';

/**
 * Responsible for overlay creation and manipulation i.e.
 * cutting out the visible part, animating between the sections etc
 */
export default class Overlay {
  constructor({ alpha = 0.75 }) {
    this.alpha = alpha;
    this.window = window;
    this.selected = new Position({});

    this.prepareContext();
    this.setSize();
  }

  // Prepares the overlay
  prepareContext() {
    const overlay = document.createElement('canvas');

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
  highglight(element) {
    if (!element) {
      // @todo - clearing the overlay
      return;
    }

    // get the position of element around which we need to draw
    const position = element.getPosition();
    if (!position.isValid()) {
      return;
    }

    this.selected = position;
    this.draw();
  }

  draw() {
    this.context.clearRect(0, 0, this.overlay.width, this.overlay.height);
    this.context.fillStyle = `rgba( 0, 0, 0, ${this.alpha})`;
    this.context.fillRect(0, 0, this.overlay.width, this.overlay.height);

    // Cut out the cleared region
    this.context.clearRect(
      this.selected.left - window.scrollX,
      this.selected.top - window.scrollY,
      (this.selected.right - this.selected.left),
      (this.selected.bottom - this.selected.top),
    );

    // Append the overlay if not there already
    if (!this.overlay.parentNode) {
      document.body.appendChild(this.overlay);
    }
  }

  setSize(width = null, height = null) {
    // By default it is going to cover the whole page and then we will
    // cut out a chunk for the element to be visible out of it
    this.overlay.width = width || this.window.innerWidth;
    this.overlay.height = height || this.window.innerHeight;
  }
}
