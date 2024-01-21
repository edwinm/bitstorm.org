---
title: "Drop support for Internet Explorer 8 and use these features"
date: 2013-12-19T09:41

---

Webdevelopers had to wait more than ten years before IE6 became a marginal browser. Fortunately, with IE8, we don't have to wait that long. IE7 is already marginalized and IE8 almost, with [7% marketshare](http://gs.statcounter.com/#browser_version_partially_combined-ww-monthly-201212-201312), a number that will certainly drop the coming months. Microsoft [stopping support for XP in April 2014](http://www.microsoft.com/en-us/windows/enterprise/endofsupport.aspx) will certainly help.

Should you continue to support IE8 in your current websites? Should you support IE8 in the new site that you're making and that's not going live soon?

Below you'll find a (non exhaustive) list of some very useful features you can use when you drop support for IE8.

## HTML5 elements

With IE9 and all other modern browsers, it is possible to use the new semantic HTML5 elements without using hacks like [html5shiv](https://code.google.com/p/html5shiv/). So finally browsers will have native support for elements like nav, section, aside and footer. See the [HTML5 Doctor element index](http://html5doctor.com/element-index/) for a complete list.

## Video and audio elements

One thing HTML was lacking for many years was multimedia support. To listen to audio or watch video on your webpage, a plugin like Flash had to be installed. Many websites relied on third party software to function as desired. With the new audio and video elements, browsers can take care of media themselves and you can handle them like any other HTML element.

## Canvas

Supported in other browsers for many years, with IE9, it's also supported by Microsoft. With canvas it's possible to use JavaScript to draw anything on a web page, just like a (simple) drawing program. Think about interactive graphics, games and other applications which were previously reserved for Flash.

## SVG

With SVG, it's also possible to draw on a web page, but SVG is very different from canvas. Instead of bitmaps, SVG is based on vectors. Every shape in SVG is also an element and part of the DOM. One big advantage of vector based drawings is that you can zoom in and everything stays sharp, it doesn't blur like bitmapped files. A print out of a webpage with SVG graphics has a much better quality. The quality when viewed on a high resolution display (think retina) is also much better.

## Fonts and WOFF

In IE8 and older IE versions, the only supported font format was EOT. This format could be generated with a hard to use, Windows only program. Not really ideal. Now IE9 and later support TrueType fonts and even better, WOFF (Web Open Font Format) fonts. WOFF is cool because we have finally a font format that's supported by all modern browsers. So instead of having to supply a handful of font files and complex font face rules, now you only need one file. Or two, as Android older than version 4.4 does not support WOFF.

## Media queries

Finally IE joins the responsive design (or adaptive design) party. So now it's easy to adjust your webpage to the width of the browser window. And have a good guess at how your webpage will look like on a mobile device by making the window smaller. Which brings us to the popular mobile first design, in which you first design for mobile devices and add media queries for other page sizes later. IE8 users would get the page designed for a mobile device, as if they're being punished for using an old browser.

## CSS3 transforms

With CSS3 transforms, you can make any element on a webpage smaller, bigger, you can rotate them, translate (move) and skew them. Transforms work very well in combination with CSS transitions, but unfortunately, transition support in IE starts at version 10.

## Backgrounds

Now it's possible to have multiple backgrounds. So we can finally say the [sliding doors trick](http://alistapart.com/article/slidingdoors) goodbye. Several new background options are also supported, like stretching the background as big as possible inside the page or have the background cover the whole page. You can also chose whether the backgound should cover the content area or also the padding and border area. Probably the most powerful background feature, gradients, is still not supported in IE9.

## More CSS3

If there are two features designers love but webdevelopers hate, they'll be rounded corners and shadows. Especially when the element could have any size, adding them was a head ache. Not anymore. Now it's just a matter of adding a little CSS.

CSS3 colors are also supported. This means that every color can have its own alpha (opacity) value. And instead of only RGB(A) colors, you can now define colors in HSL(A) values. HSL stands for Hue, Saturation and Lightness, parameters that are much easier to tweak by humans. 

A lot of pseudo classes are added. Now you can select every nth element or every nth element of a certain type. Or just select the first or last. Or have a selector for when an element is empty. With :not() you can negate a selector, so for example, you can select elements which do not have a certain class. Also some UI element states pseudo-classes are added: enabled, disabled, checked and indeterminate.

Some units are also added. The most interesting are rem, vw and vh. Rem is just like em, but always relative to the root element, so no more inheritance problems like having a font that's 80% of 80% of 80% of the original size. With vw and vh, you can make an element size dependent on the viewport width or height. Another useful addition is the calc() function. Now it is possible to use width: calc(10em - 12px). If we only had this ten years ago...

## DOM

A lot of DOM features are added. For example getElementsByClassName, [DOM ranges and text selection](http://blogs.msdn.com/b/ie/archive/2010/05/11/dom-range.aspx), [DOM Traversal](http://blogs.msdn.com/b/ie/archive/2010/07/30/dom-traversal.aspx), [addEventListener](http://blogs.msdn.com/b/ie/archive/2010/03/26/dom-level-3-events-support-in-ie9.aspx) (that took a while), [createEvent](http://msdn.microsoft.com/en-us/library/ie/ff975304%28v=vs.85%29.aspx) to create your own events and the much needed DOMContentLoaded.

## JavaScript

EcmaScript, the "official version" of JavaScript has reached version 5, in which some nice features are added. One is adding handy [functional programming](http://en.wikipedia.org/wiki/Functional_programming) methods like forEach, map and filter. Modern browsers support these methods without having to use a shim like [es5-shim](https://github.com/kriskowal/es5-shim). The other important addition is being able to protect JavaScript objects from being changed. See [ECMAScript 5 Objects and Properties](http://ejohn.org/blog/ecmascript-5-objects-and-properties/) for a good explanation.

## Performance

Compared to other browsers, the JavaScript engine in IE8 is really, really slow. With IE9, the browser got a [new fast JavaScript engine](http://arstechnica.com/information-technology/2010/11/internet-explorer-9-platform-preview-7-performance-is-the-priority/), just like the other browsers, opening the doors for JavaScript heavy web applications and games.

Another performance boost is being made by delegating more graphics intense operations to the graphics processor. Started with [IE9](http://blogs.msdn.com/b/ie/archive/2010/04/09/benefits-of-gpu-powered-html5.aspx), now all browsers are hardware accelerated. Web pages will behave smoother and also in this case, games will benefit.

## jQuery 2.0

The changes in IE9 and other browsers are so big, there are now two versions of jQuery: 1.x with IE8 support and 2.x without IE8 support. Version 2 should become a lot smaller and have fewer bugs. Unfortunately, jQuery still supports older Android versions, so it still carries some legacy code. Some people think DOM support in modern browsers is so good now, jQuery is not needed at all.

When do you drop support for IE8?
