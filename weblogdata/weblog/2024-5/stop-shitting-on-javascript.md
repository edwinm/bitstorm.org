---
title: "Stop shitting on JavaScript"
date: 2024-05-31T12:39
media:
  - image: "javascript-cube.png"
    caption: ""
    alt: "Yellow cube with JS" 
---

Take this tweet from Theo Browne, with 140k followers.

<a href="https://twitter.com/t3dotgg/status/1793457195964862632" style="--content-width: 30rem; display: flex; justify-content: center">
{% image 'theo-tweet.png', 'Never mind, Javascript was a mistake, what do I learn now instead?', 'Math.min() > Math.max() is true and Math.min() < Math.max() is false', 800 %}
</a>

In the next tweet he explains it, but his "Javascript was a mistake" still stands.

It's not about Theo, but about the general sentiment that JavaScript is a terrible language.
If it's not the social media posts about JavaScript, it's the comments below them
that are shitting on JavaScript.

Is JavaScript really that bad? Let's investigate this.

I've analysed many posts claiming JavaScript is a bad language.
I'll go through all disadvantages of JavaScript and analyse them below.

### Weak typing and implicit type conversion

The main drawback of JavaScript is weak typing and implicit type conversion.

This piece of code is often used to show how "terrible" JavaScript is:

```javascript
[] + [] // result: ""

[] + {} // result: [object Object]

{} + [] // result: 0

{} + {} // result: NaN
```

At first sight, this indeed looks crazy. But if you understand that `{}` at the beginning of a line is an empty code block and
if you understand a little about how the `+` operator works and how type conversion works then the result totally makes sense.

Why is JavaScript weakly typed? In an [interview with Brendan Eich](https://thenewstack.io/brendan-eich-on-creating-javascript-in-10-days-and-what-hed-do-differently-today/),
the creator of JavaScript, he says that
a colleague wanted the ability to compare a number to a string containing a number.
Brendan worried this would break the _equivalence relation property_.
Someone else said this could be fixed with a new equality operator.
_"Don't worry about it. There are Lisps that have five kinds of equality operators."_
Looking back, Brendan regrets allowing this.

Weak typing makes it easier for novice programmers because they don't need to know anything about typing yet.
Experienced JavaScript programmers know how weak typing and type conversion work and it has no surprises for them.
They also usually use linters to solve weak typing related problems.
Switching to TypeScript is also a solution.

In the linter ESLint the rule [eqeqeq](https://eslint.org/docs/latest/rules/eqeqeq) can be applied that warns when `==` is used instead of `===`
or `!=` instead of `!==`. This will greatly reduce possible problems with weak typing.

There is a large group of intermediate JavaScript programmers who are in between beginner and experienced.
For them, weak typing can give unexpected results.
It is highly advisable for them to delve into weak typing and implicit type conversion
and use a linter like ESLint to close the gap.

### Automatic Semicolon Insertion

To make JavaScript friendly for beginners, semicolons are optional.
Semicolons are added automatically at the end of a line when it's not there.

Take a look at this example code.

```javascript
function example() {
    return
        "example"
}
```

Automatic Semicolon Insertion will internally convert this code to:

```javascript
function example() {
    return;
        "example";
}
```

Here, a semicolon will be inserted after the `return` keyword, so this function will return `undefined` instead of `"example"`.

Again, this can be confusing for programmers who don't know about this.

The solution is to close the knowledge gap and to use auto formatting tools like Prettier.

### undefined versus null

From the ECMAScript specification:

`null` is the primitive value that represents the intentional absence of any object value.

`undefined` is the primitive value used when a variable has not been assigned a value.

So you can still make a distinction between objects and primitive values even when they
have no value. This might not be useful for everybody, but to say this distinction makes JavaScript
a horrible language is quite a stretch.

### Floating point

Some people make fun of JavaScript because it can't count.

```javascript
0.1 + 0.2 // result: 0.30000000000000004
```

Except this has nothing to do with JavaScript, but with IEEE 754, the standard for floating point numbers
that is implemented in processors. This problem occurs in all modern programming languages.

### Const is not constant

This is valid code in JavaScript.

```javascript
const person = { name: 'Mark', age: 48 };
person.name = 'Eric';
```

"How is it possible to change a 'const'? JavaScript is a stupid language."

No. The `const` only indicates that the `person` variable cannot be assigned any other value.
The content can still be changed. This works exactly the same in most (all?)
modern programming languages.

### Issues in old JavaScript

Then we have the following "disadvantages" of JavaScript:

- Default global var
- Callback hell
- Complex prototypical inheritance
- Prototypal inheritance
- No parallel computing

These problems were solved years ago with EcmaScript 2015 (ES6).

They are still in the language because JavaScript must remain backwards compatible
because otherwise old websites will be broken.

The solution is very simple: don't use these old features and use modern features instead.

### Dog whistle

A [quote](https://www.quora.com/Why-do-so-many-people-seem-to-hate-JavaScript/answer/Tim-Mensch?no_redirect=1) from Tim Mensch has another angle:

> Like PHP, JavaScript is a language “good” developers love to hate. It’s a signal that you’re part of the “cool” group, a dog whistle. So people rag on it to show how awesome they are. (I, ahem, may know about this particular fact, because I may have been one of those developers, once upon a time…)

## Conclusion

Only one less ideal feature of JavaScript remains: weak typing and the associated implicit type conversion.

This problem can largely be solved with [more knowledge](https://tc39.es/ecma262/#sec-abstract-operations) about this and good tooling.
If you really want to have good control over types, you can use TypeScript.

Don't forget that every programming language has less than ideal features.
And JavaScript has very powerful features that are (or were) missing in other (scripting) languages
such as Closures, [First-class functions](https://en.wikipedia.org/wiki/First-class_function) and
support for easy asynchronous programming without concurrency issues.

Repeating the story that JavaScript is horrible is not only false,
but gives junior and medior JavaScript developers the idea that they are working with an inferior language and
that their work is therefore also inferior. That is of course pure nonsense.

I can best end this article with this beautiful quote from Bjarne Stroustrup, the creator of C++.

> There are only two kinds of programming languages: the ones people complain about and the ones nobody uses.




