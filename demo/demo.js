/* eslint-disable */
const sholo = new Sholo({
  animate: true,
  opacity: 0.8,
  padding: 5,
});

sholo.defineSteps([
  {
    element: '.section__header',
    popover: {
      title: 'Adding Introductions',
      description: 'You can use it to add popovers on top of the website',
      position: 'bottom',
    },
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
    sholo.start();
  });
