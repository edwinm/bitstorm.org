---
title: "twitterFetch: show your tweets the way you want"
date: 2016-05-01T12:12

---

A nice way to let visitors of your website know about your twitter feed, is to show your latest tweet.

Fortunately, Twitter provides several means to do this. One is the Twitter Widget. Aside from changing some colours, you can't change much of the layout. The second is the Twitter REST API, which gives you a lot of control, but you need a script on the server side.

I don't want to use a server side script, but I do want full control. So none of Twitter's options are suitable for me. So I created twitterFetch, a JavaScript that can be included on your webpage. It will fetch the HTML that's meant for the widget, extracts all tweets and makes them available in JavaScript, ready to do what you want.

The script even provides some options: you can prevent loading images that you won't show, prevent making the text HTML-save and making links and usernames into hyperlinks, so you can click them.

Here's some example code:

~~~javascript
twitterFetch.fetch('345615146724495360', {}, function (tweets) {
	if (!tweets || tweets.length == 0) {
		return;
	}
	document.getElementById('tweets').innerHTML = tweets[0];
});
~~~

But don't use the widget id 345615146724495360, that belongs to my own [@edwinmdev](https://twitter.com/edwinmdev) Twitter account.
 
To get your own widget id, create a [Twitter widget](https://twitter.com/settings/widgets/new) and look at the generated code. You'll find data-widget-id="..." with the number you can use.

Since this script is using the Twitter Widget in a way that's not supported by Twitter, there's no guarantee that the script will still work tomorrow.

You can fetch [twitterFetch](https://github.com/edwinm/twitterFetch) from GitHub, or you can install [twitterfetch](https://www.npmjs.com/package/twitterfetch) from npm:

~~~bash
npm install twitterfetch
~~~

You can find all (updated) information on the [twitterFetch page](http://www.bitstorm.org/javascript/twitterfetch/).

The script is MIT licensed, so you're free to use, copy and modify the code.
