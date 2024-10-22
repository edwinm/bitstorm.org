---
title: "Using SVG icons on the web"
date: 2024-10-20T11:43
media:
  - image: "neon-icons.png"
    caption: ""
    alt: "Wall with web icon shaped neon lamps"
tags: featured
---

This article describes how to give monochrome SVG icons different colors with CSS and how to apply some effects.

Why do you want to use SVG icons? SVG is an ideal format for stylized icons.
SVG (Scalable Vector Graphics) is made out of vectors which makes them very small (as in file size) and are scalable,
which makes them look sharp even at high resolutions.

## Styling SVG icons

You can use SVG icons in an `img` tag or as a background image.
In this article, however, we will use `mask-image`,
which has been in the baseline of popular browsers since 2023 and has great support.

```CSS
.star-icon {
    width: 100px;
    height: 100px;
    background: steelblue;
    mask-image: url(/assets/icons/star.svg);
    mask-size: 100px 100px;
}
```

```html
<div class="star-icon"></div>
```

The result is an icon with the color defined in CSS:

{% raw %}
<style>
.star-icon {
    width: 100px;
    height: 100px;
    background: steelblue;
    mask-image: url(/assets/files/mask-svg-icons/star.svg);
    mask-size: 100px 100px;
}
</style>

<div class="star-icon"></div>
{% endraw %}

The beauty of this method is that we can now use CSS to define the color, unlike when we use the `img` tag
or when we use the SVG as a background image.

There's one condition that must be met: the original SVG icon should be monochrome: black on white.

## SVG icon with the same color as the text

Using CSS to determine the color opens up a whole range of possibilities.
For example, by using `currentColor` as the color, the icon will get the same color as the text.
This is useful, for example, if you include the icons in links and the icon takes over the different link colors.

```css
background: currentColor;
```

Try the link below and see the color of the icon <span class="mdn-link-icon" style="display: inline-block"></span>
in front of the text change with the color of the link:

{% raw %}
<style>
.mdn-link-icon {
    width: 1em;
    height: 1em;
    background: currentColor;
    mask-image: url(/assets/files/mask-svg-icons/mdn.svg);
    mask-size: 1em 1em;
}

.link-example {
    display: flex;
    gap: 0.5em;
    text-decoration: none;

    font-size: 1.2em;
    border: 1px solid darkgray;
    padding: 20px;

    color: blue;

    &:visited {
        color: purple;
    }
    &:hover {
        color: darkcyan;
    }
    &:active {
        color: orange;
    }
}
</style>

<a class="link-example" href="https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image" target="_blank"><span class="mdn-link-icon"></span> Link to MDN mask-image reference</a>
{% endraw %}

You can also make the icon size proportional to the text size so a larger text gets a larger icon.

```css
.mdn-link-icon {
    width: 1em;
    height: 1em;
    background: currentColor;
    mask-image: url(/assets/files/mask-svg-icons/mdn.svg);
    mask-size: 1em 1em;
}
```

## CSS effects

Because we control the icon color with the CSS `background` property,
we can apply all the effects that `background` allows, such as gradients and transitions.

Here's an example. Hover over the icons to see the transitions.

{% raw %}
<style>
@property --icon-color1 {
  syntax: "<color>";
  inherits: true;
  initial-value: transparent;
}
@property --icon-color2 {
  syntax: "<color>";
  inherits: true;
  initial-value: transparent;
}

.effect-icon {
    width: 100px;
    height: 100px;
    --icon-color1: pink;
    --icon-color2: cyan;
    background: linear-gradient(to bottom right in lch, var(--icon-color1), var(--icon-color2));
    mask-image: var(--location);
    mask-size: 100px 100px;
    transition: --icon-color1 500ms ease, --icon-color2 500ms ease;

    &:hover {
        --icon-color1: red;
        --icon-color2: darkblue;
    }
}

.icon-list {
    display: flex;
    gap: 1rem;
    list-style: none;
}
</style>

<ul class="icon-list">
    <li><div class="effect-icon" style="--location: url(/assets/files/mask-svg-icons/star.svg)"></div></li>
    <li><div class="effect-icon" style="--location: url(/assets/files/mask-svg-icons/circle-user-round.svg)"></div></li>
    <li><div class="effect-icon" style="--location: url(/assets/files/mask-svg-icons/settings.svg)"></div></li>
    <li><div class="effect-icon" style="--location: url(/assets/files/mask-svg-icons/trash-2.svg)"></div></li>
    <li><div class="effect-icon" style="--location: url(/assets/files/mask-svg-icons/archive.svg)"></div></li>
