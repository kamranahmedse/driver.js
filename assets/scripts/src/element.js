import Position from './position';

export default class Element {
  constructor(node) {
    this.element = node;
    this.document = document;
  }

  // Gets the screen co-ordinates for the current dom element
  getScreenCoordinates() {
    let tempNode = this.element;

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

  // Gets the calculated position on screen
  getPosition() {
    const coordinates = this.getScreenCoordinates();
    const position = new Position({
      left: Number.MAX_VALUE,
      top: Number.MAX_VALUE,
      right: 0,
      bottom: 0,
    });

    // If we have the position for this element
    // and the element is visible on screen (has some height)
    if (typeof coordinates.x === 'number' && typeof coordinates.y === 'number' && (this.element.offsetWidth > 0 || this.element.offsetHeight > 0)) {
      position.left = Math.min(position.left, coordinates.x);
      position.top = Math.min(position.top, coordinates.y);
      position.right = Math.max(position.right, coordinates.x + this.element.offsetWidth);
      position.bottom = Math.max(position.bottom, coordinates.y + this.element.offsetHeight);
    }

    return position;
  }
}
