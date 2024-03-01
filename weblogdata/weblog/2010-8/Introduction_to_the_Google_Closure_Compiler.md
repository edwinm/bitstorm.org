---
title: "Introduction to the Google Closure Compiler"
date: 2010-08-08T18:35

---


	Last year, on November 5th, Google <a href="http://googlecode.blogspot.com/2009/11/introducing-closure-tools.html">released</a> three JavaScript code libraries that are used in Google's impressive webapps like GMail and Google Maps. One part of the release is the Google Closure Library at which we'll take a closer look in this article.

	The Google Closure Library can do two things. First, it can optimize and minify your JavaScript code and second, it can do code checking.

	The big advantage of minifying your JavaScript code is that there's less to download so the page using it will appear faster. And since comments are removed, it allows you to write good documented code wihout being afraid it will make your code too big.
<h2>
	Using the online Closure Compiler</h2>

	We start with some very simple JavaScript code:

```javascript
function showTotal(subtotal, shipping) {
	var total = calculateTotal(subtotal, shipping);
	showAmount(total);
}

function calculateTotal(total, shipping) {
	return total+shipping;
}

function showAmount(total) {
	document.getElementById("amount").innerHTML = "$ "+total;
}

showTotal(120, 30);
```


	We can use the <a href="http://closure-compiler.appspot.com/home">online Closure Compiler</a> to quickly see what the compiler does.

	The Closure Compiler has three levels of optimization. In the first level, it only removes white space like spaces, returns and tabs. This is the result:

```javascript
function showTotal(subtotal,shipping){var total=calculateTotal(subtotal,shipping);showAmount(total)}function calculateTotal(total,shipping){return total+shipping}function showAmount(total){document.getElementById("amount").innerHTML="$ "+total}showTotal(120,30);
```


	The second level is Simple optimization, in which local variable and function names are renamed to a shorter one.

```javascript
function showTotal(a,b){var c=calculateTotal(a,b);showAmount(c)}function calculateTotal(a,b){return a+b}
function showAmount(a){document.getElementById("amount").innerHTML="$ "+a}showTotal(120,30);
```


	The third, Advanced level, it the most aggressive. The result is as follows:

```javascript
document.getElementById("amount").innerHTML="$ 150";
```


	That's impressive, isn't it?

	The Advanced level needs some extra work when your code is using external JavaScript code or when other code is calling your minified code.

	Take for example the following script, a very simple jQuery plugin:


```javascript
jQuery.fn.data = function(name) {
	var first = $(this).eq(0);
	if (first) {
		return first.attr('data-'+name);
	}
}
```


	Compiled with Advanced level optimization, you get this:


```javascript
jQuery.c.data=function(b){var a=$(this).b(0);if(a)return a.a("data-"+b)};
```


	As you can see, the jQuery functions are shortened too. Ofcourse, this will not work. To fix this, we first have to make the Closure Compiler run on our local machine.
<h2>
	Running the Closure Compiler locally</h2>

	Since the Closure Compiler is written in Java, we'll first make sure the <a href="http://www.java.com/download/">Java Runtime Environment</a> is installed. Then we can download the <a href="http://closure-compiler.googlecode.com/files/compiler-latest.zip">compiler-latest.zip</a> and unzip it. To get an easy start, we put all files (data.js, compiler.jar and the batch/shell script below) in one directory.

```bash
java -jar compiler.jar --js data.js --compilation_level ADVANCED_OPTIMIZATIONS --warning_level QUIET > data-min.js
```


	Running the batch/shell script without any changes will produce data-min.js with the same non functional code as with the online version above.
<h2>
	Using externs</h2>

	To get functional code from the advanced level optimization, we have to supply the file containing the JavaScript that is called, in this case the jQuery source code. After copying jquery.min.js to the same directory, we can perform advanced level optimization. We only have to let the compiler know about the external JavaScript file with the --externs option:

```bash
java -jar compiler.jar --js data.js --compilation_level ADVANCED_OPTIMIZATIONS --warning_level QUIET --externs jquery.min.js > data-min.js
```


	Now he output is what we want:

```javascript
jQuery.fn.data=function(b){var a=$(this).eq(0);if(a)return a.attr("data-"+b)};
```


	With the --externs option, you have to add all files your code is calling.
<h2>
	External references</h2>

	The --externs option only works for JavaScript files your code is calling. If your code is called from another JavaScript file or even from a HTML-document or you just want to provide an API, things are a bit harder.

	Assume you have this function and you want to minimize it:

