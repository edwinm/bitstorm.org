---
title: "ECMAScript2015, WebAssembly and the future of JavaScript"
tags:
- webdev
- {tag}

date: 2015-06-22T22:58
---

Last week, just after the 20th birthday of JavaScript, two important announcements have been made.
One is the approval of the [ECMAScript 2015 specification](http://www.ecma-international.org/ecma-262/6.0/) and the second one is the [WebAssembly](https://www.w3.org/community/webassembly/)
binary format.

ECMAScript 2015, the 6th edition of the specification and also known as ECMAScript 6 or ES6 for short, brings features to
JavaScript to make the language more mature, like classes, generators and modules.

The addition of classes are a bit controversial since JavaScript already supports object oriented programming with prototype inheritance. Classes are just more familiar and intuitive to most developers. With generators,
JavaScript will finally have iterators. These iterators can be asynchronous, which is pretty cool.
Modules ends the question whether you should support the synchronous [CommonJS](http://www.commonjs.org/), used by Node.js, the asynchronous [AMD](http://requirejs.org/docs/whyamd.html) or maybe [both](http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/). This is only a small selection of the improvements. The [complete list](http://es6-features.org/) is pretty long.

All major browsers already support some of the new ECMAScript features and now the specification is finalized, the rest of the specification is expected to follow soon. Microsoft, who's not really known as a quick adopter, has changed course and will release Windows 10 with a completely new browser called [Edge](https://www.microsoft.com/en-us/windows/microsoft-edge), that will support most of ECMAScript2015 right away. Of course, before we can use the new JavaScript in commercial websites, Internet Explorer 11 has to become negligible first, which will certainly take a couple of years. The same is true for mobile devices that are no longer updated.

Fortunately, there are other solutions: [transpilers](https://en.wikipedia.org/wiki/Source-to-source_compiler). With a transpiler you can convert a ECMAScript2015 script
into an ES5 script so it can be run on all modern browsers. The two transpilers with the most support are [Traceur](https://github.com/google/traceur-compiler) by Google and [Babel](http://babeljs.io/). You can integrate them in your existing toolchain and use ECMAScript2015 today. And when all your supported browsers finally support ECMAScript2015, you can just drop the transpiler from the toolchain. Many developers are using it successfully today. Be aware that Traceur and in many cases Babel too, need a runtime script which will increase the size of your web pages significantly. When you're writing for Node.js, you are lucky: you don't need a transpiler and can already use [most](https://github.com/joyent/node/wiki/es6-(a.k.a.-harmony)-features-implemented-in-v8-and-available-in-node) of ECMAScript2015.

Two well known transpilers without a focus on full ECMAScript2015 support but with their own incompatible extensions are [Coffeescript](http://coffeescript.org/) and [Typescript](http://www.typescriptlang.org/).
Typescript, by Microsoft, supports strict typing, something many developers see as a prerequisite for writing
big and complex programs. Coffeescript focuses on "the good parts" of JavaScript and also supports some of the
ECMAScript2015 features. At this moment Coffeescript and Typescript only compile to ECMAScript 5.

So what about the other [announcement](https://brendaneich.com/2015/06/from-asm-js-to-webassembly/#buried-lede), made by the inventor of JavaScript himself, Brendan Eich? WebAssembly will be
a safe binairy executable running in the JavaScript engine. It has support from Google, Microsoft and Mozilla.

But wasn't [asm.js](http://asmjs.org/) supposed to be the "assembly of the web"? According to Brendan, parsing asm.js is much slower
which can be a problem on mobile devices. There are two features which are much more compelling: non JavaScript features and support for more languages.

Brendan names three features that are needed for performance that are not supported in JavaScript and asm.js and therefore slows it down.
The first feature is multithreading, so you can use all processors and cores at the same time. JavaScript already supports [WebWorkers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers), but communication between WebWorkers is a bit devious, especially with large amount of data
which has to be copied around. This brings us to the second feature: shared memory.
With the new buffer type SharedArrayBuffer, shared memory should become possible, making the exchange of data
between processes and threads much faster. Note that there are already [experiments](https://blog.mozilla.org/javascript/2015/02/26/the-path-to-parallel-javascript/)
to bring SharedArrayBuffer to plain JavaScript. The third feature is SIMD (Single Instruction/Multiple Data). With SIMD, you can apply a instruction to a lot of data at once. Microprocessors support this already for many years, but this
powerful feature is not yet available in JavaScript. Both SharedArrayBuffer and [SIMD](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SIMD) might be added to the next version of ECMAScript.

When SharedArrayBuffer and SIMD are added to JavaScript, there's only one obstacle left for JavaScript to become
high performant: static typing. Typed arrays, which are already supported, is only one but important step
in this direction. Static typing or something similar is also planned for inclusion in the next version of ECMAScript. So when all these features are added to JavaScript anyway, how convincing for WebAssembly are these features really?

Then there's one real reason left: support for different languages. If you're fluent in a certain language, it
will be a big plus when you can use your language to target WebAssembly. Initially only C and C++ will be the supported source languages for WebAssembly but the idea is to add more languages later. When a future JavaScript with the features as described above is released, it might also become a high performance source language for WebAssembly. Then WebAssembly wil be just like JavaScript, but in binary form.

WebAssembly is not the first technology using a device independent binary format. Flash is well known, but since it isn't supported on iOS and the interfacing with JavaScript is clumsy, its future is a bit dark. Then we have MSIL from Microsoft, known from .Net and C#, which never really catched on outside of Windows. Java, which was once the
"run anywhere" language that would conquer the world, went downhill the moment it was bought by Oracle. It was removed from Windows XP, not supported in iOS, behaving as malware and now even banned from Chrome due to security issues.

Then we also have the [Portable Native Client](https://developer.chrome.com/native-client) (PNaCl) from Chrome, which is actually quite similar to WebAssembly. Integration of PNaCl with JavaScript is a bit poor, something that should be fixed in WebAssembly.
But PNaCl never really caught on. There are only a handful of programs using PNaCl, mostly games. Why adoption is so low is unclear. Maybe because it is only supported by one browser and not seen as a web technology. Most likely it is because there aren't that many
applications for which processing speed is very important. And for applications for which speed is very important, people want a native application anyway.

I can see one place where WebAssembly can succeed: portable applications. Wouldn't it be great to write an
application that runs on Windows, OSX, Linux and maybe even mobile devices? Like the promise of Java without the
disadvantages of Java. Of course these applications don't want an addressbar or back button, so a new type of browser will surface: one with only the viewport. Oh, and since the DOM is now the slowest part and operating system dependent, the interface will be replaced with canvas or even OpenGL. And then only the name WebAssembly
reveals it was once meant for the web.

