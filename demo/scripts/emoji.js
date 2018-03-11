// Just for the sake of styling page
/* eslint-disable */

/**
 * Determine if this browser supports emoji.
 *
 * Modified from https://gist.github.com/mwunsch/4710561
 * and probobly originally github's javascript source
 */
function doesSupportEmoji() {
  let context;
  if (!document.createElement('canvas').getContext) return;
  context = document.createElement('canvas').getContext('2d');
  if ((typeof context.fillText) !== 'function') {
    return;
  }

  let smile = String.fromCharCode(55357) + String.fromCharCode(56835);

  context.textBaseline = "top";
  context.font = "32px Arial";
  context.fillText(smile, 0, 0);
  return context.getImageData(16, 16, 1, 1).data[0] !== 0;
}

if (!doesSupportEmoji()) {
  twemoji.parse(document.body);
}