```javascript
function getData(element, name) {
	return element.getAttribute('data-'+name);
}
```


	If you optimize this with advanced level optimization, you get an empty file. The compiler "sees" that the function is never called and thinks the function can be removed.

	There are couple of ways to solve this.

	1. The way Google suggests: attach the function to the global window object like this:

```javascript
function getData(element, name) {
	return element.getAttribute('data-'+name);
}
window['getData'] = getData;
```


	Minified, it becomes:

```javascript
function a(b,c){return b.getAttribute("data-"+c)}window.getData=a;
```


	Personally, I think adding every function to the window object is very ugly. First, you pollute your own code just to get it compressed and second, you are adding code which doesn't help the minification.

	2. A better way is to use a namespace. This is a better practice anyway and prevents name collisions. Now you only have to add the namespace to the global window object. This is also what jQuery does. In JavaScript, there are many ways to create a namespace.

	If jQuery would only contain the function above, it would look like this (simplified):

```javascript
(function() {
	var jQuery = {};
	jQuery.getData = function(element, name) {
		return element.getAttribute('data-'+name);
	}
	window['jQuery'] = jQuery;
})();
```


	The resulting code is:

```javascript
(function(){var a={};a.getData=function(b,c){return b.getAttribute("data-"+c)};window.jQuery=a})();
```


	3. The last way is to not provide any API at all. You could just merge all you JavaScript code into one single minified file. It's easy and minifies very well. The Closure Compiler accepts multiple files with multiple --js parameters:

```bash
java -jar compiler.jar --js data.js --js mylib.js --js jquery-min.js --compilation_level ADVANCED_OPTIMIZATIONS --warning_level QUIET > all-min.js
```

<h2>
	Annotations</h2>

	The Google Closure Compiler can do more than only minifying. It can also do type checking. You thought type checking is not possible in JavaScript? Well, now it is. With the Closure Compiler you can annotate the types of variables and signatures of functions in comments. These comments look just like the comments used in <a href="http://jsdoc.sourceforge.net/">JSDoc</a>, so you can generate documentation with it, too.

	With annotations you effectively turn JavaScript into a strongly typed language and prevent a common source of errors from happening.

	The function we used earlier can now be written as:

```javascript
/**
* @param {!Element} element
* @param {string} name
* @return {string}
*/
function getData(element, name) {
	return element.getAttribute('data-'+name);
}
```


	The two arguments have the types Element and string and the return type is also string. The exclamation mark in front of Element means the Element object can't have the null value. So what happens if you call the annotated function with the wrong parameters? Let's call getData like this:

```javascript
getData('body', 'size');
```


	The error output you get after running the Closure Compiler is:

```
C:\Users\Edwin\Desktop\Closure Compiler Tests\cc-bat\typing.js:10: WARNING - actual parameter 1 of getData does not match formal parameter<br>
	found : string<br>
	required: Element<br>
	0 error(s), 1 warning(s), 100,0% typed
```


	A long, nicely documented list of all possible annotations can be found in the <a href="http://code.google.com/intl/nl/closure/compiler/docs/js-for-compiler.html">Annotating JavaScript</a> documentation. The Closure Compiler has type information for the most common JavaScript functions, including, for example, the W3C DOM bindings. In the <a href="http://code.google.com/p/closure-compiler/source/browse/#svn/trunk/externs%3Fstate%3Dclosed">externs</a> part of the source code, you'll find the whole list.

	There are no build in extern files for common JavaScript libraries, so you have to search for one or create one yourself. There is a <a href="http://code.google.com/p/closure-compiler/source/browse/trunk/contrib/externs">contrib directory</a> in the Closure Compiler source code where you can find a couple of contributed extern files. One of them being a extern file for jQuery.

	Using externs only work when the warning level is set to VERBOSE. So an example batch/script file using typed externs is:

```bash
java -jar compiler.jar --js data.js --externs jquery.externs.js --compilation_level ADVANCED_OPTIMIZATIONS --warning_level VERBOSE > data-min.js
```


	Even is you're not going to use the type checking feature, you should at least know about the @license or @preserve annotation. They both do the same thing: preserve the comment. This is very handy for copyright and license information.

	Windows users might be interested in a small script I wrote to minify a JavaScript file by just dragging it to this script. It already includes the Closure Compiler. Download <a href="compile-wsf.zip">compile-wsf.zip</a>.

	Do you want more information? You can read more about the <a href="http://code.google.com/intl/en/closure/compiler/">Google Closure Compiler on Google Code</a>.

