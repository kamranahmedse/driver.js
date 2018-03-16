/**
 * Turn a string into a node
 * @param  {String} htmlString to convert
 * @return {Node}   Converted node element
 */
// eslint-disable-next-line
export const createNodeFromString = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
};
