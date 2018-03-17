declare module 'driver.js' {
  export class Driver {
    /**
     * Refers to the global document object
     */
    private document: Document;

    /**
     * Refers to the global window object
     */
    private window: Window;

    /**
     * If the driver is active or not
     */
    public isActivated: boolean;

    /**
     * Refers to the array of steps to be presented if any
     */
    private steps: Array<Driver.Step>;

    /**
     * Refers to step index that is currently active
     */
    private currentStep: number;

    /**
     * Refers to the overlay for the screen
     */
    private overlay: Driver.Overlay;

    /**
     * @param {DriverOptions} options
     */
    public constructor(options?: Driver.DriverOptions);

    /**
     * Does the required bindings for DOM Events
     */
    private bind();

    /**
     * Listener for the click event, to decide if
     * to next/previous step, reset the overlay etc
     * @param {Event} e
     */
    private onClick(e: Event);

    /**
     * Refreshes the driver and resets the position for stage
     * and popover on resizing the window
     */
    private onResize();

    /**
     * Makes it operable with keyboard
     * @param {Event} e
     */
    private onKeyUp(e: Event);

    /**
     * Moves to the previous step if possible
     * otherwise resets the overlay
     */
    public movePrevious();

    /**
     * Moves to the next step if possible
     * otherwise resets the overlay
     */
    public moveNext();

    /**
     * Checks if can be moved to next step
     * @return {boolean}
     */
    public hasNextStep(): boolean;

    /**
     * Checks if can be moved to previous step
     * @return {boolean}
     */
    public hasPreviousStep(): boolean;

    /**
     * Resets the steps and clears the overlay
     */
    public reset();

    /**
     * Checks if there is any highlighted element or not
     * @return {boolean}
     */
    public hasHighlightedElement(): boolean;

    /**
     * Gets the currently highlighted element if any
     * @return {Driver.Element}
     */
    public getHighlightedElement(): Driver.Element | null;

    /**
     * Gets the last highlighted element if any
     * @return {Driver.Element}
     */
    public getLastHighlightedElement(): Driver.Element | null;

    /**
     * Defines the steps to be used in multi-step driver
     * @param {Array<Driver.Step>} steps
     */
    public defineSteps(steps: Array<Driver.Step>);

    /**
     * Prepares {Driver.Element} from the given step definition
     * @param {Driver.Step | string} step query selector or step definition for the step
     * @param {Array<Driver.Step>} allSteps all the given steps
     * @param {number} stepIndex array index for the current step
     */
    private prepareElementFromStep(step: Driver.Step | string, allSteps: Array<Driver.Step>, stepIndex: number);

    /**
     * Starts presenting the set steps from the given index
     * @param {number} index
     */
    public start(index?: number);

    /**
     * Highlights the given element. Element can be a query selector or a step definition
     * @param {string | Driver.Step} element
     */
    public highlight(element: string | Driver.Step);
  }

  namespace Driver {
    export interface Step {
      /**
       * Query selector representing the DOM Element
       */
      element: string;

      /**
       * Color of stage when this step is active
       * @default #ffffff
       */
      stageBackground?: string;

      /**
       * Options representing popover for this step
       */
      popover: Driver.PopoverOptions;
    }

    export class Element {
      /**
       * Refers to the DOM element that this class wraps
       */
      private node: Node | HTMLElement;
      /**
       * Refers to the global Document object
       */
      private document: Document;
      /**
       * Refers to the global window object
       */
      private window: Window;
      /**
       * Options for this element
       */
      private options: Driver.ElementOptions;
      /**
       * Refers to the overlay that wraps the body
       */
      private overlay: Driver.Overlay;
      /**
       * Refers to the Popover object to be displayed against this element
       */
      private popover: Driver.Popover;
      /**
       * Refers to the stage that will be displayed behind this element
       */
      private stage: Driver.Stage;

      /**
       * @param {HTMLElement | Node} node
       * @param {Driver.DriverOptions} options
       * @param {Driver.Popover} popover
       * @param {Driver.Stage} stage
       * @param {Driver.Overlay} overlay
       * @param {Window} window
       * @param {Document} document
       */
      constructor(node: HTMLElement | Node,
                  options: Driver.DriverOptions,
                  popover: Driver.Popover,
                  stage: Driver.Stage,
                  overlay: Driver.Overlay,
                  window: Window,
                  document: Document);

      /**
       * Gets the screen coordinates for the current DOM Element
       * @return {Driver.ScreenCoordinates}
       */
      public getScreenCoordinates(): Driver.ScreenCoordinates;

      /**
       * Checks if the give element is in view port or not
       * @return {boolean}
       */
      public isInView(): boolean;

      /**
       * Brings the current DOMElement in view
       */
      public bringInView();

      /**
       * Gets the position of element on screen
       * @return {Driver.Position}
       */
      public getCalculatedPosition(): Driver.Position;

      /**
       * Manually scrolls to current element if scrollInToView is not supported
       */
      private scrollManually();

      /**
       * Is called when the current element is deselected
       * @param {boolean} hideStage
       */
      private onDeselected(hideStage?: boolean = false);

      /**
       * Is called when element is about to be highlighted
       */
      private onHighlightStarted();

      /**
       * Is called when element has been successfully highlighted
       */
      private onHighlighted();

      /**
       * Shows the stage on the current element
       */
      private showStage();

      /**
       * Hides the popover from the current element if visible
       */
      private hidePopover();

      /**
       * Shows the popover on current element if possible
       */
      private showPopover();

      /**
       * Gets the full page size
       */
      private getFullPageSize(): Driver.ElementSize;

      /**
       * Checks if the current element is same as passed element
       * @param {Driver.Element} element
       */
      private isSame(element: Driver.Element);

      /**
       * Gets the node that this element refers to
       * @return {Node | HTMLElement}
       */
      public getNode(): Node | HTMLElement;

      /**
       * Gets the size of current element
       * @return {Driver.ElementSize}
       */
      public getSize(): Driver.ElementSize;
    }

    export class Overlay {
      /**
       * Options to modify the overlay behavior
       */
      private options: Driver.DriverOptions;

      /**
       * Refers to currently highlighted element
       */
      private highlightedElement: Driver.Element | null;

      /**
       * Refers to element highlighted before currently highlighted element
       */
      private lastHighlightedElement: Driver.Element | null;

      /**
       * Refers to timeout handler used to animate while resetting
       */
      private hideTimer: number | null;

      /**
       * Refers to global object Window
       */
      private window: Window;

      /**
       * Refers to global object Document
       */
      private document: Document;

      /**
       * Prepares the DOM element for overlay and appends to body
       */
      private makeNode();

      /**
       * Highlights the given Element while resetting the existing one
       * @param {Driver.Element} element
       */
      public highlight(element: Driver.Element);

      /**
       * Shows the overlay while appending to body if it is not there already
       */
      public show();

      /**
       * Gets the highlighted element in overlay if any
       * @return {Driver.Element | null}
       */
      public getHighlightedElement(): Driver.Element | null;

      /**
       * Gets the element highlighted before current element if any
       * @return {Driver.Element | null}
       */
      public getLastHighlightedElement(): Driver.Element | null;

      /**
       * Removes the overlay and deselects the highlighted element. Does that with animation
       * by default or without animation if immediate is set to false
       * @param {boolean} immediate
       */
      public clear(immediate: boolean = false);

      /**
       * Removes the overlay node if it exists
       */
      private removeNode();

      /**
       * Refreshes the overlay i.e. sets the size according to current window size
       * And moves the highlight around if necessary
       */
      public refresh();
    }

    export class Popover {
      private node: Node | HTMLElement;
      private tipNode: Node | HTMLElement;
      private titleNode: Node | HTMLElement;
      private descriptionNode: Node | HTMLElement;
      private footerNode: Node | HTMLElement;
      private nextBtnNode: Node | HTMLElement;
      private prevBtnNode: Node | HTMLElement;
      private closeBtnNode: Node | HTMLElement;
      private window: Window;
      private document: Document;

      /**
       * @param {Driver.PopoverOptions} options
       * @param {Window} window
       * @param {Document} document
       */
      constructor(options: Driver.PopoverOptions,
                  window: Window,
                  document: Document);

      /**
       * Prepares the DOM element for popover and appends to the body
       */
      private makeNode();

      /**
       * Hides the popover if visible
       */
      public hide();

      /**
       * Sets the initial state for popover before changing position
       */
      private setInitialState();

      /**
       * Shows the popover at the given position
       * @param {Driver.Position} position
       */
      public show(position: Driver.Position);

      /**
       * Renders the buttons in the footer of the popover
       */
      private renderButtons();

      /**
       * Positions the popover to the left of the given element position
       * @param {Driver.Position} position
       */
      private positionOnLeft(position: Driver.Position);

      /**
       * Positions the popover to the right of the given element position
       * @param {Driver.Position} position
       */
      private positionOnRight(position: Driver.Position);

      /**
       * Positions the popover to the top of the given element position
       * @param {Driver.Position} position
       */
      private positionOnTop(position: Driver.Position);

      /**
       * Positions the popover to the bottom of the given element position
       * @param {Driver.Position} position
       */
      private positionOnBottom(position: Driver.Position);

      /**
       * Positions the popover automatically around the element position
       * @param {Driver.Position} position
       */
      private autoPosition(position: Driver.Position);
    }

    export class Stage extends Element {
      private options: Driver.StageOptions;
      private window: Window;
      private document: Document;

      /**
       * @param {Driver.StageOptions} options
       * @param {Window} window
       * @param {Document} document
       */
      constructor(options: Driver.StageOptions,
                  window: Window,
                  document: Document);

      /**
       * Prepares the node and appends to body if not there already
       */
      private makeNode();

      /**
       * Hides the stage by removing the node
       */
      public hide();

      /**
       * Sets the default properties on the node
       */
      private setInitialStyle();

      /**
       * Shows the stage at provided position
       * @param {Driver.Position} position
       */
      public show(position: Driver.Position);
    }

    export class Position {
      top: number;
      left: number;
      right: number;
      bottom: number;

      constructor({
                    left: number = 0,
                    top: number = 0,
                    bottom: number = 0,
                    right: number = 0,
                  } = {});

      /**
       * Checks if the given position is valid and can be highlighted
       * @return {boolean}
       */
      canHighlight(): boolean;

      /**
       * Checks if the given position is same as the passed position
       * @param {Driver.Position} position
       */
      equals(position: Driver.Position);
    }

    interface ScreenCoordinates {
      x: number;
      y: number;
    }

    interface ElementSize {
      width: number;
      height: number;
    }

    interface PopoverOptions {
      /**
       * Title for the popover
       */
      title?: string;

      /**
       * Description for the popover
       */
      description: string;

      /**
       * Whether to show control buttons or not
       * @default true
       */
      showButtons: boolean;

      /**
       * Text on the button in the final step
       * @default 'Done'
       */
      doneBtnText: string;

      /**
       * Text on the close button
       * @default 'Close'
       */
      closeBtnText: string;

      /**
       * Text on the next button
       * @default 'Next'
       */
      nextBtnText: string;

      /**
       * Text on the previous button
       * @default 'Previous'
       */
      prevBtnText: string;
    }

    interface DriverOptions {
      /**
       * Whether to animate while transitioning from one highlighted
       * element to another
       * @default true
       */
      animate?: boolean;

      /**
       * Opacity for the overlay
       * @default 0.75
       */
      opacity?: number,

      /**
       * Distance of elements corner from the edges of the overlay
       * @default 10
       */
      padding?: number,

      /**
       * Options to be passed to scrollIntoView if supported by browser
       * @default { behavior: 'instant', block: 'center' }
       */
      scrollIntoViewOptions?: ScrollIntoViewOptions,

      /**
       * Clicking outside the highlighted element should reset driver or not
       * @default true
       */
      allowClose?: boolean,

      /**
       * Background color for the stage behind the highlighted element
       * @default '#ffffff'
       */
      stageBackground?: string,

      /**
       * Whether to show control buttons or not
       * @default true
       */
      showButtons: boolean;

      /**
       * Text on the button in the final step
       * @default 'Done'
       */
      doneBtnText: string;

      /**
       * Text on the close button
       * @default 'Close'
       */
      closeBtnText: string;

      /**
       * Text on the next button
       * @default 'Next'
       */
      nextBtnText: string;

      /**
       * Text on the previous button
       * @default 'Previous'
       */
      prevBtnText: string;

      /**
       * Callback to be called when element is about to be highlighted
       * @param {Driver.Element} element
       * @returns any
       */
      onHighlightStarted: (element: Driver.Element) => void;

      /**
       * Callback to be called when element has been highlighted
       * @param {Driver.Element} element
       * @returns any
       */
      onHighlighted: (element: Driver.Element) => void,

      /**
       * Callback to be called when element has been deselected
       * @param {Driver.Element} element
       * @returns any
       */
      onDeselected: (element: Driver.Element) => void,
    }

    interface ElementOptions extends Driver.DriverOptions {
    }

    interface StageOptions extends ElementOptions {
    }
  }
}