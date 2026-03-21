/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'Minimal-Symbol\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-home' : '&#x23;',
			'icon-tag' : '&#x7e;',
			'icon-location' : '&#x2d;',
			'icon-arrow-right' : '&#x3e;',
			'icon-box-add' : '&#x76;',
			'icon-checkmark' : '&#x56;',
			'icon-info-circle' : '&#x69;',
			'icon-mobile' : '&#x54;',
			'icon-email' : '&#x4d;',
			'icon-phone' : '&#x50;',
			'icon-search' : '&#x2a;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^s'"]+/);
		if (c) {
			addIcon(el, icons[c[0]]);
		}
	}
};