$(function() {
	$('#naaldbomen li');
	$().an
});


/** 
* Select items by changing the width
* @alias jQuery.animatedSelector
* @return {jQuery}
*/
jQuery.fn.animatedSelector = function() {
	return this.each(function() {
		$(this).toggle(
			function() {
				$(this).animate({width: 130});
			},
			function() {
				$(this).animate({width: 100});
			}
		);
	});
};
