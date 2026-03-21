// scmbrlae.js
// Copyright 2003 Edwin Martin <edwin@bitstorm.org>
// http://www.bitstorm.org

function traverse( node ) {
	if( node.nodeType == 3)
		node.nodeValue = scramble( node.nodeValue );
	else
		for ( var elt=node.childNodes.length-1; elt>=0; elt-- )
			traverse(node.childNodes.item(elt))
}
function scramble( s ) {
	var arr = s.split(/\b/);
	var out = [];
	for( p in arr )
		out.push( wordScramble( arr[p] ) );
	return out.join( "" );
}
function wordScramble( s ) {
	if ( s.length <= 3 )
		return s;
	var cOrg = [];
	for ( var pos=s.length-2; pos>=1; pos-- )
		cOrg.push( s.charAt( pos ) );
	cOrg.sort( fakeCompare );
	return s.charAt(0)+cOrg.join( "" )+s.charAt(s.length-1);
}
function fakeCompare( a, b ) {
	return Math.random() > 0.5 ? 1 : -1;
}
