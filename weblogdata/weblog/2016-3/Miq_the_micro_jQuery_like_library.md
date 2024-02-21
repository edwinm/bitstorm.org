---
title: "Miq, the micro jQuery like library"
date: 2016-03-30T12:59

---

Today I released miq, a tiny jQuery like library. Since the first release of jQuery a lot has changed: lots of array functions, promises, querySelectorAll, CSS transformations... and jQuery can only partially use them because the makers want to keep it backwards compatible.

I created miq to combine the power of jQuery with modern JavaScript.

## You might not need jQuery

A couple of years ago an [article](http://youmightnotneedjquery.com/) appeared that showed how to do the usual operations in plain vanilla JavaScript. It was an eye opener for many developers.

Now there are many developers who fiercely oppose using jQuery. There are two camps:

1. Developers who don't like the monolithical aspect of jQuery and write plain JavaScript with, possibly, some tiny one trick libraries.
2. Developers who think jQuery is too low level. They use frameworks like AngularJS or React.

As an experiment, I also started to write vanilla JavaScript. And then I found out that an array returned by querySelectorAll does not support array functions like forEach, map or filter.

So this powerful jQuery construct:

```javascript
$(selector).each(function);
```

Becomes this in vanilla JavaScript:

```javascript
Array.prototype.forEach.call(document.querySelectorAll(selector), function);
```

What? I'm not going to type that every time! Can't I make a little library combining querySelectorAll with array functions? Yes, it was possible. I added some common jQuery functions and kept the library very small. Miq was born.

## Download

Miq even has some extra features jQuery doesn't have. Miq Ajax returns native promises (You can use a promise polyfill for older browsers). The empty function $() returns a documentFragment, a lightweight DOM container. And it provides all the array functions, which is quite a lot, as you can see in this [MDN Array article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

Miq supports both AMD and CommonJS for modular loading.

[See miq for downloads, documentation and unit tests](/javascript/miq/).
