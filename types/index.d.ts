declare module 'driver.js' {
  class Driver {
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
     * Flag for if the current move was prevented. It is used in
     * onNext() or onPrevious() callbacks to stop the current transition
     */
    private currentMovePrevented: boolean;

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
     * Public getter for steps property
     */
    public getSteps(): Array<Driver.Step>;

    /**
     * Public setter for steps property
     */
    public setSteps(): void;

    /**
     * Does the required bindings for DOM Events
     */
    private bind(): void;

    /**
     * Listener for the click event, to decide if
     * to next/previous step, reset the overlay etc
     * @param {Event} e
     */
    private onClick(e: Event): void;

    /**
     * Refreshes the driver and resets the position for stage
     * and popover on resizing the window
     */
    private onResize(): void;

    /**
     * Makes it operable with keyboard
     * @param {Event} e
     */
    private onKeyUp(e: Event): void;

    /**
     * Handles the internal next event
     */
    private handleNext(): void;

    /**
     * Handles the internal previous event
     */
    private handlePrevious(): void;

    /**
     * Prevents the current move. Useful in `onNext` if you want to
     * perform some asynchronous task and manually move to next step
     */
    public preventMove(): void;

    /**
     * Moves to the previous step if possible
     * otherwise resets the overlay
     */
    public movePrevious(): void;

    /**
     * Moves to the next step if possible
     * otherwise resets the overlay
     */
    public moveNext(): void;

    /**
     * Prevents the current move. Useful in `onNext` if you want to
     * perform some asynchronous task and manually move to next step
     */
    preventMove(): void;

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
    public reset(immediate?: boolean): void;

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
    public defineSteps(steps: Array<Driver.Step>): void;

    /**
     * Prepares {Driver.Element} from the given step definition
     * @param {Driver.Step | string} step query selector or step definition for the step
     * @param {Array<Driver.Step>} allSteps all the given steps
     * @param {number} stepIndex array index for the current step
     */
    private prepareElementFromStep(step: Driver.Step | string, allSteps: Array<Driver.Step>, stepIndex: number): void;

    /**
     * Starts presenting the set steps from the given index
     * @param {number} index
     */
    public start(index?: number): void;

    /**
     * Highlights the given element. Element can be a query selector or a step definition
     * @param {string | Driver.Step} element
     */
    public highlight(element: string | Driver.Step): void;
  }

  namespace Driver {
    interface Step {
      /**
       * Query selector representing the DOM Element
       */
      element: string | HTMLElement | Node;

      /**
       * Color of stage when this step is active
       * @default #ffffff
       */
      stageBackground?: string;

      /**
       * Options representing popover for this step
       */
      popover?: Driver.PopoverOptions;

      /**
       * Is called when the next element is about to be highlighted
       */
      onNext?: (element: Driver.Element) => void;

      /**
       * Is called when the previous element is about to be highlighted
       */
      onPrevious?: (element: Driver.Element) => void;
    }

    class Element {
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
       * Checks if the give element is in view port or not
       * @return {boolean}
       */
      public isInView(): boolean;

      /**
       * Brings the current DOMElement in view
       */
      public bringInView(): void;

      /**
       * Gets the position of element on screen
       * @return {Driver.Position}
       */
      public getCalculatedPosition(): Driver.Position;

      /**
       * Manually scrolls to current element if scrollInToView is not supported
       */
      private scrollManually(): void;

      /**
       * Is called when the current element is deselected
       * @param {boolean} hideStage
       */
      private onDeselected(hideStage?: boolean): void;

      /**
       * Is called when element is about to be highlighted
       */
      private onHighlightStarted(): void;

      /**
       * Is called when element has been successfully highlighted
       */
      private onHighlighted(): void;

      /**
       * Shows the stage on the current element
       */
      private showStage(): void;

      /**
       * Hides the popover from the current element if visible
       */
      private hidePopover(): void;

      /**
       * Shows the popover on current element if possible
       */
      private showPopover(): void;

      /**
       * Gets the full page size
       */
      private getFullPageSize(): Driver.ElementSize;

      /**
       * Checks if the current element is same as passed element
       * @param {Driver.Element} element
       */
      private isSame(element: Driver.Element): void;

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

      /**
       * Gets the popover on current element if any
       * @returns {Driver.Popover}
       */
      public getPopover(): Driver.Popover;

      /**
       * Removes the highlight classes from current element if any
       */
      private removeHighlightClasses(): void;

      /**
       * Adds the highlight classes to current element if required
       */
      private addHighlightClasses(): void;

      /**
       * Walks through the parents of the current element and fixes
       * the stacking context
       */
      private fixStackingContext(): void;

      /**
       * Checks if we can make the current element relative or not
       * @return {boolean}
       */
      private canMakeRelative(): boolean;

      /**
       * Get current element's CSS attribute value
       * @return {string}
       */
      private getStyleProperty(): string;
    }

    class Overlay {
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
      private attachNode(): void;

      /**
       * Highlights the given Element while resetting the existing one
       * @param {Driver.Element} element
       */
      public highlight(element: Driver.Element): void;

      /**
       * Shows the overlay while appending to body if it is not there already
       */
      public show(): void;

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
      public clear(immediate?: boolean): void;

      /**
       * Removes the overlay node if it exists
       */
      private removeNode(): void;

      /**
       * Refreshes the overlay i.e. sets the size according to current window size
       * And moves the highlight around if necessary
       */
      public refresh(): void;
    }

    class Popover {
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
      private attachNode(): void;

      /**
       * Hides the popover if visible
       */
      public hide(): void;

      /**
       * Sets the initial state for popover before changing position
       */
      private setInitialState(): void;

      /**
       * Shows the popover at the given position
       * @param {Driver.Position} position
       */
      public show(position: Driver.Position): void;

      /**
       * Renders the buttons in the footer of the popover
       */
      private renderFooter(): void;

      /**
       * Positions the popover to the left of the given element position
       * @param {Driver.Position} position
       */
      private positionOnLeft(position: Driver.Position): void;

      /**
       * Positions the popover to the left-center of the given element position
       * @param {Driver.Position} position
       */
      private positionOnLeftCenter(position: Driver.Position): void;

      /**
       * Positions the popover to the left-bottom of the given element position
       * @param {Driver.Position} position
       */
      private positionOnLeftBottom(position: Driver.Position): void;

      /**
       * Positions the popover to the right of the given element position
       * @param {Driver.Position} position
       */
      private positionOnRight(position: Driver.Position): void;

      /**
       * Positions the popover to the right-center of the given element position
       * @param {Driver.Position} position
       */
      private positionOnRightCenter(position: Driver.Position): void;

      /**
       * Positions the popover to the right-bottom of the given element position
       * @param {Driver.Position} position
       */
      private positionOnRightBottom(position: Driver.Position): void;

      /**
       * Positions the popover to the top of the given element position
       * @param {Driver.Position} position
       */
      private positionOnTop(position: Driver.Position): void;

      /**
       * Positions the popover to the top-center of the given element position
       * @param {Driver.Position} position
       */
      private positionOnTopCenter(position: Driver.Position): void;

      /**
       * Positions the popover to the top-right of the given element position
       * @param {Driver.Position} position
       */
      private positionOnTopRight(position: Driver.Position): void;

      /**
       * Positions the popover to the bottom of the given element position
       * @param {Driver.Position} position
       */
      private positionOnBottom(position: Driver.Position): void;

      /**
       * Positions the popover to the bottom-center of the given element position
       * @param {Driver.Position} position
       */
      private positionOnBottomCenter(position: Driver.Position): void;

      /**
       * Positions the popover to the bottom-right of the given element position
       * @param {Driver.Position} position
       */
      private positionOnBottomRight(position: Driver.Position): void;

      /**
       * Positions the popover automatically around the element position
       * @param {Driver.Position} position
       */
      private autoPosition(position: Driver.Position): void;

      /**
       * Gets the title node for popover
       * @returns {Node | HTMLElement}
       */
      public getTitleNode(): Node | HTMLElement;

      /**
       * Gets the description node for popover
       * @returns {Node | HTMLElement}
       */
      public getDescriptionNode(): Node | HTMLElement;
    }

    class Stage extends Element {
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
      private attachNode(): void;

      /**
       * Hides the stage by removing the node
       */
      public hide(): void;

      /**
       * Sets the default properties on the node
       */
      private setInitialStyle(): void;

      /**
       * Shows the stage at provided position
       * @param {Driver.Position} position
       */
      public show(position: Driver.Position): void;
    }

    class Position {
      constructor({
                    left,
                    top,
                    bottom,
                    right,
                  });

      /**
       * Checks if the given position is valid and can be highlighted
       * @return {boolean}
       */
      canHighlight(): boolean;

      /**
       * Checks if the given position is same as the passed position
       * @param {Driver.Position} position
       */
      equals(position: Driver.Position): void;
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
      showButtons?: boolean;

      /**
       * Text on the button in the final step
       * @default 'Done'
       */
      doneBtnText?: string;

      /**
       * Text on the close button
       * @default 'Close'
       */
      closeBtnText?: string;

      /**
       * Text on the next button
       * @default 'Next'
       */
      nextBtnText?: string;

      /**
       * Text on the previous button
       * @default 'Previous'
       */
      prevBtnText?: string;

      /**
       * Total number of elements with popovers
       * @default 0
       */
      totalCount?: number;

      /**
       * Additional offset of the popover
       * @default 0
       */
      offset?: number;

      /**
       * Counter for the current popover
       * @default 0
       */
      currentIndex?: number;

      /**
       * If the current popover is the first one
       * @default true
       */
      isFirst?: boolean;

      /**
       * If the current popover is the last one
       * @default true
       */
      isLast?: boolean;

      /**
       * Position for the popover on element
       * @default auto
       */
      position?: string;
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
       * Whether to allow controlling steps through keyboard
       * @default true
       */
      keyboardControl?: boolean,

      /**
       * Clicking outside the highlighted element should move next
       * @default false
       */
      overlayClickNext?: boolean,

      /**
       * Background color for the stage behind the highlighted element
       * @default '#ffffff'
       */
      stageBackground?: string,

      /**
       * Whether to show control buttons or not
       * @default true
       */
      showButtons?: boolean;

      /**
       * Text on the button in the final step
       * @default 'Done'
       */
      doneBtnText?: string;

      /**
       * Text on the close button
       * @default 'Close'
       */
      closeBtnText?: string;

      /**
       * Text on the next button
       * @default 'Next'
       */
      nextBtnText?: string;

      /**
       * Text on the previous button
       * @default 'Previous'
       */
      prevBtnText?: string;

      /**
       * Callback to be called when element is about to be highlighted
       * @param {Driver.Element} element
       * @returns any
       */
      onHighlightStarted?: (element: Driver.Element) => void;

      /**
       * Callback to be called when element has been highlighted
       * @param {Driver.Element} element
       * @returns any
       */
      onHighlighted?: (element: Driver.Element) => void,

      /**
       * Callback to be called when element has been deselected
       * @param {Driver.Element} element
       * @returns any
       */
      onDeselected?: (element: Driver.Element) => void,

      /**
       * Is called when the overlay is about to reset
       */
      onReset?: (element: Driver.Element) => void,

      /**
       * Is called when the next element is about to be highlighted
       */
      onNext?: (element: Driver.Element) => void;

      /**
       * Is called when the previous element is about to be highlighted
       */
      onPrevious?: (element: Driver.Element) => void;
    }

    interface ElementOptions extends Driver.DriverOptions {
    }

    interface StageOptions extends ElementOptions {
    }
  }

  export = Driver;
}
