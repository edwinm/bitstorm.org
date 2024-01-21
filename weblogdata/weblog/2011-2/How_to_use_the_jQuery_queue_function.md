---
title: "How to use the jQuery queue function"
date: 2011-02-12T14:20

---

<p>Last week I was at a meeting of the JavaScript user group <a href="http://groups.google.com/group/amsterdam-js">Amsterdam.js</a> and Michiel Kalkman talked about the <a href="https://github.com/michiel/sequencer-js">sequencer</a> he wrote. The idea is very good: it let's you write loosely coupled software when using callbacks. Then I remembered jQuery has this same functionality build in.</p>

<h2>The problem</h2>

<p>If you've ever written code with a lot of callbacks, for example in a ajax-intensive website, it might have looked like this:</p>

~~~ javascript
function dothis {
	// do something
	someCallback( function() {
		// do more
	}); // etcetera
});
~~~

<p>Maybe your code had even more levels of callbacks. This style of code is hard to understand, hard to change, hard to debug and hard to maintain.</p>

<p>Turning every callback into a seperate, named function is a step in the right direction, but the different pieces are still very dependent on each other.</p>

<h2>The solution using queue</h2>

<p>One of the ways to write high quality code is to make your code loosely coupled. In the ideal situation, all callback functions are decoupled and don't know each others existance. With jQuery's queue function we can do exactly that. The code will look like this.</p>

~~~ javascript
$(someElement).queue(dothis).queue(dothat);

function dothis(next) {
Â Â Â  // do something
Â Â Â  someCallback( function() {
Â Â Â Â Â Â Â  next();
Â Â Â  });
}

function dothat(next) {
Â Â Â  // do more
Â Â Â  next();
}
~~~

<p>Now the functions are decoupled, so it's very easy to understand each function seperately, it's easy to replace a function and it's easy to refactor the code. In the first line, you can also easily see in which order which functions are called.</p>

<p>This approach clearly had advantages, so what are the disadvantages? One (possibly the only one) is that you can't easily pass parameters this way. You could store the parameters somewhere using jQuery's data function or in a DOM data-* attribute.</p>

<p>By default it uses the same queue that is used by the animate function, called 'fx'. If you don't want to interfere with animations, you can give your own, seperate queue name as the first parameter of the queue function.</p>

<h2>Example code using queue</h2>

<p>Of course I had to write an example to proof this really works. This example first fetches a feed url from the server, then it uses the Google Feed API to fetch and show the last feed item. Then, also with ajax, it lets the server calculate the MD5-hash of the article url, because this is needed in the last step, fetching and displaying tags assigned to this article using the Delicious API.</p>

<p>See my <a href="/jquery/queue/">jQuery queue example</a>. Don't forget to look at the JavaScript source to see the queue function in practice.</p>

<h2>Update</h2>

Update: since jQuery 1.8, the then() function works similar to the queue() function. Since then() is part of the promises interface, which can handle asynchronous functions in a more powerful way, it is recommended to use the then() instead of the queue() function. Read my article about [Deferred and promise in jQuery](/weblog/2012-1/Deferred_and_promise_in_jQuery.html) to learn about the promise interface.

