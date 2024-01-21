---
title: "Animate anything in jQuery"
date: 2010-06-09T14:27

---

<p>
	I've been using jQuery for three years now in several projects and I love it. One of the many reasons I like jQuery is its extensibility. It's very easy to write your own plugin, your own CSS pseudo selector-like filter or your own easing function.</p>
<p>
	What's less known is that you can also customize the animate function. Every jQuery-user knows you can animate all number-based CSS-properties. (Did you know you can also animate scrollTop and scrollLeft?) In this article I explain how to customize the animate function.</p>
<p>
	Customizing the animation-function is not so hard and gives you a couple of features for free: think about the fx-queue, easing, callbacks and setting the duration.</p>
<p>
	The first thing I wanted to animate was fading one color to another. It turned out John Resig himself already wrote a plugin to does just that: <a href="http://plugins.jquery.com/project/color/">Color Animations</a>.</p>
<p>
	Unfortunately, it has a bug which makes the plugin unreliable. To initialize the animation, the plugin checks for fx.state being zero. I turned out that with consecutive calls, the animation can start without fx.state being zero and as a result, the animation not performing.</p>
<p>
	My next quest was to rewrite the plugin to my liking. I fixed the bug. I added the missing borderColor, so to change the border color, it's not longer necessary to specify all four borders seperately. I also tried to keep the plugin very small.</p>
<p>
	Take a look at the result: the <a href="http://www.bitstorm.org/jquery/color-animation/">Color animation jQuery-plugin</a>.</p>
<p>
	So how can you make your own custom animation? Just like the other jQuery-customizations, it's actually quite simple. Take for example the code to animate the background color:</p>

~~~ javascript
$.fx.step.backgroundColor = function(fx) {
	if (!fx.init) {
		fx.begin = parseColor($(fx.elem).css('backgroundColor'));
		fx.end = parseColor(fx.end);
		fx.init = true;
	}
	fx.elem.style.backgroundColor = calculateColor(fx.begin, fx.end, fx.pos);
}
~~~

<p>
	Give $.fx.step a new property and assign it a function which will handle the animation. This function has one argument, say fx, which belongs to that one animation, so you can use it anyway you like. It has some properties already set. The most important are fx.elem, fx.end and fx.pos. In fx.elem you'll find the element on which the animation is applied, and in fx.end you'll find the end-value you want to animate to. fx.pos is a float, going form zero to one during the animation.</p>
<p>
	In the example above, some initialization is done at the first call of the function in an animation. Here, the begin and end values are calculated. The rest of the functions assigns the calculated value to the CSS-property of the element. The calculation looks like this:</p>

~~~ javascript
begin + pos * (end - begin)
~~~

<p>
	If the animation is called with the end-value being a string, then fx.end will be that string. So when calling a.animate({color: "#ccc"}), fx.end will be "#ccc". However, if the string starts with a number then fx.end becomes that number. So when calling a.animate({myProp: "10px 20px"}), fx.end will be 10 and you'll lose the rest of the string. To get the whole string you should look at fx.options.curAnim.myProp instead of fx.end. In this last example, myProp is a self defined property.</p>
<p>
	I thought a cool thing to animate is the new shadow CSS-property. A box shadow property consists of several parts: the color, whether it is inset, the x- and y-offset, the blur-radius and the spread-radius. All of these had to be taken into account when writing the plugin.</p>
<p>
	The result is the <a href="http://www.bitstorm.org/jquery/shadow-animation/">Shadow animation jQuery-plugin</a>.</p>
<p>
	Unfortunately, this plugin does not work in Opera and Internet Explorer. Opera has a strange bug in which you can't request the current shadow-value. Internet Explorer is miles behind and doesn't support CSS-shadows. I expect the plugin will work in Internet Explorer 9.</p>
<p>
	These two animation plugins are the first on my <a href="http://www.bitstorm.org/jquery/">list of jQuery-plugins</a>. It's my intention more will follow.</p>
<p>
	<em>Update: a couple of months after this article was published, <a href="http://api.jquery.com/category/version/1.4.3/">jQuery 1.4.3</a> was released, with better support for writing custom CSS-properties and animations. Read more about this technique called <a href="http://api.jquery.com/jQuery.cssHooks/">jQuery.cssHooks</a>.<br />
	</em></p>

