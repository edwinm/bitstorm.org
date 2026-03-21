jQuery(function($) {

	$('#button').click(function() {
		
	});

	function getFeed() {
		$.get('feeds.json', function(feed) {
			$('#feeds').attr('data-feed-url', feed.url);
			getRss();
		});
	}

	function getRss() {
		var feed = $('#feeds').attr('data-feed-url');
		var apikey = "ABQIAAAA-1ApaLEvR6NDNIyWFGKEYRQO7ssAPC1kOSPo312uC5iafqUFvBSkQ3Qt2re4PPUEKNR3PVt5d-6HkQ";
		var url = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q="+encodeURIComponent(feed)+"&num=1&key="+apikey+"&callback=?";
		$.getJSON(url, [], function(data) {
			var entry = data.responseData.feed.entries[0];
			$('#feeds').append($('<h4>').text(data.responseData.feed.title)).append($('<a>').attr('href', entry.link).text(entry.title));
			getMd5();
		});
	}

	function getMd5() {
		var url = $('#feeds a').attr('href');
		$.get('md5.php?q='+encodeURIComponent(url), function(data) {
			$('#feeds a').attr('data-md5hash', data.md5);
			getTags();
		});
	}

	function getTags() {
		var hash = $('#feeds a').attr('data-md5hash');
		var url = "http://feeds.delicious.com/v2/json/urlinfo/"+hash+"?callback=?";
		var tags = "";
		$.getJSON(url, [], function(data) {
			for(tag in data[0].top_tags) {
				tags += " &bull; "+tag;
			}
			$('#feeds').append($('<p>').html(tags));
		});
	}
});

