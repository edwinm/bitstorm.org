---
title: "Don't use a dark-light toggle at all"
date: 2026-08-25T22:50
tags: [featured]
---

I am old enough to remember that when background images on websites became possible, suddenly a lot of
websites got background images. When (i)frames became possible, a lot of websites got (i)frames.
And you see the same thing over the past few years with scroll-based animations.

What you also see increasingly in recent years: dark-light toggles. For a few years now, browsers have supported
dark and light mode, allowing you to display a website in both a dark or a light version.
With a toggle, you can switch between these modes.
Operating systems have also supported a dark or light mode for a few years now, so 'system' is often also an option,
to adopt the operating system's mode.

A few weeks ago, Lea Verou wrote the article
[Dark mode toggles: two states are enough](https://lea.verou.me/blog/2026/dark-mode-toggles/)
in which she argues against offering a 'light' option in most cases if you are already in light mode, or a dark mode if you are in dark mode.
Sounds logical.

This led, among other things, to a [discussion on Bluesky](https://bsky.app/profile/bram.us/post/3msaprh5l622k)
in which @bram.us asks whether you should show the user two or three options.

The correct answer was not among them; that is to offer no dark-light toggle at all.

The dark-light toggle is _gratuitous use of bleeding-edge technology_ and that is number two on
the [Original Top 10 Mistakes in Web Design](https://www.nngroup.com/articles/original-top-ten-mistakes-in-web-design/)
by UI expert Jakob Nielsens.

I suspect the web developer thinks this:
"I worked hard to support both modes, so the user should be able to see both easily."
But you create a website for users, not to stroke your own ego.

Besides, you see it on other sites, so we might as well do it too, also known as the [Bandwagon effect](https://en.wikipedia.org/wiki/Bandwagon_effect).

There is, in fact, absolutely no reason to put a dark-light toggle on your website.

The operating system determines whether you are in dark or light mode. The background, your file explorer, your email program, they all
switch along with the OS and do not need a dark-light toggle.

Why would your website need a toggle?

Do you really think that people with a dark desktop want to see the light version of your site?
Or vice versa, your dark version when the entire desktop with all programs is light?

{% image 'white-mode-in-dark-node.jpeg', '', 'White mode site in dark mode OS sticks out like a sore thumb', 800 %}
<p style="text-align: center; font-style: italic">White mode site in dark mode OS sticks out like a sore thumb</p>

And the rare individual who still feels the need can install a browser extension to make it possible anyway,
for example [Chrome Dark Mode Toggle](https://chromewebstore.google.com/detail/chrome-dark-mode-toggle/idnbggfpadjhjicgjmhlpeilafaplnhd) from
the same @bram.us. Browsers other than Chrome surely have similar extensions as well. 

The correct solution is therefore simply to follow the operating system's mode.
In CSS, that is very simple:
You start with this code to indicate that your page supports light and dark mode.

```css
html {
    color-scheme: light dark;
}
```

If it takes too long to load this line, it can result in a flash.
You can prevent this by placing the line in the `head`:

```html
<meta name="color-scheme" content="light dark">
```

Afterwards, you can specify the style for the correct mode with this media query:

```css
@media (prefers-color-scheme: dark) {
    html {
        color: white;
        background-color: black;
    }
}
```

When it comes to colors, you can also use `light-dark()`:

```css
color: light-dark(black, white);

```

So remove that toggle or simply don't add it; it also saves work that you can spend on useful
things, such as making your website suitable for people who are colorblind, visually impaired, or even blind.