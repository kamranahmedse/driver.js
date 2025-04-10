<h1 align="center"><img height="150" src="https://driverjs.com/driver.svg" /><br> Driver.js</h1>

<p align="center">
  <a href="https://github.com/kamranahmedse/driver.js/blob/master/license">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://www.jsdelivr.com/package/npm/driver.js">
    <img src="https://data.jsdelivr.com/v1/package/npm/driver.js/badge?style=rounded" alt="jsdelivr hits" />
  </a>
  <a href="https://npmjs.org/package/driver.js">
    <img src="https://img.shields.io/npm/dm/driver.js" alt="downloads" />
  </a>
  <a href="https://wordpress.org/plugins/interactive-tour-builder/">
    <svg xmlns="http://www.w3.org/2000/svg" role="img" width="28" height="28" viewBox="0 0 28 28">
	<title>WordPress.org</title>
	<path fill="currentColor" d="M13.6052 0.923525C16.1432 0.923525 18.6137 1.67953 20.7062 3.09703C22.7447 4.47403 24.3512 6.41803 25.3097 8.68603C26.9837 12.6415 26.5382 17.164 24.1352 20.7145C22.7582 22.753 20.8142 24.3595 18.5462 25.318C14.5907 26.992 10.0682 26.5465 6.51772 24.1435C4.47922 22.7665 2.87272 20.8225 1.91422 18.5545C0.240225 14.599 0.685725 10.0765 3.08872 6.52603C4.46572 4.48753 6.40973 2.88103 8.67772 1.92253C10.2302 1.26103 11.9177 0.923525 13.6052 0.923525ZM13.6052 0.113525C6.15322 0.113525 0.105225 6.16153 0.105225 13.6135C0.105225 21.0655 6.15322 27.1135 13.6052 27.1135C21.0572 27.1135 27.1052 21.0655 27.1052 13.6135C27.1052 6.16153 21.0572 0.113525 13.6052 0.113525Z"></path>
	<path fill="currentColor" d="M2.36011 13.6133C2.36011 17.9198 4.81711 21.8618 8.70511 23.7383L3.33211 9.03684C2.68411 10.4813 2.36011 12.0338 2.36011 13.6133ZM21.2061 13.0463C21.2061 11.6558 20.7066 10.6973 20.2746 9.94134C19.8426 9.18534 19.1676 8.22684 19.1676 7.30884C19.1676 6.39084 19.9506 5.31084 21.0576 5.31084H21.2061C16.6296 1.11234 9.51511 1.42284 5.31661 6.01284C4.91161 6.45834 4.53361 6.93084 4.20961 7.43034H4.93861C6.11311 7.43034 7.93561 7.28184 7.93561 7.28184C8.54311 7.24134 8.61061 8.13234 8.00311 8.21334C8.00311 8.21334 7.39561 8.28084 6.72061 8.32134L10.8111 20.5118L13.2681 13.1273L11.5131 8.32134C10.9056 8.28084 10.3386 8.21334 10.3386 8.21334C9.73111 8.17284 9.79861 7.25484 10.4061 7.28184C10.4061 7.28184 12.2691 7.43034 13.3626 7.43034C14.4561 7.43034 16.3596 7.28184 16.3596 7.28184C16.9671 7.24134 17.0346 8.13234 16.4271 8.21334C16.4271 8.21334 15.8196 8.28084 15.1446 8.32134L19.2081 20.4173L20.3691 16.7453C20.8821 15.1388 21.1926 14.0048 21.1926 13.0328L21.2061 13.0463ZM13.7946 14.5853L10.4196 24.3998C12.6876 25.0613 15.1041 25.0073 17.3316 24.2243L17.2506 24.0758L13.7946 14.5853ZM23.4741 8.21334C23.5281 8.59134 23.5551 8.98284 23.5551 9.37434C23.5551 10.5218 23.3391 11.8043 22.7046 13.3973L19.2621 23.3333C24.5271 20.2688 26.4036 13.5593 23.4741 8.21334Z"></path>
</svg>
  </a>
</p>

<p align="center">
  <b>Powerful, highly customizable vanilla JavaScript engine to drive the user's focus across the page</b></br>
  <sub>No external dependencies, light-weight, supports all major browsers and highly customizable </sub><br>
</p>

<br />

- **Simple**: is simple to use and has no external dependency at all
- **Light-weight**: is just 5kb gzipped as compared to other libraries which are +12kb gzipped
- **Highly customizable**: has a powerful API and can be used however you want
- **Highlight anything**: highlight any (literally any) element on page
- **Feature introductions**: create powerful feature introductions for your web applications
- **Focus shifters**: add focus shifters for users
- **User friendly**: Everything is controllable by keyboard
- **TypeScript**: Written in TypeScript
- **Consistent behavior**: usable across all browsers
- **MIT Licensed**: free for personal and commercial use

<br />

## Documentation

For demos and documentation, visit [driverjs.com](https://driverjs.com)

<br />

## So, yet another tour library?

**No**, it's more than a tour library. **Tours are just one of the many use-cases**. Driver.js can be used wherever you need some sort of overlay for the page; some common usecases could be: [highlighting a page component](https://i.imgur.com/TS0LSK9.png) when user is interacting with some component to keep them focused, providing contextual help e.g. popover with dimmed background when user is filling a form, using it as a focus shifter to bring user's attention to some component on page, using it to simulate those "Turn off the Lights" widgets that you might have seen on video players online, usage as a simple modal, and of-course product tours etc.

Driver.js is written in Vanilla TypeScript, has zero dependencies and is highly customizable. It has several options allowing you to change how it behaves and also **provides you the hooks** to manipulate the elements as they are highlighted, about to be highlighted, or deselected.

> Also, comparing the size of Driver.js with other libraries, it's the most light-weight, it is **just ~5kb gzipped** while others are 12kb+.

<br>

## Contributions

Feel free to submit pull requests, create issues or spread the word.

## License

MIT &copy; [Kamran Ahmed](https://twitter.com/kamrify)
