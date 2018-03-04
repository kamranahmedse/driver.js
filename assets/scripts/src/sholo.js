let overlay;
let overlayContext;

// overlay is going to cover the whole page and then we will
// cut out a chunk for the element to be visible out of it
function createOverlay() {
  overlay = document.createElement('canvas');
  overlayContext = overlay.getContext('2d');

  overlay.style.background = 'transparent';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.zIndex = '999999999';
  overlay.width = window.innerWidth;
  overlay.height = window.innerHeight;

  overlayContext.clearRect(0, 0, overlay.width, overlay.height);
  overlayContext.fillStyle = 'rgba( 0, 0, 0, 0.7)';
  overlayContext.fillRect(0, 0, overlay.width, overlay.height);
}

// Finds the correct position of node on screen
function getNodePosition(node) {
  let x = document.documentElement.offsetLeft;
  let y = document.documentElement.offsetTop;

  if (node.offsetParent) {
    do {
      x += node.offsetLeft;
      y += node.offsetTop;
    } while (node = node.offsetParent);
  }

  return { x, y };
}

// selects the node on the screen
function selectNode(node) {
  if (!node) {
    return;
  }

  // Default to non-existing space
  const currentRegion = {
    left: Number.MAX_VALUE, top: Number.MAX_VALUE, right: 0, bottom: 0,
  };
  const nodePosition = getNodePosition(node);

  // If we have the position and has some height
  if (typeof nodePosition.x === 'number' && typeof nodePosition.y === 'number' && (node.offsetWidth > 0 || node.offsetHeight > 0)) {
    currentRegion.left = Math.min(currentRegion.left, nodePosition.x);
    currentRegion.top = Math.min(currentRegion.top, nodePosition.y);
    currentRegion.right = Math.max(currentRegion.right, nodePosition.x + node.offsetWidth);
    currentRegion.bottom = Math.max(currentRegion.bottom, nodePosition.y + node.offsetHeight);
  }


  const isValidRegion = currentRegion.left < currentRegion.right && currentRegion.top < currentRegion.bottom;
  if (!isValidRegion) {
    return;
  }

  // Cut out the cleared region
  overlayContext.clearRect(
    currentRegion.left - window.scrollX,
    currentRegion.top - window.scrollY,
    (currentRegion.right - currentRegion.left),
    (currentRegion.bottom - currentRegion.top),
  );

  document.body.appendChild(overlay);
}

const nodeToSelect = document.querySelector('.section__header');

createOverlay();
selectNode(nodeToSelect);
