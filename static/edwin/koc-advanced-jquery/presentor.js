$(function() {
	var scrollDoc = jQuery.scrollingDocument();
	$('div.slide').each(function(i) {
		var slide = $(this);
		var title = slide.find('h2:first').text();
		var div = $("<div class='sl'></div>").attr('title', title);
		var offset = slide.offset().top;
		div.click(function() {
			scrollDoc.scrollTo(offset);
		})
		$('#nav').append(div);
		slide.data('marker', div);
		slide.data('number', i);
	});

	$().keypress(function(evt) {
		if (evt.which == 32 || evt.charCode == 32) { // space
			var nextSlide = $.getCurrentSlide();
			scrollDoc.scrollTo(nextSlide.offset().top);
			evt.preventDefault();
		} else if (evt.which == 98 || evt.charCode == 98) { // b
			var nextSlide = $.getPreviousSlide();
			scrollDoc.scrollTo(nextSlide.offset().top);
			evt.preventDefault();
		}
	});

	$(window).scroll(function(evt) {
		$.setMarker();
	});

	if (window.location.hash) {
		var slide = parseInt(window.location.hash.substr(6));
		$('#nav div').eq(slide-1).click();
	}

	$.setMarker();

	// syntax highlighter
	SyntaxHighlighter.config.clipboardSwf = 'syntaxhighlighter/scripts/clipboard.swf';
	SyntaxHighlighter.config.tagName = 'code';
	SyntaxHighlighter.all();
});

/**
* Set marker
* @alias jQuery.prototype.setMarker
* @return {jQuery}
*/
jQuery.setMarker = function() {
	$('div.sl.selected').removeClass('selected');
	var currentSlide = $.getCurrentMarkerSlide();
	currentSlide.data('marker').addClass('selected');
	window.location = '#slide'+(1+currentSlide.data('number'));
};

/**
* Returns the element on which to scroll the document
* @alias jQuery.prototype.scrollingDocument
* @return {jQuery}
*/
jQuery.scrollingDocument = function() {
	if (jQuery.scrollingDocument.element)
		return jQuery.scrollingDocument.element;
	var htmlElt = $('html').get(0);
	var scrollTop = htmlElt.scrollTop;
	$('html').get(0).scrollTop = scrollTop + 1;
	if (htmlElt.scrollTop == scrollTop + 1) {
		htmlElt.scrollTop = scrollTop;
		jQuery.scrollingDocument.element = $('html');
	} else {
		jQuery.scrollingDocument.element = $('body');
	}
	return jQuery.scrollingDocument.element;

};

/**
* Get current visible slide
* @alias jQuery.prototype.getCurrentSlide
* @return {jQuery}
*/
jQuery.getCurrentSlide = function() {
	var htmlTop = jQuery.scrollingDocument().get(0).scrollTop;
	var el = null;
	$('div.slide').each(function() {
		if ($(this).offset().top > htmlTop) {
			el = $(this);
			return false;
		}
	});
	return el || $('div.slide:last');
};

/**
* Get current marker slide
* @alias jQuery.prototype.getCurrentMarkerSlide
* @return {jQuery}
*/
jQuery.getCurrentMarkerSlide = function() {
	var htmlTop = jQuery.scrollingDocument().get(0).scrollTop;
	var el = null;
	$('div.slide').each(function() {
		if ($(this).offset().top >= htmlTop) {
			el = $(this);
			return false;
		}
	});
	return el || $('div.slide:last');
};

/**
* Get previous slide
* @alias jQuery.prototype.getPreviousSlide
* @return {jQuery}
*/
jQuery.getPreviousSlide = function() {
	var htmlTop = jQuery.scrollingDocument().get(0).scrollTop;
	var el = null;
	$('div.slide').each(function() {
		if ($(this).offset().top >= htmlTop) {
			el = $(this).prev();
			return false;
		}
	});
	return el || $('div.slide:last');
};

/**
* Scroll in a component.
* @alias jQuery.prototype.scrollTo
* @param {int} OffsetPx
* @param {function} callback
* @return {jQuery}
*/
jQuery.fn.scrollTo = function(destPos, callback) {
	return this.each(function() {
		var container = $(this);

		var curPos = container.get(0).scrollTop;
		var delta = Math.ceil(Math.abs(destPos - curPos) / 10);
		goScroll();


		function goScroll() {
			if (curPos == destPos) {
				if (callback)
					callback();
				return;
			}
			if (curPos > destPos) {
				curPos -= delta;
				if (curPos < destPos)
					curPos = destPos;
			} else {
				curPos += delta;
				if (curPos > destPos)
					curPos = destPos;
			}
			container.get(0).scrollTop = curPos;
			if (container.get(0).scrollTop == curPos)
				setTimeout(goScroll, 20);
		}

	});
}