function imgPopup( location, width, height ){
	win = window.open( '', '_blank', 'width='+width+',height='+height )
	win.document.writeln('<body style=\'margin: 0px\'><img src=\''+location+'\'></body>')
	win.document.close()
}
function install(name, xpiURL, iconURL) {
	var params = [];
	params[name] = {	URL: xpiURL,
							IconURL: iconURL,
							toString: function () { return xpiURL; }
	};
	InstallTrigger.install(params);
	return false;
}
