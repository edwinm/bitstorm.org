//
// Copyright 2001-2009 Edwin Martin
//
$(function() {
	$('#titel').waveEffect();
	$('#nav select').selectGo();
	$('#fotojolie').imgPopup(500, 484);
	$('#journaal').renderFeed('/rss.xml');
	$('#weblog').renderFeed('/weblog/rss.xml');
});

jQuery.fn.selectGo = function() {
	return this.each(function() {
		$(this).bind('change', function() {
			open(this.options[this.selectedIndex].value, '_self');
			this.selectedIndex = 0;
		});
	});
};

jQuery.fn.popup = function(location, width, height) {
	return this.each(function() {
		$(this).click(function() {
			window.open( location, '_blank', 'scrollbars,width='+width+',height='+height );
			return false;
		});
	});
};

jQuery.fn.imgPopup = function(width, height) {
	return this.each(function() {
		$(this).click(function() {
			var win = window.open( '', '_blank', 'width='+width+',height='+height )
			win.document.writeln('<body style=\'margin: 0px\'><img src=\''+$(this).attr('href')+'\'></body>')
			win.document.close()
			return false;
		});
	});
};

jQuery.fn.renderFeed = function(location) {
	return this.each(function() {
		var el = $(this);
		$.get(location, function(data) {
			var ul = $.create('ul');
			$('rss channel item', data).each(function(i) {
				var a = $.create('a', {href: $('link', this).text()}).text($('title', this).text());
				var li = $.create('li');
				li.append(a);
				ul.append(li);
			});
			el.append(ul);
		})
	});
};

jQuery.fn.renderTwitter = function(data) {
	return this.each(function() {
		var ul = $.create('ul');
		$.each(data, function(i) {
			if (data[i].text.charAt(0) != '@') {
				ul.append($.create('li').html(
					data[i].text
					.replace(/&/, '&amp;')
					.replace(/</, '&lt;')
					.replace(/(https?:\/\/[a-zA-Z0-9\/\&\?=\[\]%~#;\$\-_\+!\*',":\.\(\)]+[a-zA-Z0-9\/\&\?=\[\]%~#;\$\-_\+!\*',":]{2})/, '<a href=\'$1\'>$1</a>')
					.replace(/@([0-9a-zA-Z_-]+)/, '<a href=\'http://twitter.com/$1\'>@$1</a>')));
			}
		});
		$(this).append(ul);
	});
};

jQuery.create = function(tag, parms, context) {
	return $(jQuery.extend((context||document).createElement(tag), parms));
};

jQuery.fn.waveEffect = function() {
	return this.each(function() {
		var waveTimer, mousex, mousey;
		var t = this;
		var $t = $(this);
		if(document.all && t.filters.item(0)) {
			$t.mouseover(startWave);
			$t.mouseout(stopWave);
			$t.bind('mousemove', mouseMove);
			t.filters.item(1).addAmbient(255,255,255,50);
			t.filters.item(1).addPoint(0,10,2,255,255,255,100);
		}
		
		function startWave() {
			t.filters.item(0).enabled = true;
			t.filters.item(1).enabled = true;
			waveTimer = setInterval(doWave, 70);
		}
		function stopWave() {
			clearInterval(waveTimer);
			t.filters.item(0).enabled = false;
			t.filters.item(1).enabled = false;
		}
		function doWave() {
			t.filters.item(0).phase = t.filters.item(0).phase + 10;
			t.filters.item(1).moveLight(1, mousex, mousey, 50, 1)
		}
		function mouseMove(event){
			mousex=event.clientX;
			mousey=event.clientY
		}
	});
};

function showTwitter(data) {
	$('#twitter').renderTwitter(data);
}
