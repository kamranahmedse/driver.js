## Changelog

v0.9.11:
 * Upgrade style-loader devDependency from 0.23.1 to ^1.0.0
 * Implement option.showButtons to support only showing specific buttons (PR #177) https://github.com/kamranahmedse/driver.js/pull/177
   Buttons will be hidden, but layout will remain the same (i.e. other buttons won't move).
 * Add babel-loader options to webpack.config.prod.js to target >= IE8
 * Add terser-plugin to webpack.config.prod.js

v0.9.10:
 * Fix element not scrolling into view if contained in a scrollable container that is not BODY.
 * driver.js now depends on Element.scrollIntoViewIfNeeded() which users need to provide as polyfill.

v0.9.9:
 * Fix build errors: updated dependencies: sass-loader to ^10.0.0, postcss-loader to ^4.0.0, node-sass to ^6.0.0, @babel/preset-env to ^7.9.0.
 * Fix webpack.config.prod.js postcss-loader options
 *   added babel-loader presets for compatibility with MS WebBrowser control (IE8).

v0.9.8:
 * forked from https://github.com/kamranahmedse/driver.js
