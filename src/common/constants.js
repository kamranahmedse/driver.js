export const OVERLAY_OPACITY = 0.75;
export const OVERLAY_PADDING = 10;

export const SHOULD_ANIMATE_OVERLAY = true;
export const SHOULD_OUTSIDE_CLICK_CLOSE = true;

export const ESC_KEY_CODE = 27;
export const LEFT_KEY_CODE = 37;
export const RIGHT_KEY_CODE = 39;

export const ID_OVERLAY = 'driver-page-overlay';
export const ID_STAGE = 'driver-highlighted-element-stage';
export const ID_POPOVER = 'driver-popover-item';

export const CLASS_DRIVER_HIGHLIGHTED_ELEMENT = 'driver-highlighted-element';

export const CLASS_NO_ANIMATION = 'sholo-no-animation';
export const CLASS_POPOVER_TIP = 'driver-popover-tip';
export const CLASS_POPOVER_TITLE = 'driver-popover-title';
export const CLASS_POPOVER_DESCRIPTION = 'driver-popover-description';
export const CLASS_POPOVER_FOOTER = 'driver-popover-footer';
export const CLASS_CLOSE_BTN = 'driver-close-btn';
export const CLASS_NEXT_STEP_BTN = 'driver-next-btn';
export const CLASS_PREV_STEP_BTN = 'driver-prev-btn';
export const CLASS_BTN_DISABLED = 'driver-disabled';

// It must match the one set in the animations in CSS file
export const ANIMATION_DURATION_MS = 400;

// language=HTML
export const POPOVER_HTML = `
  <div id="${ID_POPOVER}">
    <div class="${CLASS_POPOVER_TIP}"></div>
    <div class="${CLASS_POPOVER_TITLE}">Popover Title</div>
    <div class="${CLASS_POPOVER_DESCRIPTION}">Popover Description</div>
    <div class="${CLASS_POPOVER_FOOTER}">
      <button class="${CLASS_CLOSE_BTN}">Close</button>
      <span class="driver-btn-group">
        <button class="${CLASS_PREV_STEP_BTN}">&larr; Previous</button>
        <button class="${CLASS_NEXT_STEP_BTN}">Next &rarr;</button>
      </span>
    </div>
  </div>`;

export const OVERLAY_HTML = `<div id="${ID_OVERLAY}"></div>`;
export const STAGE_HTML = `<div id="${ID_STAGE}"></div>`;
