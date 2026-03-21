$(function() {
	if ($.browser.msie && $.browser.version < 8) {
		alert("Helaas, u gebruikt een verouderde browser. Gebruik a.u.b een moderne browser zoals Internet Explorer 8, Firefox, Chrome of Safari");
	}
	$('#slider li').click(function() {
		var li = $(this);
		var a = li.find('a');
		$('#slider li.selected').removeClass('selected');
		li.addClass('selected');
		$('#large img').attr('src', a.attr('href'));
		if (a.attr('data-new')) {
			$('#new img').attr('src', a.attr('data-new'));
			$('#switch').show();
		} else {
			$('#switch').hide();
		}
		$('#new img').hide();
		$('#old img').show();
		$('#switch').removeClass('new');
		if (a.attr('title')) {
			$('#desc').text(a.attr('title')).show();
		} else {
			$('#desc').text('').hide();
		}
		adjustSlider();
		setNavButtons();
		return false;
	});
	$('#back').click(function() {return move(-1)});
	$('#forward').click(function() {return move(1)});
	$('#switch').click(function() {
		var schakel = $(this);
		schakel.toggleClass('new');
		if (schakel.hasClass('new')) {
			$('#old img').fadeOut();
			$('#new img').fadeIn();
		} else {
			$('#old img').fadeIn();
			$('#new img').fadeOut();
		}
		return false;
	});

	function move(d) {
		var len = $('#slider li').size();
		var curIndex = $('#slider li.selected').index();
		curIndex += d;
		if (curIndex >= 0 && curIndex < len) {
			$('#slider li').eq(curIndex).click();
		}
		return false;
	}

	function adjustSlider() {
		var curLi = $('#slider li.selected');
		var curLiX = curLi.position().left;
		var slideX = $('#slider').attr('scrollLeft');
		if (curLiX < 0) {
			$('#slider').stop().animate({'scrollLeft': slideX + curLiX - 10}, 300);
		} else if(curLiX + curLi.width() > 1000) {
			$('#slider').stop().animate({'scrollLeft': slideX - 1000 + curLiX + curLi.width() + 10}, 300);
		}
	}

	function setNavButtons() {
		var len = $('#slider li').size();
		var curIndex = $('#slider li.selected').index();

		if (curIndex <= 0) {
			$('#back').addClass('disabled')
		} else {
			$('#back').removeClass('disabled')
		}

		if (curIndex >= len - 1) {
			$('#forward').addClass('disabled')
		} else {
			$('#forward').removeClass('disabled')
		}
	}
});

$.fx.step.scrollLeft = function(fx) {
    if (!fx.init) {
        fx.begin = fx.elem.scrollLeft;
        fx.init = true;
    }

    fx.elem.scrollLeft = fx.begin + (fx.end - fx.begin) * fx.pos;
}