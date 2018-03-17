import Element from './element';
import {
  CLASS_BTN_DISABLED,
  CLASS_CLOSE_BTN,
  CLASS_NEXT_STEP_BTN,
  CLASS_POPOVER_DESCRIPTION,
  CLASS_POPOVER_FOOTER,
  CLASS_POPOVER_TIP,
  CLASS_POPOVER_TITLE,
  CLASS_PREV_STEP_BTN,
  ID_POPOVER,
  POPOVER_HTML,
} from '../common/constants';
import { createNodeFromString } from '../common/utils';

/**
 * Popover that is displayed on top of the highlighted element
 */
export default class Popover extends Element {
  /**
   * @param {Object} options
   * @param {Window} window
   * @param {Document} document
   */
  constructor(options, window, document) {
    super();

    this.options = Object.assign({
      isFirst: true,
      isLast: true,
      totalCount: 1,
      currentIndex: 0,
      showButtons: true,
      closeBtnText: 'Close',
      doneBtnText: 'Done',
      startBtnText: 'Next &rarr;',
      nextBtnText: 'Next &rarr;',
      prevBtnText: '&larr; Previous',
    }, options);

    this.window = window;
    this.document = document;

    this.makeNode();
    this.hide();
  }

  /**
   * Prepares the dom element for popover
   * @private
   */
  makeNode() {
    let popover = this.document.getElementById(ID_POPOVER);
    if (!popover) {
      popover = createNodeFromString(POPOVER_HTML);
      document.body.appendChild(popover);
    }

    this.node = popover;
    this.tipNode = popover.querySelector(`.${CLASS_POPOVER_TIP}`);
    this.titleNode = popover.querySelector(`.${CLASS_POPOVER_TITLE}`);
    this.descriptionNode = popover.querySelector(`.${CLASS_POPOVER_DESCRIPTION}`);
    this.footerNode = popover.querySelector(`.${CLASS_POPOVER_FOOTER}`);
    this.nextBtnNode = popover.querySelector(`.${CLASS_NEXT_STEP_BTN}`);
    this.prevBtnNode = popover.querySelector(`.${CLASS_PREV_STEP_BTN}`);
    this.closeBtnNode = popover.querySelector(`.${CLASS_CLOSE_BTN}`);
  }

  /**
   * Hides the popover
   * @public
   */
  hide() {
    this.node.style.display = 'none';
  }

  /**
   * Sets the default state for the popover
   * @private
   */
  setInitialState() {
    this.node.style.display = 'block';
    this.node.style.left = '0';
    this.node.style.top = '0';
    this.node.style.bottom = '';
    this.node.style.right = '';

    // Remove the positional classes from tip
    this.node
      .querySelector(`.${CLASS_POPOVER_TIP}`)
      .className = CLASS_POPOVER_TIP;
  }

  /**
   * Shows the popover at the given position
   * @param {Position} position
   * @public
   */
  show(position) {
    this.setInitialState();

    // Set the title and descriptions
    this.titleNode.innerHTML = this.options.title;
    this.descriptionNode.innerHTML = this.options.description;

    this.renderButtons();

    // Position the popover around the given position
    switch (this.options.position) {
      case 'left':
        this.positionOnLeft(position);
        break;
      case 'right':
        this.positionOnRight(position);
        break;
      case 'top':
        this.positionOnTop(position);
        break;
      case 'bottom':
        this.positionOnBottom(position);
        break;
      case 'auto':
      default:
        this.autoPosition(position);
        break;
    }
  }

  /**
   * Enables, disables buttons, sets the text and
   * decides if to show them or not
   * @private
   */
  renderButtons() {
    this.nextBtnNode.innerHTML = this.options.nextBtnText;
    this.prevBtnNode.innerHTML = this.options.prevBtnText;
    this.closeBtnNode.innerHTML = this.options.closeBtnText;

    // If there was only one item, hide the buttons
    if (!this.options.showButtons || !this.options.totalCount || this.options.totalCount === 1) {
      this.footerNode.style.display = 'none';
      return;
    }

    this.footerNode.style.display = 'block';
    if (this.options.isFirst) {
      this.prevBtnNode.classList.add(CLASS_BTN_DISABLED);
      this.nextBtnNode.innerHTML = this.options.startBtnText;
    } else {
      this.prevBtnNode.classList.remove(CLASS_BTN_DISABLED);
    }

    if (this.options.isLast) {
      this.nextBtnNode.innerHTML = this.options.doneBtnText;
    } else {
      this.nextBtnNode.innerHTML = this.options.nextBtnText;
    }
  }

  /**
   * Shows the popover on the left of the given position
   * @param {Position} elementPosition
   * @private
   */
  positionOnLeft(elementPosition) {
    const popoverWidth = this.getSize().width;
    const popoverMargin = this.options.padding + 10;  // adding 10 to give it a little distance from the element

    this.node.style.left = `${elementPosition.left - popoverWidth - popoverMargin}px`;
    this.node.style.top = `${elementPosition.top - this.options.padding}px`;
    this.node.style.right = '';
    this.node.style.bottom = '';

    this.tipNode.classList.add('right');
  }

  /**
   * Shows the popover on the right of the given position
   * @param {Position} elementPosition
   * @private
   */
  positionOnRight(elementPosition) {
    const popoverMargin = this.options.padding + 10;  // adding 10 to give it a little distance from the element

    this.node.style.left = `${elementPosition.right + popoverMargin}px`;
    this.node.style.top = `${elementPosition.top - this.options.padding}px`;
    this.node.style.right = '';
    this.node.style.bottom = '';

    this.tipNode.classList.add('left');
  }

  /**
   * Shows the popover on the top of the given position
   * @param {Position} elementPosition
   * @private
   */
  positionOnTop(elementPosition) {
    const popoverHeight = this.getSize().height;
    const popoverMargin = this.options.padding + 10;  // adding 10 to give it a little distance from the element

    this.node.style.top = `${elementPosition.top - popoverHeight - popoverMargin}px`;
    this.node.style.left = `${elementPosition.left - this.options.padding}px`;
    this.node.style.right = '';
    this.node.style.bottom = '';

    this.tipNode.classList.add('bottom');
  }

  /**
   * Shows the popover on the bottom of the given position
   * @param {Position} elementPosition
   * @private
   */
  positionOnBottom(elementPosition) {
    const popoverMargin = this.options.padding + 10;  // adding 10 to give it a little distance from the element

    this.node.style.top = `${elementPosition.bottom + popoverMargin}px`;
    this.node.style.left = `${elementPosition.left - this.options.padding}px`;
    this.node.style.right = '';
    this.node.style.bottom = '';

    this.tipNode.classList.add('top');
  }

  /**
   * Automatically positions the popover around the given position
   * such that the element and popover remain in view
   * @todo add the left and right positioning decisions
   * @param {Position} elementPosition
   * @private
   */
  autoPosition(elementPosition) {
    const pageSize = this.getFullPageSize();
    const popoverSize = this.getSize();

    const pageHeight = pageSize.height;
    const popoverHeight = popoverSize.height;
    const popoverMargin = this.options.padding + 10;  // adding 10 to give it a little distance from the element

    const pageHeightAfterPopOver = elementPosition.bottom + popoverHeight + popoverMargin;

    // If adding popover would go out of the window height, then show it to the top
    if (pageHeightAfterPopOver >= pageHeight) {
      this.positionOnTop(elementPosition);
    } else {
      this.positionOnBottom(elementPosition);
    }
  }
}
