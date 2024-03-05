---
title: "Carbonium, a lightweight library to manipulate the DOM"
date: 2020-08-27T15:24

---

This summer, I've been working on updating my [Game of Life](https://playgameoflife.com/) site. I looked at several JavaScript frameworks, but was not satisfied with the performance of any of them. I could've used my own [miq](https://github.com/edwinm/miq#readme) lilbrary, but that mimicks the jQuery API too much.

When you write in native DOM, you probably use `document.querySelectorAll(selector)` a lot. After a while, you probably write a helper function like this:

```javascript
const $ = (selector, dom) => 
                    Array.from((dom || document).querySelectorAll(selector));
```

But writing code this way is still a bit cumbersome.

I wanted to make a next step. Something very small, only providing the native DOM but still just as easy to use as jQuery.

After some thinking about how to approach this, it finally made sense: I have to use a Proxy! I could look at which property was being get or set and return the right value. Was the property `forEach`? Return the `Array.forEach` function. Was the property `textContent`? Return `HTMLElement.textContent`.

A `if-then-else` wrapped in a Proxy should be easy, right? I could do this on a rainy Sunday afternoon, right? It turned out to be a bit harder (see [the code here](https://github.com/edwinm/carbonium/blob/master/src/carbonium.ts)) but eventually, I got it working.

I also had to find a name. You can view the result of the `$(â€¦)` function in two ways: as an element and as an array of elements. What else appears in two forms? Hmm, carbon, which we know as graphite and diamond! I took the Latin word carbonium, which was still available on NPM. 

With carbonium, you can run code like this:

```javascript
$(".indent").style.left = "40px";
```

and this:

```javascript
$("div")
  .filter((el) => el.textContent == "priority")
  .classList.add("important");
```

In this latest snippet, all div's with "priority" as content, will get the class `important`.

The library is only 1.36 kilobytes and that's even before compression. It's ideal when you want high performance and don't want to use a JavaScript framework.

It's also interesting when writing Web Components. You want to the be as small as possible and still self contained.

Carbonium is written in TypeScript, so when you use TypeScript too, you get to use all the advantages. But you can use JavaScript just as well.

You can install carbonium like this:

```bash
npm install --save-dev carbonium
```

And then import it like this:

```javascript
import { $ } from "carbonium";
```

You can also use carbonium without installing or using a bundler like webpack or rollup.js:

```javascript
const { $ } = await import(
  "https://cdn.jsdelivr.net/npm/carbonium/dist/bundle.min.js"
);
```

You can `git clone` or `npm install` carbonium here:

- GitHub repository: [carbonium](https://github.com/edwinm/carbonium#readme)
- NPM package: [carbonium](https://www.npmjs.com/package/carbonium)
