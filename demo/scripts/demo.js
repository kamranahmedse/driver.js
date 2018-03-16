/* eslint-disable */
document.addEventListener("DOMContentLoaded", function () {

  const tourSteps = [
    {
      element: '#driver-demo-head',
      popover: {
        title: 'Before we start',
        description: 'This is just one use-case, make sure to check out the rest of the docs below.',
        nextBtnText: 'Okay, Start!'
      }
    }, {
      element: '#logo_emoji',
      popover: {
        title: 'Focus Anything',
        description: 'You can use it to highlight literally anything, images, text, div, span, li etc.',
        position: 'bottom'
      }
    }, {
      element: '#name_driver',
      popover: {
        title: 'Why Driver?',
        description: 'Because it let\'s you drive the user across the page',
        position: 'bottom'
      }
    }, {
      element: '#driver-demo-head',
      popover: {
        title: 'Lets talk features',
        description: 'You may leave your mouse and use the <strong>arrow keys</strong> to move next and back or <strong>escape key</strong> anytime to close this',
        position: 'bottom'
      }
    }, {
      element: '#highlight_feature',
      popover: {
        title: 'Highlight Feature',
        description: 'You may use it to highlight single elements (with or without popover) e.g. like facebook does while creating posts'
      }
    }, {
      element: '#feature_introductions_feature',
      popover: {
        title: 'Feature Introductions',
        description: 'With it\'s powerful API you can use it to make programmatic or user driven feature introductions',
        position: 'bottom'
      }
    }, {
      element: '#focus_shifters_feature',
      popover: {
        title: 'Focus Shifters',
        description: 'If some element or part of the page needs user\'s interaction, you can just call the highlight method. Driver will take care of driving the user there',
        position: 'bottom'
      }
    }, {
      element: '#customizable_feature',
      popover: {
        title: 'Highly Customizable',
        description: 'Driver has a powerful API allowing you to customize the experience as much as you can.',
        position: 'bottom'
      }
    }, {
      element: '#keyboard_feature',
      popover: {
        title: 'User Friendly',
        description: 'Your users can control it with the arrow keys on keyboard, or escape to close it',
        position: 'bottom'
      }
    }, {
      element: '#free_use_feature',
      popover: {
        title: 'MIT License',
        description: 'I believe in open-source and thus Driver is completely free for both personal or commercial use'
      }
    }, {
      element: '#lightweight_feature',
      popover: {
        title: 'Only ~4KB',
        description: 'Driver is free of bloat and written in Vanilla JS. There is no external dependency at all, thus keeping it smaller in size.'
      }
    }, {
      element: '#examples_section',
      popover: {
        title: 'Usage Examples',
        description: 'Have a look at the usage examples and see how you can use it.'
      }
    }, {
      element: '#driver-demo-head',
      popover: {
        title: 'Quick Tour Ends',
        description: 'This was just a sneak peak, have a look at the API section and examples to learn more!'
      }
    }
  ];

  const animatedTourDriver = new Driver({
    animate: true,
    opacity: 0.8,
    padding: 5,
    showButtons: true,
  });

  const boringTourDriver = new Driver({
    animate: false,
    opacity: 0.8,
    padding: 5,
    showButtons: true,
  });

  boringTourDriver.defineSteps(tourSteps);
  animatedTourDriver.defineSteps(tourSteps);

  document.querySelector('#animated-tour')
    .addEventListener('click', () => {
      if (boringTourDriver.isActivated) {
        boringTourDriver.reset(true);
      }

      animatedTourDriver.start();
    });

  document.querySelector('#boring-tour')
    .addEventListener('click', () => {
      if (animatedTourDriver.isActivated) {
        animatedTourDriver.reset(true);
      }

      boringTourDriver.start();
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
          position: 'top'
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
          position: 'top', // can be `top`, `left`, `right`, `bottom`
        }
      });
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
        position: 'top'
      }
    },
    {
      element: '#second-para-feature-introductions',
      popover: {
        title: 'Title on Popover',
        description: 'Body of the popover',
        position: 'bottom'
      }
    },
    {
      element: '#third-para-feature-introductions',
      popover: {
        title: 'Title on Popover',
        description: 'Body of the popover',
        position: 'top'
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
      e.stopPropagation();
      featureIntroductionDriver.start();
    });

  const newURL = location.href.split("?")[0];
  if (newURL !== location.href) {
    window.location = newURL;
    window.location.href = newURL;
  }
});
