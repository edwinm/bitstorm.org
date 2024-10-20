---
title: "Creating an SVG icon sprite"
date: 2024-10-20T10:18
media:
  - image: "svg-sprite.png"
    caption: ""
    alt: "Wall of wooden blocks with web related images" 
---

If you use a lot of SVG icons on your website, it is better for the performance of the site to merge them into one file:
the SVG sprite.

You can do this with the powerful `svg-sprite` package by Joschi Kuphal.

* See [svg-sprite](https://github.com/svg-sprite/svg-sprite)

Install `svg-sprite` with npm:

```bash
npm install --save-dev svg-sprite
```

Next, we put all configuration data in a configuration file called `svg-sprite.config.json`:

```json
{
    "path": "out",
    "mode": {
        "view": {
            "dest": "assets/icons",
            "sprite": "sprite.SVG",
            "bust": false,
            "example": false
        }
    },
    "shape": {
        "spacing": {
            "box": "icon"
        }
    }
}
```

Make sure to change `assets/icons` to your own directory where `sprite.svg` should be generated.

It can also generate an example file (by using `"example": true`) so you have an overview of all available icons.
See all options in the extensive documentation at [svg-sprite configuration](https://github.com/svg-sprite/svg-sprite/blob/main/docs/configuration.md).

Note the `"box": "icon"`. Using this, you can use SVG icons of various sizes in one sprite
and they will appear as expected using the technique below.

Now you can call `svg-sprite` to generate the `sprite.svg` from several SVG files.

```bash
npx svg-sprite --config src/svg-sprite.config.json src/icons/*.svg
```

Change `src/svg-sprite.config.json` to the location of your config file
and change `src/icons` to your own directory where the individual SVG files are.

For the examples on this page, we use a directory with these SVG icon files:

```text
archive.svg
circle-user-round.svg
settings.svg
star.svg
trash-2.svg
```

It's a good idea to include the script above into your `package.json`, so it's easy to run:

```json
...
"scripts": {
  ...
  "sprite": "svg-sprite --config src/svg-sprite.config.json  src/icons/*.svg"
}
```

Now that we've generated a `sprite.svg`, how do we use it?
That's very simple. From now on, don't use (for example) `star.svg` as the location of your SVG file, but `sprite.svg#star`.
The file name of the original SVG icon will be the part after the `#`.
There's no need to load an extra generated CSS file.

Now you can use one of the icons in an `img` tag:

{% raw %}
<img width="100" height="100" src="/assets/files/sprite.svg#settings">
{% endraw %}

This is the HTML of the icon above:

```html
<img width="100" height="100" src="/assets/files/sprite.svg#settings">
```

Or as a background image:

{% raw %}
<style>
.bg-icon {
    width: 100px;
    height: 100px;
    background: url(/assets/files/sprite.svg#archive) 50%/cover;
}
</style>

<div class="bg-icon"></div>
{% endraw %}

With the following HTML:

```html
<style>
.bg-icon {
    width: 100px;
    height: 100px;
    background: url(/assets/files/sprite.svg#archive) 50%/cover;
}
</style>

<div class="bg-icon"></div>
```

By using `mask-image`, you can give the icons a color.
Make sure the source icons are black and white.

{% raw %}
<style>
.hover-icon {
    width: 100px;
    height: 100px;
    background-color: lightblue;
    mask-image: var(--location);
    mask-size: 100px 100px;
    transition: background-color 500ms ease;

    &:hover {
        background-color: steelblue;
    }
}

.icon-list {
    display: flex;
    gap: 1rem;
    padding: 40px 20px;
    list-style: none;
}
</style>

<ul class="icon-list">
    <li><div class="hover-icon" style="--location: url(/assets/files/sprite.svg#star)"></div></li>
    <li><div class="hover-icon" style="--location: url(/assets/files/sprite.svg#circle-user-round)"></div></li>
    <li><div class="hover-icon" style="--location: url(/assets/files/sprite.svg#settings)"></div></li>
    <li><div class="hover-icon" style="--location: url(/assets/files/sprite.svg#trash-2)"></div></li>
    <li><div class="hover-icon" style="--location: url(/assets/files/sprite.svg#archive)"></div></li>
</ul>
{% endraw %}

This is the CSS code of the example above:

```css
.hover-icon {
    width: 100px;
    height: 100px;
    background-color: lightblue;
    mask-image: var(--location);
    mask-size: 100px 100px;
    transition: background-color 500ms ease;

    &:hover {
        background-color: steelblue;
    }
}

.icon-list {
    display: flex;
    gap: 1rem;
    padding: 40px 20px;
    list-style: none;
}
```

And the HTML:

```html
<ul class="icon-list">
    <li><div class="hover-icon" style="--location: url(/assets/files/sprite.svg#star)"></div></li>
    <li><div class="hover-icon" style="--location: url(/assets/files/sprite.svg#circle-user-round)"></div></li>
    <li><div class="hover-icon" style="--location: url(/assets/files/sprite.svg#settings)"></div></li>
    <li><div class="hover-icon" style="--location: url(/assets/files/sprite.svg#trash-2)"></div></li>
    <li><div class="hover-icon" style="--location: url(/assets/files/sprite.svg#archive)"></div></li>
</ul>
```

Scroll to the side to see that the file names used are `sprite.svg#star`, `sprite.SVG#circle-user-round` etc.