</ul>
{% endraw %}

For those curious about the code, you can look at the code on this page, but for convenience, here is the CSS:

```css
@property --icon-color1 {
  syntax: "<color>";
  inherits: true;
  initial-value: transparent;
}
@property --icon-color2 {
  syntax: "<color>";
  inherits: true;
  initial-value: transparent;
}

.effect-icon {
    width: 100px;
    height: 100px;
    --icon-color1: pink;
    --icon-color2: cyan;
    background: linear-gradient(to bottom right in lch, var(--icon-color1), var(--icon-color2));
    mask-image: var(--location);
    mask-size: 100px 100px;
    transition: --icon-color1 500ms ease, --icon-color2 500ms ease;

    &:hover {
        --icon-color1: red;
        --icon-color2: darkblue;
    }
}

.icon-list {
    display: flex;
    gap: 1rem;
    padding: 40px 20px;
    list-style: none;
}
```

And this is the HTML:

```html
<ul class="icon-list">
    <li><div class="effect-icon" style="--location: url(/assets/files/mask-svg-icons/star.svg)"></div></li>
    <li><div class="effect-icon" style="--location: url(/assets/files/mask-svg-icons/circle-user-round.svg)"></div></li>
    <li><div class="effect-icon" style="--location: url(/assets/files/mask-svg-icons/settings.svg)"></div></li>
    <li><div class="effect-icon" style="--location: url(/assets/files/mask-svg-icons/trash-2.svg)"></div></li>
    <li><div class="effect-icon" style="--location: url(/assets/files/mask-svg-icons/archive.svg)"></div></li>
</ul>
```

The CSS code is quite big. That's because we can't simply animate `linear-gradient`.
We have to animate the colors and to achieve this, the following conditions must be met:

* The colors must be defined as custom properties
* These custom properties must be defined as a color using `@property`
* The custom properties must be listed in the value of `transition`

In the code above, a CSS variable `--location` is used to specify the path of the SVG file in the HTML
so that the CSS does not have to be adjusted when an icon is added or removed in the HTML.

## Lucide open source icons

The icons used in the examples come from Lucide, a community driven collection of more than 1500 high-quality open source icons.
A nice touch is that you can set the stroke width before downloading.

* [Lucide](https://lucide.dev/)

Lucide also has a very good [page about accessibility](https://lucide.dev/guide/advanced/accessibility),
which explains how you can use the icons in such a way that you do not exclude people.

## Backwards compatibility

Since the `mask-image` CSS property is still fairly new, there are still some browsers that do not support it.
See [Can I use CSS property: mask-image](https://caniuse.com/mdn-css_properties_mask-image) for the latest statistics.

To support these older browsers, you can use the following CSS.
In older browsers, the icon won't have a color, but at least the icon is visible.

```css
.star-icon-compat {
    width: 100px;
    height: 100px;
    background: url(/assets/files/mask-svg-icons/archive.svg) 50%/cover;
}

@supports (-webkit-mask-image: url(/)) {
    .star-icon-compat {
        background: steelblue;
        -webkit-mask-image: url(/assets/files/mask-svg-icons/archive.svg);
        -webkit-mask-size: 100px 100px;
    }
}

@supports (mask-image: url(/)) {
    .star-icon-compat {
        background: steelblue;
        mask-image: url(/assets/files/mask-svg-icons/archive.svg);
        mask-size: 100px 100px;
    }
}
```

This is the icon with the above CSS applied, in case you want to test it in an older browser.

{% raw %}
<style>
.archive-icon-compat {
    width: 100px;
    height: 100px;
    background: url(/assets/files/mask-svg-icons/archive.svg) 0/cover;
}

@supports (-webkit-mask-image: url(/)) {
    .archive-icon-compat {
        background: steelblue;
        -webkit-mask-image: url(/assets/files/mask-svg-icons/archive.svg);
        -webkit-mask-size: 100px 100px;
    }
}

@supports (mask-image: url(/)) {
    .archive-icon-compat {
        background: steelblue;
        mask-image: url(/assets/files/mask-svg-icons/archive.svg);
        mask-size: 100px 100px;
    }
}
</style>

<div class="archive-icon-compat"></div>
{% endraw %}

## Creating an SVG icon sprite

Using a lot of SVG icon files can be bad for performance.
The solution is to bundle the icons in one file: the sprite.
This article describes how to do this.

* [Creating an SVG icon sprite](creating-an-svg-icon-sprite.html)