/**
 * Responsible for validating positions and is used
 * when manipulating positions across the application
 */
export default class Position {
  /**
   * @param {number} left
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
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
   * @public
   */
  canHighlight() {
    return this.left < this.right && this.top < this.bottom;
  }

  /**
   * Checks if the given position is equal to the passed position
   * @param position Position
   * @returns {boolean}
   * @public
   */
  equals(position) {
    return Math.round(this.left) === Math.round(position.left) &&
      Math.round(this.right) === Math.round(position.right) &&
      Math.round(this.top) === Math.round(position.top) &&
      Math.round(this.bottom) === Math.round(position.bottom);
  }
}
