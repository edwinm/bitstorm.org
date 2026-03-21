function popup( location, width, height ){
	window.open( location, '_blank', 'scrollbars,width='+width+',height='+height )
}
function imgPopup( location, width, height ){
	var parm = "";
	if ( width > screen.availWidth ) {
		width = screen.availWidth-100;
		parm = "left=50,screenX=50,scrollbars,";
	}
	if ( height > screen.availHeight ) {
		height = screen.availHeight-100;
		parm = "left=50,screenX=50,scrollbars,";
	}
        win = window.open( '', '_blank', parm+'width='+width+',height='+height )
	win.document.writeln('<title>'+location+'</title><body style=\'margin: 0\'><img src=\''+location+'\'></body>')
	win.document.close()
}

