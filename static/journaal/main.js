/**
 * User: Edwin
 * Date: 18-jun-2010
 */

$(function() {
	$('li.link').css({'list-style': 'none'}).find('a').linkicons();
	$('a.link').linkicons();
});

/**
 * Prefix link with favicon
 *
 * @return {jQuery} jQuery
 */
jQuery.fn.linkicons = function() {
	var re = new RegExp("://([a-zA-Z0-9.-]+)");
	return this.each(function() {
		var el = $(this);
		var match = re.exec(el.attr('href'));
		if (match.length == 2) {
			el.css({
				'padding-left':20,
				'background': 'url(http://www.google.com/s2/favicons?domain='+match[1]+') no-repeat left center'
			});
		}
	});
};