/**
 * Functional demopage for jQuery queue function
 * Edwin Martin <edwin@bitstorm.org>
 * February 2011
 */

jQuery(function($) {
	/**
	 * On button click, fetch and render the feed
	 */
	$('#button').click(function() {
		$('#feeds').queue(getUrl).queue(getRss).queue(getMd5).queue(getTags);
	});

	/**
	 * Get the feed-url from a local JSON-file
	 * @param next
	 */
	function getUrl(next) {
		$.get('feeds.json', function(feed) {
			$('#feeds').attr('data-feed-url', feed.url);
			next();
		});
	}

	/**
	 * Get the RSS-feed with the Google Feed API
	 * @param next
	 */
	function getRss(next) {
		var feed = $('#feeds').attr('data-feed-url');
		var apikey = "ABQIAAAA-1ApaLEvR6NDNIyWFGKEYRQO7ssAPC1kOSPo312uC5iafqUFvBSkQ3Qt2re4PPUEKNR3PVt5d-6HkQ";
		var url = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q="+encodeURIComponent(feed)+"&num=1&key="+apikey+"&callback=?";
		$.getJSON(url, function(data) {
			var entry = data.responseData.feed.entries[0];
			console.log('entry', entry)
			$('#feeds').append($('<h4>').text("Last article of "+data.responseData.feed.title))
					.append($('<a>').attr('href', entry.link).text(entry.title))
					.append($('<p>').text(entry.publishedDate));
			next();
		});
	}

	/**
	 * Calculate the MD5-hash of the url server-side for the Delicious API
	 * @param next
	 */
	function getMd5(next) {
		var url = $('#feeds a').attr('href');
		$.get('md5.php?q='+encodeURIComponent(url), function(data) {
			$('#feeds a').attr('data-md5hash', data.md5);
			next();
		});
	}

	/**
	 * Fetch the tags attached to the url
	 * @param next
	 */
	function getTags(next) {
		var hash = $('#feeds a').attr('data-md5hash');
		var url = "http://feeds.delicious.com/v2/json/urlinfo/"+hash+"?callback=?";
		var tags = "";
		$.getJSON(url, function(data) {
			for(tag in data[0].top_tags) {
				tags += " &bull; "+tag;
			}
			$('#feeds').append($('<p>').html(tags));
			next();
		});
	}
});

