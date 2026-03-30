// Misc. JavaScripts. Copyright E. Martin 1998, 1999
// edwin@bitstorm.org

if(top.frames.length!=0)
	top.location=self.document.location;

function popUpImg(img,width,height,text,bgcolor,window) {
	if(navigator.userAgent.indexOf( "MSIE 3." )==-1){
		var win=open('',window?window:'_blank','resizable=no,scrollbars=no,status=no,width='+(width+16)+',height='+(height+16));
		win.focus();
		win.document.clear();
		win.document.writeln("<html>\n<head>\n<title>"+(text?text:"View image "+img)+"</title>\n</head>\n<body"+(bgcolor?" bgcolor="+bgcolor:"")+">\n<img src=\""+img+"\">\n</body></html>");
		win.document.close();
	}
	return false;
}

function imgPopup( location, width, height ){
	win = window.open( '', '_blank', 'width='+width+',height='+height );
	win.document.writeln('<body style=\'margin: 0px\'><img src=\''+location+'\'></body>');
	win.document.close();
	return false;
}