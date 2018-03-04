## spotlight-js
> Allows highlighting any element, adding feature introduction, adding hints

## Highlighting Single Elements

```javascript
const spotlight = new Spotlight({
  opacity: 0.7,  // opacity for the background
  padding: 5,    // padding around the element
});

spotlight.highlight('#some-element');
spotlight.clear();
```