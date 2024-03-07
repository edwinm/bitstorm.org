---
title: "Push the web forward"
date: 2016-01-17T21:59

---

On January 12th, 2016, [Microsoft stopped supporting Internet Explorer 9 and 10](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support). As a webdeveloper, it might be time to stop supporting IE9 and IE10 too. At the time of writing, in January 2016, the [worldwide market share of IE9 and IE10 is less than 1.3% for each browser](http://gs.statcounter.com/#browser_version_partially_combined-ww-monthly-201501-201601). Check the statistics from your own site, because the IE usage on your site might even be less.

Two years earlier, Microsoft already stopped support for IE8. At that time I wrote an [article about which features you can use
when you dropped support for IE8](http://www.bitstorm.org/weblog/2013-12/Drop_support_for_Internet_Explorer_8_and_use_these_features.html). The list of new features you could use was quite large. Now, when dropping IE9 and IE10, the list of new features is even larger!

Below you'll find all new features supported in Chrome, Firefox, Safari, Internet Explorer 11 and Edge.

### CSS

While all the other browsers supported impressive CSS effects for years, we had to wait until version 10 to see it in Internet Explorer. Now we can use these features without workarounds or fall-backs:

* [Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients) - declare a gradient in CSS without the need to load PNG files
* [Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions) - for simple animations
* [Animation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) - for more complex animations with keyframes
* [3D Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) - move your HTML elements in 3D space

We finally can bring our webpages and interfaces to the next level. But there's more. We now also have some new layout modules:

* [Multi-column layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Columns/Using_multi-column_layouts) - neatly arrange text in columns
* [Flexible Box Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes) - the solution where floats gave us a headache

IE also introduces [Grid layout](https://msdn.microsoft.com/en-us/library/hh673533(v=vs.85).aspx), were you can define where elements should appear in a grid, very powerful for making responsive websites. But here IE is the leader of the pack and we have to wait until other browsers will support Grid layout as well. IE also introduces [Regions](https://msdn.microsoft.com/en-us/library/hh772715(v=vs.85).aspx) to let text flow from element to element. Here we also have to wait since it's only supported by IE and Safari right now.

Some other CSS features we can use now:

* [font-feature-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings) - cool features for typography lovers
* [user-select: none](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select) - prevent text from getting selected when clicked
* [text-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow) - now text can have shadows, too
* [border-images](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image) - define borders with an image
* [pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events) - usually used to make elements invisible to clicks

As a bonus, IE can now support more than 31 style sheets per webpage (yes, that limit existed) and pixel values can now be specified in decimals.

### HTML

Most HTML improvements are about forms.

* New form elements
 * [Range input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) - input values with a slider
 * [Progress element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) - show the progress of a process
* New input types
 * [Email](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
 * [Telephone](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
 * [URL](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
 * [Number](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
 * [Search](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
* And new attributes
 * [pattern](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) - to match a value to a regular expression
 * [spellcheck](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) - enable the spell checker for this element
 * [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) - show text when the field is empty
 * [autofocus](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) - for automatically giving focus to this element
 * [multiple](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) - for being able to select multiple files
 * [accept](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) - for accepting only certain file types

These new form elements and attributes also need two new CSS pseudo classes and one pseudo element:

* [:invalid](https://developer.mozilla.org/en-US/docs/Web/CSS/:invalid) - style invalid elements
* [:valid](https://developer.mozilla.org/en-US/docs/Web/CSS/:valid) - style valid elements
* [::placeholder](https://developer.mozilla.org/en-US/docs/Web/CSS/::placeholder) - style the placeholder text

With the [Constraint Validation JavaScript API](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation), validation of the form can also be controlled by JavaScript.

And with the new [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData), forms can easily be send to the server with the updated [XMLHttpRequest 2](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).

There are also a couple of new attributes:

* [sandbox](https://msdn.microsoft.com/en-us/library/hh772930(v=vs.85).aspx) - prevent attacks by isolating an iframe from its parent page
* [hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) - a better way of hiding elements
* [async](https://msdn.microsoft.com/en-us/library/hh673524(v=vs.85).aspx) - loads external scripts asynchronous so it doesn't block loading the page
* [prefetch](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ) - load a resource in the browser cache for future use

[Conditional comments](https://msdn.microsoft.com/en-us/library/ms537512(v=vs.85).aspx) are no longer supported and are now treated like the other browsers do: as comments.

### Binary files

JavaScript always had a hard time dealing with binary data. This is fixed with the addition of the following API's.

* [Base64](https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/base64) - encode from binary to ascii and vice versa
* [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) - Binary Large OBjects to store binary data
* [Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs) - construct a file from a URL so you can include files inline in your source code
* [File](https://developer.mozilla.org/en-US/docs/Web/API/File) and [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) - read files from the local computer
* [XMLHttpRequest 2](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) - send and receive binary data to and from the server and also track upload and download progress

### Webapps

Writing a webapp and running it on all devices sounds ideal, except when webapps are very restricted. A lot of API's are added to make webapps more capable.

* [History](https://developer.mozilla.org/en-US/docs/Web/API/History) and [PageTransitionEvent](https://developer.mozilla.org/en-US/docs/Web/API/PageTransitionEvent) - navigate to different URL's and still stay in your single page application
* [Application cache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache) - make webpages available offline, but unfortunately, with [lots of problems](http://alistapart.com/article/application-cache-is-a-douchebag)
* [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) - let processes do its work in het background. Break out of JavaScript's single thread paradigm and use all CPU's at the same time.
* [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) - synchronise your animations with the refresh rate of your screen for smooth movements
* [Web Sockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) - makes it possible to have a prolonged, two way communication with the server
* [Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) - get notified when the user is going from or to your webpage
* [Performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) - make time measurements with a higher resolution
* [Channel messaging](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API/Using_channel_messaging) - communicate with pages in iframes, even from different domains
* [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - access local databases from your webpage
* [Cryptography](https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto) - an API to encrypt, decrypt, hash, verify and sign data within the browser
* [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) - use the power of your GPU and play, for example, impressive video games

### EcmaScript 2015

A small subset of EcmaScript 2015 (ES6) can already be used.

* [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) - Use this instead of var for constant values
* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)/[Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)/[WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) - Set and Map are standard data structures. WeakMap is like Map, but data can also be garbage collected
* [Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) - Define arrays of a certain type, for example 32 bit unsigned, very useful in combination with WebGL

### Zepto and Polymer

Now we can finally use some modern JavaScript libraries and frameworks. For example [Zepto](http://zeptojs.com/), a lightweight jQuery replacement. 

A interesting framework that can now be used is [Polymer](https://www.polymer-project.org/), build on top of [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), a set of powerful and promising web standards still in development.

### HTTP

The following two security features require changes in the webserver, so they're probably more interesting for system operators:

* [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Using_Content_Security_Policy) - prevent cross-site scripting attacks
* [HTTP Strict Transport Security (HSTS)](https://developer.mozilla.org/en-US/docs/Web/Security/HTTP_strict_transport_security) - lets the browser use https instead of http

HTTP/2, formerly SPDY, is the next version of the HTTP protocol with several improvements, so now is a good time to update your webserver.

### Other improvements

* [Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) - enable the ES5 strict mode and catch more bugs
* [SVG filters](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Filters_Tutorial) - use the powerful SVG filters like blurring and blending
* [PNG favicons](http://blogs.msdn.com/b/ieinternals/archive/2013/09/08/internet-explorer-favicons-png-link-rel-icon-caching.aspx) - it's no longer necessary to use the strange .ico format
* [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) - makes the CSS `@media` media selector available in JavaScript too
* [devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) - useful to find out whether a high screen resolution like Retina is being used
* [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) - finally a way to easily add, remove and check for classes in vanilla JavaScript
* [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/Web_Video_Text_Tracks_Format) - add subtitles to video
* [Media Source Extensions](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API) - have more control of the media that is played in an audio or video element, enables streaming audio and video

### Safari is the new IE

In the past, the features you could use on your website were limited by IE. While other browsers supported many features for years, you had to wait for support in IE before you could use them, or use workarounds or fall-backs.

Now it's the other way around and IE11 ships with some nice new features not always supported in the other browsers. The most absent browser here is Safari. Once a browser ahead of the rest, now it looks more like it takes the place IE used to have.

Features in IE11, Chrome and Firefox, but not in Safari, are:

* [Intl (Internationalization)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) - show numbers and dates in a format used in a specific country and language
* [Datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) - enable the combobox form element: type text and select from a list
* [User Timing](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API/Using_the_User_Timing_API) - like the High Resolution Time API, but more extensive
* [Resource Timing](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API) - measure very precise how long it takes to load a resource
* [Screen Orientation](https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation) - reading and locking the screen orientation is still not supported on Safari iOS.
* [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) - an ES6 addition to JavaScript to have block scoped variables in addition to the usual function scoped variables

Take a look at [caniuse.com](http://caniuse.com/) to see which features are supported in which browser.

### Conclusion

Internet Explorer and its successor Edge made great progress and catched up with the other browsers. The web platform is becoming more and more mature and the horizon of a webdeveloper becomes wider and wider. Which new features can improve the website you're working on? Share it with the rest of your team and push the web forward.


