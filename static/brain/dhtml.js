// DHTML Object
// Copyright Edwin Martin 2002
// http://www.bitstorm.org/edwin/cursus/dhtml.html

var obj = new Array();

function Layer( layerName ) {
	this.name = layerName;
	this.style = getStyle( layerName );
	this.object = getObject( layerName );
	this.destX = 0;
	this.destY = 0;
	this.orgX = 0;
	this.orgY = 0;
	this.moveTime = 0;
	this.step = 0;
	this.timer = null;
	obj[layerName] = this;
}

function getStyle( layer ) {
	if( document.getElementById )
		return document.getElementById( layer ).style
	else if( document.all )
		return document.all[layer].style
	else
		return document[layer]
}

function getObject( layer ) {
	if( document.getElementById )
		return document.getElementById( layer )
	else if( document.all )
		return document.all[layer]
	else
		return document[layer]
}

function initObjects() {
	for ( i=arguments.length-1; i >= 0; i-- )
		new Layer( arguments[i] );
}

function pixels( p ) {
	return document.layers?p:p+"px";
}

Layer.prototype.setPosition = function ( x, y ) {
	this.style.left = pixels(x);
	this.style.top = pixels(y);
}

Layer.prototype.hidden = function () {
	this.style.visibility = "hidden";
}

Layer.prototype.visible = function () {
	this.style.visibility = "visible";
}

Layer.prototype.clip = function ( top, right, bottom, left ) {
	if( document.getElementById || document.all )
		this.style.clip='rect('+top+'px '+right+'px '+bottom+'px '+left+'px)';
	else {
		this.style.clip.top = top;
		this.style.clip.left = left;
		this.style.clip.bottom = bottom;
		this.style.clip.right = right;
	}
}

Layer.prototype.setZIndex = function ( z ) {
	this.style.zIndex = z;
}

Layer.prototype.setBackgroundColor = function ( color ) {
	if( document.getElementById || document.all )
		this.style.backgroundColor = color;
	else
		this.style.bgColor = color;
}

Layer.prototype.setBackgroundImage = function ( imageUrl ) {
	if( document.getElementById || document.all )
		this.style.backgroundImage = "url("+imageUrl+")";
	else
		this.style.background.src = imageUrl;
}


Layer.prototype.writeText = function ( text ) {
	if( document.getElementById || document.all )
		this.object.innerHTML = text;
	else {
		this.object.document.open();
		this.object.document.write( text );
		this.object.document.close();
	}
}

Layer.prototype.setOnMouseDownHandler = function( fn ) {
	if( document.layers )
		this.object.captureEvents(Event.MOUSEDOWN);
	this.object.onmousedown = fn;
}

Layer.prototype.setOnMouseUpHandler = function( fn ) {
	if( document.layers )
		this.object.captureEvents(Event.MOUSEUP);
	this.object.onmouseup = fn;
}

Layer.prototype.setOnMouseMoveHandler = function( fn ) {
	if( document.layers )
		this.object.captureEvents(Event.MOUSEMOVE);
	this.object.onmousemove = fn;
}

Layer.prototype.setOnMouseOverHandler = function( fn ) {
	if( document.layers )
		this.object.captureEvents(Event.MOUSEOVER);
	this.object.onmouseover = fn;
}

Layer.prototype.setOnMouseOutHandler = function( fn ) {
	if( document.layers )
		this.object.captureEvents(Event.MOUSEOUT);
	this.object.onmouseout = fn;
}

Layer.prototype.moveTo = function( x, y, time ) {
	if ( isNaN( time ) )
		time = 2;
	clearTimeout( this.timer );
	this.orgX = this.getLeft();
	this.orgY = this.getTop();
	this.destX = x;
	this.destY = y;
	this.moveTime = time*1000;
	this.step = 0;
	this.move();
}

Layer.prototype.zwerfBounds = function( top, right, bottom, left ) {
	this.boundsTop = top;
	this.boundsRight = right;
	this.boundsBottom = bottom;
	this.boundsLeft = left;
}

Layer.prototype.zwerf = function() {
	var newX, newY, dX, dY;
	dX = Math.floor(Math.random()*3-1);
	dY = Math.floor(Math.random()*3-1);
	newX = this.getLeft() + dX;
	newY = this.getTop() + dY;
	if ( newX <= this.boundsRight && newX >= this.boundsLeft && newY <= this.boundsBottom && newY >= this.boundsTop )
		this.setPosition( newX, newY );
	this.timer = setTimeout( "obj."+this.name+".zwerf()", 40 );
}

Layer.prototype.move = function() {
	var newX, newY;
	if ( this.step >= this.moveTime/40 ) {
		this.setPosition( this.destX, this.destY );
		return;
	}
	newX = this.orgX + (this.destX-this.orgX)*this.step*40/this.moveTime;
	newY = this.orgY + (this.destY-this.orgY)*this.step*40/this.moveTime;
	this.setPosition( newX, newY );
	this.step++;
	this.timer = setTimeout( "obj['"+this.name+"'].move()", 40 );
}

Layer.prototype.stop = function() {
	clearTimeout( this.timer );
}

Layer.prototype.getLeft = function() {
	return parseInt(this.style.left);
}

Layer.prototype.getTop = function() {
	return parseInt(this.style.top);
}

Layer.prototype.getWidth = function() {
	return parseInt(this.style.width) || this.style.clip.width;
}

Layer.prototype.getHeight = function() {
	return parseInt(this.style.height) || this.style.clip.height;
}

Layer.prototype.filterApply = function( n ) {
	if( this.filterEnabled( n ) )
		this.object.filters[n].Apply();
}
Layer.prototype.filterPlay = function( n ) {
	if( this.filterEnabled( n ) )
		this.object.filters[n].Play();
}

Layer.prototype.filterEnabled = function( n ) {
	return window.ActiveXObject && this.object.filters && this.object.filters[n];
}

function mouseX( event ) {
	if ( document.layers )
		return event.pageX;
	else {
		if ( isFinite(window.pageXOffset) )
			return window.pageXOffset+event.clientX;
		else if ( document.body.scrollLeft )
			return document.body.scrollLeft+window.event.clientX;
		else
			return document.documentElement.scrollLeft+window.event.clientX;
	}
}

function mouseY( event ) {
	if ( document.layers )
		return event.pageY;
	else {
		if ( isFinite(window.pageYOffset) )
			return window.pageYOffset+event.clientY;
		else if ( document.body.scrollTop )
			return document.body.scrollTop+window.event.clientY;
		else
			return document.documentElement.scrollTop+window.event.clientY;
	}
}
