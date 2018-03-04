/**
 * Responsible for validating positions and is used
 * when manipulating positions across the application
 */
export default class Position {
  /**
   * @param left number
   * @param top number
   * @param right number
   * @param bottom number
   */
  constructor({
    left = 0,
    top = 0,
    right = 0,
    bottom = 0,
  } = {}) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }

  /**
   * Checks if the position is valid to be highlighted
   * @returns {boolean}
   */
  canHighlight() {
    return this.left < this.right && this.top < this.bottom;
  }

  /**
   * Checks if the given position is equal to the passed position
   * @param position Position
   * @returns {boolean}
   */
  equals(position) {
    return this.left.toFixed(3) === position.left.toFixed(3) &&
      this.right.toFixed(3) === position.right.toFixed(3) &&
      this.top.toFixed(3) === position.top.toFixed(3) &&
      this.bottom.toFixed(3) === position.bottom.toFixed(3);
  }
}
