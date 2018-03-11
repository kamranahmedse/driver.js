/* eslint-disable */

const tourDriver = new Driver({
  animate: true,
  opacity: 0.8,
  padding: 5,
  showButtons: false,
});

tourDriver.defineSteps([
  {
    element: '.emoji',
    popover: {
      title: 'Adding Introductions',
      description: 'You can use it to add popovers on top of the website',
      position: 'bottom',
    },
  }, {
    element: '.section__header',
    popover: {
      title: 'Adding Introductions',
      description: 'You can use it to add popovers on top of the website',
      position: 'bottom',
    },
  },
  {
    element: '.btn__dark',
    popover: {
      title: 'This is Button',
      description: 'Yeah I know I dont need to tell that but anyways, we need a step in the listing so yeah!'
    }
  },
  {
    element: '#free-use',
    popover: {
      title: 'Free to Use',
      description: 'Yes, you can use it in your personal or commercial products'
    }
  },
  {
    element: '.section__how',
    popover: {
      title: 'Just Specify the Item',
      description: 'All you have to do is provide the query selector of element to highlight',
      position: 'right',
    },
  },
  {
    element: '.section__purpose',
    popover: {
      title: 'Automatically Position',
      description: 'It can automatically position too if you dont provide',
    },
  },
  {
    element: '.section__examples',
  },
  {
    element: '.section__contributing',
    popover: {
      title: 'Automatically Position',
      description: 'It can automatically position too if you dont provide',
    },
  },
]);

document.querySelector('.btn__example')
  .addEventListener('click', () => {
    tourDriver.start();
  });


document.querySelectorAll('pre code').forEach((element) => {
  hljs.highlightBlock(element);
});


/////////////////////////////////////////////
// First example – highlighting without popover
/////////////////////////////////////////////
const singleDriverNoPopover = new Driver();
document.querySelector('#run-single-element-no-popover')
  .addEventListener('click', (e) => {
    e.preventDefault();
    singleDriverNoPopover.highlight('#single-element-no-popover');
  });

/////////////////////////////////////////////
// Form focus examples
/////////////////////////////////////////////
const focusDriver = new Driver({ padding: 0 });
const inputIds = ['creation-input', 'creation-input-2', 'creation-input-3', 'creation-input-4'];
inputIds.forEach(inputId => {
  // Highlight the section on focus
  document.getElementById(inputId).addEventListener('focus', () => {
    focusDriver.highlight(`#${inputId}`);
  });
});

/////////////////////////////////////////////
// Highlighting single element with popover
/////////////////////////////////////////////
const singleDriverWithPopover = new Driver();
document.querySelector('#run-single-element-with-popover')
  .addEventListener('click', (e) => {
    e.preventDefault();
    singleDriverWithPopover.highlight({
      element: '#single-element-with-popover',
      popover: {
        title: 'Did you know?',
        description: 'You can add HTML in title or description also!',
        position: 'top'
      }
    });
  });

/////////////////////////////////////////////////////
// Highlighting single element with popover position
/////////////////////////////////////////////////////
const singleDriverWithPopoverPosition = new Driver();
document.querySelector('#run-single-element-with-popover-position')
  .addEventListener('click', (e) => {
    e.preventDefault();

    singleDriverWithPopoverPosition.highlight({
      element: '#single-element-with-popover-position',
      popover: {
        title: 'Did you know?',
        description: 'You can add HTML in title or description also!',
        position: 'left'
      }
    });
  });

/////////////////////////////////////////////////////
// Highlighting single element with popover position
/////////////////////////////////////////////////////
const positionBtnsDriver = new Driver({
  padding: 0,
});

document.querySelector('#position-btn-left')
  .addEventListener('click', (e) => {
    e.preventDefault();

    positionBtnsDriver.highlight({
      element: '#position-btn-left',
      popover: {
        title: 'Did you know?',
        description: 'You can add HTML in title or description also!',
        position: 'left'
      }
    });
  });

document.querySelector('#position-btn-right')
  .addEventListener('click', (e) => {
    e.preventDefault();

    positionBtnsDriver.highlight({
      element: '#position-btn-right',
      popover: {
        title: 'Did you know?',
        description: 'You can add HTML in title or description also!',
        position: 'right'
      }
    });
  });

document.querySelector('#position-btn-bottom')
  .addEventListener('click', (e) => {
    e.preventDefault();

    positionBtnsDriver.highlight({
      element: '#position-btn-bottom',
      popover: {
        title: 'Did you know?',
        description: 'You can add HTML in title or description also!',
        position: 'bottom'
      }
    });
  });

document.querySelector('#position-btn-top')
  .addEventListener('click', (e) => {
    e.preventDefault();

    positionBtnsDriver.highlight({
      element: '#position-btn-top',
      popover: {
        title: 'Did you know?',
        description: 'You can add HTML in title or description also!',
        position: 'top'
      }
    });
  });

/////////////////////////////////////////////////////
// Highlighting single element with popover position
/////////////////////////////////////////////////////
const htmlDriver = new Driver();

document.querySelector('#run-single-element-with-popover-html')
  .addEventListener('click', (e) => {
    e.preventDefault();

    htmlDriver.highlight({
      element: '#single-element-with-popover-html',
      popover: {
        title: '<em>Tags</em> in title or <u>body</u>',
        description: 'Body can also have <strong>html tags</strong>!',
        position: 'top'
      }
    });
  });

/////////////////////////////////////////////////////
// Without Overlay Example
/////////////////////////////////////////////////////
const withoutOverlay = new Driver({
  opacity: 0,
  padding: 0
});

document.querySelector('#run-element-without-popover')
  .addEventListener('click', (e) => {
    e.preventDefault();

    withoutOverlay.highlight({
      element: '#run-element-without-popover',
      popover: {
        title: 'Title for the Popover',
        description: 'Description for it',
        position: 'left', // can be `top`, `left`, `right`, `bottom`
      }
    } );
  });

/////////////////////////////////////////////////////
// Highlighting single element with popover position
/////////////////////////////////////////////////////
const featureIntroductionDriver = new Driver();
featureIntroductionDriver.defineSteps([
  {
    element: '#first-element-introduction',
    popover: {
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'bottom'
    }
  },
  {
    element: '#second-para-feature-introductions',
    popover: {
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'left'
    }
  },
  {
    element: '#third-para-feature-introductions',
    popover: {
      title: 'Title on Popover',
      description: 'Body of the popover',
      position: 'right'
    }
  },
  {
    element: '#run-multi-element-popovers',
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
      position: 'top'
    }
  },
]);

document.querySelector('#run-multi-element-popovers')
  .addEventListener('click', (e) => {
    e.preventDefault();
    featureIntroductionDriver.start();
  });

