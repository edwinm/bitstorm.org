---
title: "newClass - a class like wrapper around prototypal OOP"
tags:
- webdev
- {tag}
- {tag}

date: 2013-03-24T11:11
---

I've done some JavaScript programming with both prototypal inheritance and the module pattern, both powerful concepts. What I didn't like about prototypal inheritance is the loosely coupled structure: the methods are defined seperate from the constructor. In that respect, class based languages like C++, Java and C# are more clear in my opinion.

So why not combine prototypal inheritance and the module pattern? Then all functionality is compact and you can add nice things like private functions and variables.

I created this small JavaScript library which supports the following object oriented features:

1. inheritance of methods and members
2. private functions and variables
3. public methods and members
4. static methods and members
5. calling parent methods and members (super)

In contrast to some other OOP JavaScript libraries, I stayed close to prototypal inheritance. The advantage is that built in prototypal JavaScript functionality is available:

1. The JavaScript keyword instanceof is fully supported.
2. Easy conversion from object to string with toString().
3. Economical memory consumption: an instance object only contains instance data, no methods or other data is copied into the instance object.

See [tests.js](https://github.com/edwinm/newClass/blob/master/tests.js) for examples of how to use newClass. This example are unit tests at the same time.

Here's a simple example from tests.js:

~~~ javascript
var Bird = newClass({
	// inherit from another class
	extends: Animal,
	// Override public method and member
	public: {
		sound: function() {
			return "tweet";
		},
		legs: 2
	}
});

var bird = new Bird();
~~~

Possible features to add in the future: augmentation, interfaces and ES5 object methods support.

<div style="border: 1px solid red; border-radius: 4px; padding: 10px; margin-bottom: 1em;">
Update June 25th, 2015: due to a NPM package name conflict, newClass has been renamed to mClass. The 'm' stands for the module pattern that is used. See for more information the <a href="http://www.bitstorm.org/javascript/mclass/">mClass homepage</a>.
</div>


