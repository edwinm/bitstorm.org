---
title: 'Introduction to Web Components'
date: 2020-12-29T00:00
description: 'Web components is a W3C web standard that allows you, simply put, to create your own HTML tags.' 
---

Web components is a W3C web standard that allows you, simply put, to create your own HTML tags.

Adding a map to your web page can be as simple as adding this tag:

```html
<g-map latitude="52.3812258" longitude="4.9001255"></g-map>
```

With web components, you can work in a component-based way without needing a JavaScript framework like Angular, React, or Vue. However, the tag needs to be made available on the page using JavaScript. We'll come back to this later.

[According to Wikipedia](https://en.wikipedia.org/wiki/Web_Components#History), web components were introduced by [Alex Russell from Google during the Fronteers Conference in 2011](https://fronteers.nl/congres/2011/sessions/web-components-and-model-driven-views-alex-russell).

After several lengthy revisions, the specification is finally ready and is now supported by [all modern browsers](https://caniuse.com/custom-elementsv1). Older browsers can use web components in combination with polyfills.

Starting as one such polyfill, [Polymer](https://www.polymer-project.org/) was developed by Google. This allowed the use of web components while browsers did not yet have support. It is the only known framework based on web components.

Since 2018, two parts of this project are still useful for working with web components:

- [LitElement](https://lit-element.polymer-project.org/): a base class for Web Components.
- [lit-html](https://lit-html.polymer-project.org/): a templating library based on JavaScript template literals (thus using `${var}…`).

## Technologies

Web Components is an umbrella term for three web technologies: Shadow DOM, Custom Elements, and HTML Templates.

### Shadow DOM

With Shadow DOM, it is possible to encapsulate an entire HTML structure including CSS and JavaScript within your own tag, shielded from the rest of the page to avoid conflicts.

It is possible to inspect the Shadow DOM in the browser inspector:

{% image 'shadow-root.png', 'Shadow root', 'A screenshot of Firefox Devtools, highlighting the shadow DOM of an element with #shadow-root', 800 %}

### Custom Elements

A Custom Element is a JavaScript class with which you define the behavior of the element.

### HTML Templates

Any HTML between <template> and </template> tags is not parsed by the browser, so CSS, JavaScript, and images are not executed or downloaded.
This template can be copied with JavaScript and used in your Custom Element, after which it will be parsed.
More about the template element can be found at [`<template>`: The Content Template element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).

## Code Example

Below is the code for a warning component that doesn't do much yet.

```javascript
// Define the MyWarning Custom Element
class MyWarning extends HTMLElement {
  // The constructor is called when an instance of the class is created
  constructor() {
    super();

    // Create a shadow DOM and attach it to this custom element
    this.attachShadow({mode: 'open'});

    // Fill the shadow DOM with HTML
    this.shadowRoot.innerHTML = `
      <style>
        div {
          padding: 20px;
          border: 5px solid red;
        }
      </style>
      <div>
        <slot>
      </div>
    `;
  }
}

// Define a my-warning tag and associate it with the custom element MyWarning
customElements.define('my-warning', MyWarning);
```

This custom element could be used in HTML like this:

```html
<my-warning>This is a warning</my-warning>
```

In the browser, it looks like this:

{% image 'my-warning.png', 'Warning', 'A block with a red border containing the text This is a warning', 800 %}

You can also view and modify the code and its result in this [Codepen](https://codepen.io/edwinm/pen/gOJaRrq).

What may immediately catch your eye is the use of the hyphen in the HTML tag. This is to distinguish between web components and "native" HTML tags and is therefore mandatory when it comes to web components.

In the JavaScript, we see that the Shadow DOM is filled with CSS and HTML code. `<slot>` serves as a placeholder for the content of the <my-warning> tag.

Due to the use of Shadow DOM, the applied CSS is only valid within this Shadow DOM and never affects the rest of the page.

- This custom element can be extended with various "lifecycle functions", which are called when it is added to or removed from the page, for example.
- You can read attributes, react when the value of an attribute changes, and, just like regular HTML elements, you can fire events.
- [Web Fundamentals](https://developers.google.com/web/fundamentals/web-components/customelements) provides detailed instructions on how to create a custom element.

Quick plug: some parts of a Web Component are a bit cumbersome and not very declarative. To improve this, I've written the lightweight [web-component-decorator](https://github.com/edwinm/web-component-decorator). You will need TypeScript for this.

## Customized built-in elements

With customized built-in elements, you can use this notation:

```html
<button is="my-super-button">Click me</button>
```

This is an existing HTML element extended to a custom element with the is attribute. A major advantage of this notation is that you can apply progressive enhancement: the button works in any browser, even if it does not support web components. If JavaScript and web components are available, the visitor gets a richer "my-super-button" custom element.

If you look at the [caniuse page](https://caniuse.com/custom-elementsv1), you will see that Safari does not support these customized built-in elements. This severely limits their application, which is unfortunate.

## Libraries

### Webcomponents\.org

The [webcomponents.org](https://www.webcomponents.org/) project aims to provide a complete library of Web Components. Anyone can add web components, similar to npmjs.com.

### Open Web Components

The [Open Web Components](https://open-wc.org/) project is based on LitElement and lit-html from the Polymer project, but extended with various tools to make development easier, such as build and test scripts.

### Web Components in Angular, Vue, and React

The idea of Web Components is not new. Various JavaScript frameworks also offer components. The advantage of web components is that they are native and not tied to a specific framework.

Companies that invested in AngularJS years ago and found their codebase outdated overnight with the introduction of Angular 2 know the downside of framework dependency. For example, ING now works globally with web components. They have even made their component library [Lion Web Components](https://lion-web-components.netlify.app/) available to everyone.

The advantage of web components is that you can write your components in them and then use them in any other framework. Or can you?

In Angular and Vue, you can use web components just fine, exactly as you are used to in that framework. You can also convert Angular and Vue components into web components.

In [Custom Elements Everywhere](https://custom-elements-everywhere.com/), there is a list of all known frameworks and how well they deal with custom elements. Spoiler: React is the only one not playing nice.

In React, you have to jump through extra hoops to use web components. Assigning data structures to an attribute or listening for events works differently. It only works if you first create a reference to the web component and then use that reference with the web component. Not very convenient.

Within React, you can also convert a component to a web component, but you need external wrappers for that. Hopefully, React will soon handle web components better.

## Conclusion

Web components are very powerful and can be used on both modern and older browsers. If you are already using a framework, it may not be so useful. But if you want to be framework-independent or build a lightweight (JAMStack) website with fast load times, then web components are an obvious choice.