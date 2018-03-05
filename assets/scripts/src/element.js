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

  onHighlighted() {
    console.log('on highlighted');
    console.log(this.getScreenCoordinates());
  }
}
