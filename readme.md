<h1 align="center"><img src="./demo/images/driver.png" /><br> Driver.js</h1>

<p align="center">
  <a href="https://creativecommons.org/licenses/by/4.0/">
    <img src="https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/contributions-welcome-green.svg" />
  </a>
  <a href="http://twitter.com/kamranahmedse">
    <img src="https://img.shields.io/badge/author-kamranahmedse-blue.svg" />
  </a>
</p>

<p align="center">
  <b>Powerful yet light-weight, vanilla JavaScript engine to drive the user's focus across the page</b></br>
  <sub>Only ~4kb, no external dependency, supports all major browsers and highly customizable <sub>
</p>

<br />

* **Simple**: is simple to use and has no external dependency at all
* **Light-weight**: ~4kb in size, vanilla JavaScript and no external dependency
* **Highly customizable**: has a powerful API and can be used however you want
* **Highlight anything**: highlight any (literally any) element on page
* **Feature introductions**: create powerful feature introductions and onboarding strategies
* **Focus shifters**: add focus shifters for users
* **User friendly**: Everything is controllable by keyboard
* **Consistent behavior**: usable across all browsers (including in-famous IE)
* **MIT Licensed**: free for personal and commercial use

![](./demo/images/split.png)

For Usage and Examples, [have a look at demo](http://kamranahmed.info/driver)

## Installation

You can install it using `yarn` or `npm`, whatever you prefer

```sh
yarn add driver.js
npm install driver.js
```

Or grab the code from `dist` directory and include it directly

```html
<link rel="stylesheet" href="/dist/driver.min.css">
<script src="/dist/driver.min.js"></script>
```

![](./demo/images/split.png)

## Usage and Demo

Demos and many more usage examples can be found [through the docs page](http://kamranahmed.info/driver).

### Highlighting Single Element – [Demo](http://kamranahmed.info/driver#single-element-no-popover)

If all you want is just highlight a single element, you can do that simply by passing the selector

```javascript
const driver = new Driver();
driver.highlight('#create-post');
```
A real world usage example for this could be using it to dim the background and highlight the required element e.g. the way facebook does it on creating a post.

### Popover on Highlighted Element – [Demo](http://kamranahmed.info/driver#single-element-with-popover)

You can show additional details beside the highlighted element using the popover

```javascript
const driver = new Driver();
driver.highlight({
  element: '#some-element',
  popover: {
    title: 'Title for the Popover',
    description: 'Description for it',
  }
});
```

Also, `title` and `description` can have HTML as well.

### Positioning the Popover – [Demo](http://kamranahmed.info/driver#single-element-with-popover-position)

By default, driver automatically finds the suitable position for the popover and displays it, you can override it using `position` property

```javascript
const driver = new Driver();
driver.highlight({
  element: '#some-element',
  popover: {
    title: 'Title for the Popover',
    description: 'Description for it',
    position: 'left', // can be `top`, `left`, `right`, `bottom`
  }
});
```

### Creating Feature Introductions – [Demo](http://kamranahmed.info/driver)

Feature introductions are helpful in onboarding new users and giving them idea about different parts of the application, you can create them seemlessly with driver. Define the steps and call the `start` when you want to start presenting

```javascript
const driver = new Driver();

// Define the steps for introduction
driver.defineSteps([
  {
    element: '#first-element-introduction',
    popover: {
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'left'
    }
  },
  {
    element: '#second-element-introduction',
    popover: {
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'top'
    }
  },
  {
    element: '#third-element-introduction',
    popover: {
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'right'
    }
  },
]);

// Start the introduction
driver.start();
```

