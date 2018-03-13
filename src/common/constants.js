export const OVERLAY_OPACITY = 0.75;
export const OVERLAY_PADDING = 10;
export const OVERLAY_ANIMATE = true;
export const OVERLAY_ZINDEX = '999999999';

export const ESC_KEY_CODE = 27;
export const LEFT_KEY_CODE = 37;
export const RIGHT_KEY_CODE = 39;

export const ID_OVERLAY = 'driver-page-overlay';
export const ID_STAGE = 'driver-highlighted-element-stage';
export const ID_POPOVER = 'driver-popover-item';

export const CLASS_POPOVER_TIP = 'driver-popover-tip';
export const CLASS_POPOVER_TITLE = 'driver-popover-title';
export const CLASS_POPOVER_DESCRIPTION = 'driver-popover-description';
export const CLASS_POPOVER_FOOTER = 'driver-popover-footer';
export const CLASS_CLOSE_BTN = 'driver-close-btn';
export const CLASS_NEXT_STEP_BTN = 'driver-next-btn';
export const CLASS_PREV_STEP_BTN = 'driver-prev-btn';
export const CLASS_BTN_DISABLED = 'driver-disabled';

// language=HTML
export const POPOVER_HTML = `
  <div id="${ID_POPOVER}">
    <div class="${CLASS_POPOVER_TIP}"></div>
    <div class="${CLASS_POPOVER_TITLE}">Popover Title</div>
    <div class="${CLASS_POPOVER_DESCRIPTION}">Popover Description</div>
    <div class="${CLASS_POPOVER_FOOTER}">
      <a href="javascript:void(0)" class="${CLASS_CLOSE_BTN}">Close</a>
      <span class="driver-btn-group">
        <a class="${CLASS_PREV_STEP_BTN}" href="javascript:void(0)">&larr; Previous</a>
        <a class="${CLASS_NEXT_STEP_BTN}" href="javascript:void(0)">Next &rarr;</a>
      </span>
    </div>
  </div>`;

export const OVERLAY_HTML = `<div id="${ID_OVERLAY}"></div>`;
export const STAGE_HTML = `<div id="${ID_STAGE}"></div>`;