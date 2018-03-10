export const OVERLAY_OPACITY = 0.75;
export const OVERLAY_PADDING = 10;
export const OVERLAY_ANIMATE = true;
export const OVERLAY_ZINDEX = '999999999';

export const ESC_KEY_CODE = 27;

export const ID_OVERLAY = 'sholo-canvas-overlay';

export const ID_POPOVER = 'sholo-popover-item';
export const CLASS_POPOVER_TIP = 'sholo-popover-tip';
export const CLASS_POPOVER_TITLE = 'sholo-popover-title';
export const CLASS_POPOVER_DESCRIPTION = 'sholo-popover-description';
export const CLASS_POPOVER_FOOTER = 'sholo-popover-footer';
export const CLASS_CLOSE_BTN = 'sholo-close-btn';
export const CLASS_NEXT_STEP_BTN = 'sholo-next-btn';
export const CLASS_PREV_STEP_BTN = 'sholo-prev-btn';

// language=HTML
export const POPOVER_HTML = `
  <div id="${ID_POPOVER}">
    <div class="${CLASS_POPOVER_TIP}"></div>
    <div class="${CLASS_POPOVER_TITLE}">Popover Title</div>
    <div class="${CLASS_POPOVER_DESCRIPTION}">Popover Description</div>
    <div class="${CLASS_POPOVER_FOOTER}">
      <a href="javascript:void(0)" class="${CLASS_CLOSE_BTN}">Close</a>
      <span class="sholo-btn-group">
        <a class="${CLASS_PREV_STEP_BTN}" href="javascript:void(0)">&larr; Previous</a>
        <a class="${CLASS_NEXT_STEP_BTN}" href="javascript:void(0)">Next &rarr;</a>
      </span>
    </div>
  </div>`;
