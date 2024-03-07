---
title: "Deferred and promise in jQuery"
date: 2012-01-25T21:19

---

Deferred and promise? What is this article about? Deferred and promise are part of jQuery since version 1.5 and they help in handling asynchronous functions like Ajax.

Let's do a step back in time. A time without iPod or Xbox or Facebook. If you wanted to catch a mouseclick, you did it with `element.onclick = someFunction;` This became a problem when another part of the code also wanted to listen to this click. This was not possible, because you could only assign one function. This was solved at the time with the addEventListener DOM function. With this, you can add as many listener functions as you want. Since then, that's the way we know how to do this.

Now we have a similar problem with Ajax calls. This time it's not the events, but the fact that Ajax supports only one callback function. Not only the jQuery $.ajax() call, but also the underlying XMLHttpRequest object.

### Promise

Until jQuery 1.5, a typical $.ajax() call looked like this:

```javascript
$.ajax({
  url: "/myServerScript",
  success: mySuccessFunction,
  error: myErrorFunction
});
```

The $.ajax() call returns a jQuery XMLHttpRequest object. Nothing new so far.

Since version 1.5, the returned object implements the [CommonJS Promises/A interface](http://wiki.commonjs.org/wiki/Promises/A). That's a mouth full. CommonJS is a initiative to define common and independent interfaces (API's). Promises/A is one such interface. The advantage is that these are not jQuery specific. For example, if you work with Node.js, there is a good chance you'll program with this same interface. That's good.

The way of assigning callbacks with Promises is quite different:

```javascript
var promise = $.ajax({
  url: "/myServerScript"
});

promise.done(mySuccessFunction);
promise.fail(myErrorFunction);
```

You can combine the done() and fail() functions in one then() function. The code above can be rewritten as:

```javascript
var promise = $.ajax({
  url: "/myServerScript"
});

promise.then(mySuccessFunction, myErrorFunction);
```

â€œOkay, the interface has changed, so what's in it for me?â€, you might ask.

The advantages of promises are:

1) You can call the done() and fail() functions more times, with different callbacks. Maybe you have a callback function that stops an animation, one that does a new Ajax call and another function that shows the received data to the visitor.


```javascript
var promise = $.ajax({
  url: "/myServerScript"
});

promise.done(myStopAnimationFunction);
promise.done(myOtherAjaxFunction);
promise.done(myShowInfoFunction);
promise.fail(myErrorFunction);
```

2) Even after the Ajax call has finished, you can still call the done() and fail() functions and the callbacks are executed immediately. So no messing around with variables holding different states. When a Ajax call has finished, it will end up in either the success state or the failed state and this state will not change.

3) You can combine promises. Sometimes you need to do two simultaneous Ajax calls and you want to execute a function when both are successfully finished. To do this, you use the new $.when() function.

```javascript
var promise1 = $.ajax("/myServerScript1");
var promise2 = $.ajax("/myServerScript2");

$.when(promise1, promise2).done(function(data1, data2) {
  // Handle data from both Ajax calls
});
```

4) Since jQuery 1.8, you can chain the then() function sequentially. In the code below, first promise1 is run and when resolved successfully, getStuff is run, returning a promise and when this is resolved successfully, the anonymous function is executed.

```javascript
var promise1 = $.ajax("/myServerScript1");

function getStuff() {
    return $.ajax("/myServerScript2");
}

promise1.then(getStuff).then(function(myServerScript2Data){
  // Both promises are resolved
});
```

Every callback function receives the result of the previous asynchronous function,
in the case of Ajax, that would be the returned data.


### Deferred

So what is a deferred and what is the difference with a promise? As you have seen above, a promise is an object that is returned from an asynchronous function. You need a deferred when you write such a function yourself.

A deferred object can do the same as a promise object, but it has two functions to trigger the done() and fail() functions.

A deferred object has a resolve() functions for a successful result and to execute the functions assigned with done(). The reject() function is for a failed result and executes the functions assigned with fail().

You can give parameters to both the resolve() and reject() functions and they will be passed on to the functions registered with done() and fail().

The promise object does not have resolve() or reject() functions. This is because you give the promise away to other scripts and you don't want them to resolve or reject the promise.

Below is a simple script that illustrates how it works. The html is just an empty div with id "result".

```javascript
$('#result').html('waiting...');

var promise = wait();
promise.done(result);

function result() {
  $('#result').html('done');
}

function wait() {
  var deferred = $.Deferred();

  setTimeout(function() {
    deferred.resolve();
  }, 2000);

  return deferred.promise();
}
```

You can also find this script on [jsFiddle](http://jsfiddle.net/TT3G5/), so that you can experiment with it yourself.

The wait() function is the function returning a promise. This will be resolved with a setTimeout of two seconds. Instead of setTimeout, everything can be used that is asynchronous, like animations, Web workers etcetera. It should be clear that inside the wait() function, we use the deferred object, but we return the limited promise object.

### Criticism

Domenic Denicola wrote the article [You're Missing the Point of Promises](https://gist.github.com/3889970) in which he criticizes jQuery's implementation of Promises/A. Take for example the following code:

```javascript
promise.then(fn1).then(fn2).then(fn3, fail);
```

If an error is thrown in fn1, the fail function should be called. This is a very nice way to handle errors in asynchronous functions. This does not work in jQuery and the writer sees this as a major shortcoming of jQuery.

If you want to use "pure" Promises/A, you better use promises introduced in ECMAScript2015. For [browsers that don't support ECMAScript promises](http://caniuse.com/#feat=promises), you can use [native-promise-only](https://github.com/getify/native-promise-only) polyfill by Kyle Simpson (getify).

<i>Update July 15th, 2015: jQuery 3.0 will fix this problem: <a href="http://blog.jquery.com/2015/07/13/jquery-3-0-and-jquery-compat-3-0-alpha-versions-released/">jQuery.Deferred is now Promises/A+ compatible</a> and errors thrown can now be catched in a catch() method.</i>

### Other possibilities

This article is just an introduction to the deferred object. jQuery supports even more functions. Look at the [jQuery deferred documentation](http://api.jquery.com/category/deferred-object/) for all possibilities. It is, for example, possible to track the progress of a process.

You want to know more about deferreds and promises? <a href="http://www.amazon.com/gp/product/1449369391/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1449369391&linkCode=as2&tag=webontwikkela-20&linkId=WZLUN2467MS2B3BL" rel="nofollow">Buy <i>Learning jQuery Deferreds: Taming Callback Hell with Deferreds and Promises</i> by Terry Jones at Amazon</a> (affiliate link).

---------------------------------------

*This article is originally [posted in Dutch](http://fronteers.nl/blog/2011/12/deferred-en-promise-in-jquery) for the Fronteers Advent Calendar. Fronteers is the Dutch organisation of front end developers.*
