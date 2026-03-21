var klokje1 = null;
var klokje2 = null;
var xpos = [-450, -450];
var voor = -1;
var xCenter;
var foto;
var fotoLumCurr = [];
var fotoLumDest = [];
function px(i) {
	return i+"px";
}
function heen() {
	if ( xpos[voor] < xCenter ) {
		xpos[voor] += 3;
		getStyle("foto"+voor).left = px(xpos[voor]);
		klokje1 = setTimeout( "heen()", 10 );
	}
}
function terug() {
	if ( xpos[1-voor] > -450 ) {
		xpos[1-voor] -= 3;
		getStyle("foto"+(1-voor)).left = px(xpos[1-voor]);
		klokje2 = setTimeout( "terug()", 10 );
	}
}
function stop() {
	clearTimeout( klokje1 );
	clearTimeout( klokje2 );
}
var klokjeText = null;
var klokjeLum = null;
var klokjeScroll = null;
var nText = 0;
var pos = 20;
var dy;
var selHeight;
var arrowHidden = true;
function textEffect() {
		if ( nText <= 100 ) {
			getStyle("mali").color = "rgb("+nText+"%, "+nText+"%, "+nText+"%)";
			getStyle("mali").top = px(200-nText/5);
		}
		if ( nText >= 100 ) {
			getStyle("edwin").color = "rgb("+(nText-100)+"%, "+(nText-100)+"%, "+(nText-100)+"%)";
			getStyle("edwin").top = px(260-(nText-100)/5);
		}
		if ( nText > 200 ) {
			showThumbnails();
			return;
		}
		klokjeText = setTimeout( "textEffect()", 10 );
		nText++;
}
var nThumb = 0;
function showThumbnails() {
	for ( var n=1; n <=14; n++ ) {
		if ( nThumb > (n-1)*30 && nThumb <= (n-1)*30+68 )
			getStyle("f"+n).left = px(nThumb-(n-1)*30-45);
	}
	klokjeThumb = setTimeout( "showThumbnails()", 10 );
	nThumb++;
}
function thumbMouseover(e) {
	var evnt = typeof event!="undefined"?event:e;
	var obj = typeof event!="undefined"?event.srcElement:e.target;
	fotoLumDest[obj.id] = 254;
	if ( klokjeLum == null )
		doLum();
}
function thumbMouseout(e) {
	var evnt = typeof event!="undefined"?event:e;
	var obj = typeof event!="undefined"?event.srcElement:e.target;
	fotoLumDest[obj.id] = 128;
	if ( klokjeLum == null )
		doLum();
}
function thumbDown(e) {
	var evnt = typeof event!="undefined"?event:e;
	var obj = typeof event!="undefined"?event.srcElement:e.target;
	obj.style.marginTop = "2px";
}
function thumbClick(e) {
	var evnt = typeof event!="undefined"?event:e;
	var obj = typeof event!="undefined"?event.srcElement:e.target;
	obj.style.marginTop = "0";
	laad( obj.id+".jpg" );
	return false;
}
function doLum() {
	var done = true;
	for ( var id in  fotoLumCurr ) {
		if ( fotoLumCurr[id] > fotoLumDest[id] ) {
			fotoLumCurr[id] -= 2;
			getStyle(id).borderColor = "rgb("+fotoLumCurr[id]+", "+fotoLumCurr[id]+", "+fotoLumCurr[id]+")";
			done = false;
		} else if ( fotoLumCurr[id] < fotoLumDest[id] ) {
			fotoLumCurr[id] += 2;
			getStyle(id).borderColor = "rgb("+fotoLumCurr[id]+", "+fotoLumCurr[id]+", "+fotoLumCurr[id]+")";
			done = false;
		}
	}
	if ( done )
		klokjeLum = null;
	else
		klokjeLum = setTimeout( "doLum()", 10 );
}
function laad( nFoto ) {
	stop();
	voor = 1-voor;
	terug();
	if ( foto != nFoto || xpos[1-voor] == -450) {
		getStyle("foto"+voor).zIndex = 1;
		getStyle("foto"+(1-voor)).zIndex = 0;
		document.getElementById("fotoimg"+voor).src = nFoto;
		foto = nFoto;
	} else {
		xpos[voor] = -450;
		getStyle("foto"+(voor)).left = px(-450);
	}
}
function getStyle( layer ) {
	if( document.getElementById )
		return document.getElementById( layer ).style;
	else if( document.all )
		return document.all[layer].style;
	else
		return document[layer];
}
function scroll() {
	if ( pos+dy > 20 ) {
		getStyle("up").display = "none";
		arrowHidden = true;
		return;
	}
	if ( pos+dy < getDocumentHeight()-1060 ) {
		getStyle("down").display = "none";
		arrowHidden = true;
		return;
	}
	if ( arrowHidden ) {
		document.getElementById("up").src = "arrow-up.png";
		getStyle("up").display = "block";
		document.getElementById("down").src = "arrow-down.png";
		getStyle("down").display = "block";
		arrowHidden = false;
	}
	pos += dy;
	getStyle("selectie").top = px(pos);
	getStyle( "selectie" ).clip='rect('+(20-pos)+'px auto '+(selHeight-pos)+'px auto)';
	klokjeScroll = setTimeout( "scroll()", 40 );
}
function upMouseover() {
	dy = 2;
	scroll();
	document.getElementById("up").src = "arrow-up-sel.png";
}
function upMouseout() {
	document.getElementById("up").src = "arrow-up.png";
	clearTimeout( klokjeScroll );
}
function downMouseover() {
	dy = -2;
	scroll();
	document.getElementById("down").src = "arrow-down-sel.png";
}
function downMouseout() {
	document.getElementById("down").src = "arrow-down.png";
	clearTimeout( klokjeScroll );
}
function getDocumentHeight() {
	return document.body.clientHeight||document.body.offsetHeight||window.innerHeight||document.documentElement.offsetHeight;
}
function setCenter() {
	xCenter = 100+((document.body.clientWidth||document.body.offsetWidth||window.innerWidth)-100-450)/2;
	yCenter = (getDocumentHeight()-675)/2;
	if ( voor != -1 && xpos[voor] != -450 ) {
		xpos[voor] = xCenter;
		getStyle("foto"+voor).left = px(xCenter);
	} else {
		voor = 0;
	}
	
	var yc = px(yCenter);
	var foto0style = yc;


	foto0style.top = px(yCenter);
	getStyle("foto1").top = px(yCenter);
	getStyle("mali").left = px(100+((document.body.clientWidth||document.body.offsetWidth||window.innerWidth)-100-118)/2);
	getStyle("edwin").left = px(100+((document.body.clientWidth||document.body.offsetWidth||window.innerWidth)-100-238)/2);
	selHeight = getDocumentHeight()-20;
	if ( pos > 20 || pos < getDocumentHeight()-1060 ) {
		pos = 20;
		getStyle("selectie").top = px(pos);
		getStyle("up").display = "none";
		document.getElementById("down").src = "arrow-down.png";
		getStyle("down").display = "block";
		arrowHidden = true;
	}
	getStyle("selectie").clip = "rect("+(20-pos)+"px auto "+(selHeight-pos)+"px auto)";
	getStyle("down").top = px(getDocumentHeight()-55);
}
function init() {
	for ( var n=1; n <=14; n++ ) {
		getStyle("f"+n).top = px(74*(n-1)+8);
		document.getElementById("f"+n).onmouseover = thumbMouseover;
		document.getElementById("f"+n).onmouseout = thumbMouseout;
		document.getElementById("f"+n).onclick = thumbClick;
		document.getElementById("f"+n).onmousedown = thumbDown;
		document.getElementById("up").onmouseover = upMouseover;
		document.getElementById("up").onmouseout = upMouseout;
		document.getElementById("down").onmouseover = downMouseover;
		document.getElementById("down").onmouseout = downMouseout;
		fotoLumCurr["b"+n] = fotoLumDest["b"+n] = 128;
	}
	setCenter();
	textEffect();
	document.getElementById("fotoimg0").onload = heen;
	document.getElementById("fotoimg1").onload = heen;
}
window.onload=init;
window.onresize=setCenter;
