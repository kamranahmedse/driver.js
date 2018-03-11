/* eslint-disable */

const tourSholo = new Sholo({
  animate: true,
  opacity: 0.8,
  padding: 5,
});

tourSholo.defineSteps([
  {
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
    tourSholo.start();
  });


document.querySelectorAll('pre code').forEach((element) => {
  hljs.highlightBlock(element);
});


/////////////////////////////////////////////
// First example – highlighting without popover
/////////////////////////////////////////////
const singleSholoNoPopover = new Sholo();
document.querySelector('#run-single-element-no-popover')
  .addEventListener('click', (e) => {
    e.preventDefault();
    singleSholoNoPopover.highlight('#single-element-no-popover');
  });

/////////////////////////////////////////////
// Form focus examples
/////////////////////////////////////////////
const focusSholo = new Sholo({ padding: 0 });
const inputIds = ['creation-input', 'creation-input-2', 'creation-input-3', 'creation-input-4'];
inputIds.forEach(inputId => {
  // Highlight the section on focus
  document.getElementById(inputId).addEventListener('focus', () => {
    focusSholo.highlight(`#${inputId}`);
  });
});

/////////////////////////////////////////////
// Highlighting single element with popover
/////////////////////////////////////////////
const singleSholoWithPopover = new Sholo();
document.querySelector('#run-single-element-with-popover')
  .addEventListener('click', (e) => {
    e.preventDefault();
    singleSholoWithPopover.highlight({
      element: '#single-element-with-popover',
      popover: {
        title: 'Did you know?',
        description: 'You can add HTML in title or description also!',
      }
    });
  });
