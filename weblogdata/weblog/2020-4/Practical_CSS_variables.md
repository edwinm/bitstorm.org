---
title: "Practical CSS variables"
date: 2020-04-25T17:31

---

In HTML and JavaScript, you can easily apply some styling with the `style` attribute or property. But if you just want to pass a value, like a color, `style` falls short.

Fortunately, there is a solution for this, which has now been adopted by [all
modern browsers](https://caniuse.com/#feat=css-variables): [CSS Custom Properties for Cascading Variables](https://www.w3.org/TR/css-variables/),
or CSS variables for short.

How do CSS variables work?

Let's start with an example in CSS:

```css
:root {
  --warning-color: orange;
}

.warning {
  color: var(--warning-color, red);
  border: 1px solid var(--warning-color, red);
}
```

So you can set a custom property within CSS and use it again in other places. Changing a property has now become much easier.

You set a CSS custom property just like a CSS property, but it always starts with '\--'.
You can read it out with `var(-â€‹-varname)`.

The optional second parameter of `var()`, in the example above `red`,
is the default value
in case the variable `-â€‹-warning-color` has not (yet) been set.

It is important to know that these variables follow the same rules for
cascading like all other CSS properties, hence the name
Cascading Variables.

## Custom Properties or Variables?

The terms custom properties and variables appears to be used interchangeably in texts about this topic, but what is what?

In CSS you have a declaration such as `color: white`. To the left of the colon
is the property and to its right the value. If the property starts with '\--',
it is always a custom property.

If you use this on the right side of the colon in a
`var()` function, then it is a variable.

## JavaScript

In JavaScript it is possible to assign a value to a
CSS custom property, after which you can decide exactly what to do with it in CSS.

Changing the property `-â€‹-warning-color` is done in JavaScript
as follows:

```javascript
element.style.setProperty("--warning-color", "maroon");
```

The warning from the previous example will now turn maroon.

To use a CSS variable throughout a document,
put it on the root element:

```javascript
document.documentElement.style.setProperty("--warning-color", "maroon");
```

## Calculate

You can also do calculations with CSS variables.

Suppose you have a box that has been determined in JavaScript to be
shown 80 pixels from the left:

```javascript
boxElement.style.setProperty("--box-left", "80px");
```

But in your CSS you know you have to add the left margin to that as well,
which you also stored in a CSS variable.

Then your CSS might look like this:

```css
  : root {
    --margin-left: 10px;
  }

  .box {
    position: relative;
    left: calc(var(--box-left) + var(--margin-left));
  }
```

The `left` property of the box now becomes `90px`.

## Read CSS variables

Instead of setting a CSS variable from JavaScript, you can also read CSS variables.
A useful example is having a media query in CSS and you don't want to copy the same logic to JavaScript.

You would use the `getPropertyValue()` function to do that, but this function only sees the properties and values that
are directly set on that element. To also find the inherited and calculated properties and values, you
first have to use the `getComputedStyle()` function, like this:

```javascript
getComputedStyle(myElement).getPropertyValue('--my-variable-name')
```

## No unit

Even better, don't set a unit like `px` in the `setProperty` function. It is best to set this where it belongs: in the CSS.

Take, for example, a progress indicator that goes from 0 to 100.

```javascript
document.documentElement.style.setProperty ("--progress", bytes / totalBytes * 100);
```

Your CSS can then look like this:

```css
  .progress box {
    background-color: deepskyblue;
    width: calc(var(--progress) * 0.6rem);
    height: 1rem;
  }
```

If the progress is 40%, the width will be equal to 40 — 0.6rem = 24rem. The unit to use (rem) is now defined in the CSS.

## Media queries

CSS variables are very useful in media queries.
For example, to make everything fit properly on very small screens, you can make the margins smaller:

```css
: root {
    --margin: 8px;
}

@media (max-width: 360px) {
    : root {
        --margin: 2px;
    }
}

.some-text-box {
  margin: var(--margin);
}
```

## Theming

You can of course keep a theme very simple with a foreground and background color and a few classes.
But if you want to give some text, borders or icons certain accent colors,
it quickly becomes very cumbersome the old way.

CSS variables are very suitable for this. Also for
_dark mode_, where the dark / light mode of the page changes with the operating system:

```css
:root {
  --background: white;
  --text: black;
  --accent: lightblue;
}

@media(prefers-color-scheme: dark) {
    :root {
      --background: black;
      --text: white;
      --accent: purple;
    }
}

html {
  color: var(--text);
  background-color: var(--background);
}

.some-box {
  border: 3px solid var(--accent);
}
```

You can work with different color palettes in this way
and assign them in the CSS to different properties.

## Vary with colors

You can also vary colors with a little creativity.
That works best if you use `hsl()` or `hsla()` notation.

For example, you can record the hue in a variable
and define all kinds of variations in the CSS:

```css
:root {
    --theme-hue: 120; /* 120 is green */
}

.themed-box {
    color: hsl(var(--theme-hue), 50%, 90%);
    background-color: hsl(var(--theme-hue), 50%, 30%);
    border: 2px solid hsl(var(--theme-hue), 100%, 50%);
}
```

Now only changing `-â€‹-theme-hue` from, for example
120 (green) to 0 (red), will also change the style of `.themed-box`,
including all variations on that color.

Of course you can also change the saturation in this way to make a page or element brighter or more subdued.
Or change the brightness (lightness) to make a page lighter or
darker.

Combine this technique with calc, media queries, theming and dark mode
and a new world opens up. You will probably see a rainbow outside.
And maybe a unicorn!

## Browser variables

In addition to `var()` for reading CSS variables, there is also
`env()` for reading browser environment variables.

Currently (2020), there are four of these environmental variables
defined:
`safe-area-inset-top`,` safe-area-inset-right`,
`safe-area-inset-bottom` and` safe-area-inset-left`.

These four variables indicate the distance from the edge within which the
content can be viewed completely. Think for example of a round watch
with a rectangle with text in it. The variables indicate the distances
from the rectangle to the edges of the screen.

An example in CSS:

```css
safe box {
  position: absolute;
  top: env(safe-area-inset-top, 8px);
  right: env(safe-area-inset-right, 8px);
  bottom: env(safe-area-inset-bottom, 8px);
  left: env(safe-area-inset-left, 8px);
}
```

In `env()`, as with `var()`, the second parameter is the
default parameter if the variable is not set.

## Preprocessors

I have seen several projects where Sass of Less was used only to assign a row of values â€‹â€‹to variables and then use these variables in the rest of the style sheets. Isn't it more convenient to omit the preprocessor and use CSS variables?
I think so. In the build process you skip a step and, for example,
debugging becomes a lot easier.

## Internet Explorer 11

What about Internet Explorer 11? No, unfortunately it does not support CSS variables.
In April 2020, IE11 had a [market share of 1.1%  worldwide](https://gs.statcounter.com/browser-version-market-share#monthly-201904-202004).
If you still want to support this browser (and other old browsers),
then you can apply _graceful degradation_, which is actually always a
good idea:

```css
.warning {
  color: red;
  color: var(--warning-color, red);
  border: 1px solid red;
  border: 1px solid var(--warning-color, red);
}
```

In this case, the warning is always displayed in red in old browsers.
It may not be exactly the color the designer had come up with, however
a user of such an old browser is happy when a website is usable.

## Future

Lea Verou also wanted to be able to draw diagrams in CSS, including
angled connecting lines. That doesn't work well with only `calc()`,
because you also need trigonometric functions.
At the time of writing, in 2020, there is
[work being done](https://github.com/w3c/csswg-drafts/issues/2331)
to add the functions `sin()`, `cos()`, `tan()`, `acos()`, `asin()`,
`atan()`, `atan2()`, `hypot()`, `sqrt()` and `pow()` to CSS.

## Brain teaser

Finally a nice piece of code from a [tweet from Micah Godbolt](https://twitter.com/micahgodbolt/status/1131626097349496833?s=20)
to think about for a moment.

What color is "Hello World"? Pink, blue or red?

```html
<style>
  #blue {--myVar: blue}
  .red {--myVar: red}
</style>

<div style='--myVar: pink'>
  <div id='blue'>
    <div class='red'>
      <span style='color: var(--myVar)'> Hello World </span>
    </div>
  </div>
</div>
```

First think for yourself what your answer will be and only then look
for the [answer](https://codepen.io/edwinm/pen/bGGOdpa).
As can be seen from the voting bars in the [tweet](https://twitter.com/micahgodbolt/status/1131626097349496833?s=20)
quite a few people are wrong.
Also consider why the correct answer is the correct answer.


