/* $Id: lib.js 23766 2008-10-03 13:26:45Z bjorn $ */
var pps = 200; /* pixels per second */
var DEBUG_PRINT = true; // print debug statements
var months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
var days = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
var _W=window,_D=document;
var initialized = false;
var userNumber = -1;
var name = '';
var userEmail;
var spelerUrl = '';
var nodenr, loggedin, ajaxTags, oFCKeditor;
var afterLoginParams = {};
var vproStat = (typeof VproStat != "undefined")? VproStat.getInstance(VproStat.SITE_3VOOR12) : null;
	
// publieke omroep menu
var PoAlignment = 'PoRelativeImage';
var PoRelImage = 'po_lock';
var PoLogoType = 2;
var PoFormatTo = 'left';
var PoVSpace = 4; // 0
var PoHSpace = 0;
var PoVert = true;
var PoSiteId = "index";
/*
var PoFloatX = false;
var PoFloatY = false;
var PoFormatTo = 'right';
*/
// end po menu


function initMain() {
	if (initialized){
		return;
	}
	
	initialized = true;

	if(typeof DWREngine != 'undefined') {
		DWREngine.setErrorHandler(dwrErrors);
		DWREngine.setWarningHandler(dwrErrors);
	}

 	getUserInfo();
	
	/** pass userinfo on to VproStat */
	if(vproStat){vproStat.setUserId(userNumber);}
	
	setNotification();
	/**
	 * @todo refactore these three
	 */
	setLoginButton();
	setDoemeeButton();
	setSitemapDoemeeButton();

	/**
	 * @todo 20071010: Bjorn: enable and fix this
	 */
	//browserNotification();
	
/**
 * @Todo check op dubbele  vermeldingen!
 */
  $('#cijferSelect .mouseover').addHighlight({link: false});
  $('#fotokolom div').addHighlight();
  $('#tekst div.foto').addHighlight();
  $('#radiotvblokje .mouseover').addHighlight();
  $('#tvchannel_0.mouseover').addHighlight({link: false});
  $('dd.mouseover').addHighlight();
  $('div.mouseover').addHighlight();
  $('div.doemeeUitgelicht.mouseover').addHighlight();
  $('li.mouseover').addHighlight();
  //$('ul.hottopics li.mouseover').addHighlight();

  /**
   * @deprecated 20071031
   * @todo fix communitybar
   */
  //attach("#body ul.communityBar li.mouseover", highlight, {link: false});
  //$('#my li.mouseover').addHighlight({link: false});
	
	attach("#kalender dt", slider, {fn: getSibling});
	attach("#login", login);
	attach("#logout", logout);
	attach("#edit", function(el){el.onclick=accountedit});
	/**
	 * @deprecated
	 * @todo rewrite naar jQuery
	 * @param {Object} e
	 */
	//attach("#meer", function(e){highlight(e, {link: false}); e.onclick=function(){updateReacties(false, true)}});
	attach("a.quiz", quiz);
// 20081110 - staat uit, zie: DRIE-2396
//	attach("#tagcloudtarget", tagcloud);
	attach("dl.dagboeken dd.mouseover", dagboek);
	attach('a.lightbox', dagboek);

	if (typeof jaarInterval != 'undefined' && !jaarInterval) {
		attach("#tijdbalk", tijdnav);
		attach("#tijdbalk a", function(e){e.onclick=function(e){return false}; removeClass(e, 'mouse')});
	}
	
	if (typeof initLightbox == 'function'){
		initLightbox();
	}
	
  if(document.getElementById('reageerbalk') != null){
		updateReacties();
	}

	attach("#rating-disabled", inactiveAlert);
	attach("#bookmark-disabled", inactiveAlert);
	attach("#tag-disabled", inactiveAlert);
	attach("#sendafriend-disabled", inactiveAlert);
	attach("#reageerknop-disabled", inactiveAlert);
	attach("#friend-disabled", inactiveAlert);
	attach("#persoonlijk-disabled", inactiveAlert, {href: '/mijn3voor12/{user}/weblog'}); // mijn 3voor12
	//attach("#print", printPagina);
//	printfire("reageerknop: %o", document.getElementById('reageerknop'));
	
	/**
	 * @deprecated
	 * @todo ombouwen naar jQuery
	 */
	attach("#reageerknop", highlight, {link: false});
	attach("input.button", highlight, {link: false});
	
  // communitybar
  initCommunitybar();

	if (loggedin) {
		// getTags(); /* Bjorn: 20070917 depricated??? */
    // workaround totdat nwe communitybar is geimplementeerd
    if(document.getElementById('reageerbody')){
      makeRichText('reageerbody', 'Talk');      
    }
    // end workaround
		attach("#rating", slider, {slide: 'ratingdialoog', radio: true, alwaysafter: ratingfocus});
		attach("#bookmark", slider, {slide: 'bookmarkdialoog', radio: true, alwaysafter: bookmarkfocus});
		attach("#bookmarkok", bookmark);
		attach("#tag", slider, {slide: 'tagdialoog', radio: true, alwaysafter: tagfocus});
		attach("#sendafriend", slider, {slide: 'sendafrienddialoog', radio: true, alwaysafter: sendfriendfocus});
		attach("#sendafriendok", sendFriend);
		attach("#reageerknop", slider, {slide: 'reageerbox', alwaysafter: reageerfocus});
		attach("#reageerok", reageer);
		attach("#friend", slider, {slide: 'frienddialoog', radio: true});
		attach("#friendok", makeFriend);
		attach("#tagok", addTag);
		attach("#tagvalue", tagenter);
	}
  else {
		attach("#rating", login);
		//attach("#bookmark", login);
    attach("#bookmark", slider, {slide: 'bookmarkdialoog', radio: true, alwaysafter: bookmarkfocus});
		attach("#tag", login);
		attach("#sendafriend", login);
		attach("#reageerknop", login);
		attach("#friend", login);
		attach("#persoonlijk", login, {href: '/mijn3voor12/{user}/weblog'}); // mijn 3voor12
		attach("a.persoonlijk", login, {href: '/mijn3voor12/{user}/weblog'}); // mijn 3voor12
	
		$('a[rel="login"]').click(function(){
		  loginNew();
		  return false;
		});
		
    $('a[rel="newAccount"]').click(function(){
      newAccount();
      return false;
    });

	}

  // num users en num groups onder doe mee pagina's
  if(e = document.getElementById('numUsersSpan')){ setNumUsers(e); }
  if(e = document.getElementById('numGroupsSpan')){ setNumGroups(e); } 
   
	if(typeof init == 'function'){
    init();
  }

	menuHover();
 
 	checkDoLogin();/** open login console, depending on queryvar */
 
}

/**
 * adds a css className
 * @param {Object} obj
 * @param {Object} cls
 * @deprecated
 * @todo use jQuery
 */
function addClass(obj, cls) {
	if (!hasClass(obj, cls))
		obj.className = obj.className == "" ? cls : obj.className+" "+cls;
}

/**
 * removes a css classname
 * 
 * @param {Object} obj
 * @param {Object} cls
 * @todo use jQuery
 * @deprecated
 */
function removeClass(obj, cls) {
	obj.className = obj.className && (obj.className == cls ? "" : obj.className.replace(cls, ""));
}

/**
 * checks if Object [obj] has a css class [cls], caseIncensitive!
 * @param {Object} obj
 * @param {Object} cls
 * @todo use jQuery
 * @deprecated
 */
function hasClass(obj, cls) {
	return obj.className && new RegExp("\\b"+cls+"\\b").test(obj.className.toLowerCase());
}

function cleanUpAll(){
  if(!/Microsoft/.test(navigator.appName)){
    return;
  }
	cleanUp(document);
}

function cleanUp(el){
	if (typeof el != 'object'){
  	return;
	}

	for(var i=0; i<el.childNodes; i++){
  	cleanUp(el.childNodes[i]);
	}

	try{
		el.onclick = null;
		el.onmouseover = null;
		el.onmouseout = null;
		el.onmousedown = null;
		el.onmouseup = null;
  }
  catch(e){
  }
}

function dwrErrors(msg){
  printfire("DWR-fout: %o -- Arguments: %o", msg, arguments);
}

function isObject(e){return (e && typeof e == 'object') || isFunction(e);}
function isFunction(e){return typeof e == 'function';}
function gE(e){if(_D.getElementById)return _D.getElementById(e);if(_D.all)return _D.all[e]}
function cE(e){
	var el = _D.createElement(e);
	if(arguments.length == 1){
		return el;
	}
	for(i=1; i<arguments.length; i++){
		if(isObject(arguments[i])){
			el.appendChild(arguments[i]);
		}
		else{
			el.innerHTML += arguments[i];
		}
	}
	return el;
}

/*** richtext functions ***/

/**
 * 
 * @param {Object} id de naam/id van het object of het obejct zelf 
 * @param {Object} style
 * @param {Object} params
 */
function makeRichText(id, style, params) {
//printfire('MakeFCK - %o - %o - %o - %o ', typeof id, id, id.name, params);
  id = typeof id == 'object' ? id.name : id;
  if(id){
    oFCKeditor = new FCKeditor(id);
  	oFCKeditor.BasePath = '/javascript/FCKeditor/'+oFCKeditor.Version+'/';
  	oFCKeditor.Config.StylesXmlPath = '/javascript/FCKeditor/'+oFCKeditor.Version+'/fckstyles.xml';
  	oFCKeditor.Width = params ? params.width : 510;
    oFCKeditor.Height = params ? params.height : 200;
  	oFCKeditor.ToolbarSet = typeof style != 'undefined' ? style : "Basic" ;
    oFCKeditor.ReplaceTextarea();
    //oFCKeditor.Focus();
  }
}

function getText(id) {
	var body;
	if (typeof FCKeditorAPI != 'undefined') {
		var oEditor = FCKeditorAPI.GetInstance(id);
		body = oEditor.GetXHTML();
	}
  else{
		if(document.getElementById(id)){
      body = document.getElementById(id).value
    }
    else{
      body = document.getElementsByName(id)[0].value;
    }
    //body = document.getElementById(id).value || document.getElementsByName(id)[0].value;
	}
	return body;
}

function clearText(id) {
	setText(id, '');
}

function setText(id, text) {
	var body;
	if (typeof FCKeditorAPI != 'undefined') {
		var oEditor = FCKeditorAPI.GetInstance(id) ;
		oEditor.SetHTML(text);
	}
	else {
		document.getElementById(id).value = text;
	}
}

function focusText(id) {
	var body, tmp;
	if(typeof FCKeditorAPI != 'undefined'){
		oEditor = FCKeditorAPI.GetInstance(id);
  }
	if(typeof oEditor != 'undefined'){
		oEditor.Focus();
	}
  else{
    /* // DRIE-1813 ff uitgezet
		if(tmp = document.getElementById(id)){
      //alert(id + ' ' + tmp);
			//printfire('focusTExt %o', tmp);
			tmp.focus();
    }
    */
	}
}

/*** end richtext functions ***/

/**
 * ToDo deze herbouwen naar jQuery
 * 
 * @param {Object} selector
 * @param {Object} fn
 * @param {Object} params
 * @param {Object} d
 */
function attach(selector, fn, params, d) {
//printfire('ATT', selector, fn, params, d);

	//printfire("attach: selector: %o", selector);
	if (!fn) {
		//printfire("function empty: %o", selector);
		return;
	}
	if (arguments.length<4){
    d = document;
	}
	if (selector == '') {
		fn(d, params);
	} 
	else {
		var rest;
		var p = selector.indexOf(' ');
		if (p == -1) {
			rest = '';
		}
		else {
			rest = selector.substr(p+1);
			selector = selector.substring(0, p);
		}
		if (selector.charAt(0) == '#' && selector.length > 1) {
      if (e = d.getElementById(selector.substr(1))){
				attach(rest, fn, params, e);
      }
			else {
				; // printfire('id NOT found: '+selector.substr(1));
      }
		}
    else {
			var parts = selector.split('.');
			var elts = d.getElementsByTagName(parts[0]);
			for (var i = 0; i< elts.length; i++) {
				if (parts.length == 1 || hasClass(elts[i], parts[1])){
					//printfire('attach found: %o', elts[i]);
          attach(rest, fn, params, elts[i]);
				}
			}
		}
	}
}

/***************************** OUDE COMMUNITYBAR *******************************/

/**
 * TODO
 * these are all deprecated??? 
 * @deprecated 20070920
 */

/**
 * 
 * @param {Object} open
 * @param {Object} dialog
 */
function switchMyBorder(open, dialog){
printfire('BEEP!!! switchMyBorder is deprecated');
  if(open){
    removeClass(document.getElementById('my'), 'noBottomBorder');
    removeClass(document.getElementById(dialog), 'bottomBorder');
  }
  else{
    addClass(document.getElementById('my'), 'noBottomBorder');
    addClass(document.getElementById(dialog), 'bottomBorder');
  }
}

function ratingfocus(params, open) {
printfire('BEEP!!! ratingfocus is deprecated');
	attach("#my li.selected", function(elt){removeClass(elt, 'selected')});
  switchMyBorder(true, 'ratingdialoog');
	if (open) {
    switchMyBorder(false, 'ratingdialoog');
    addClass(document.getElementById('rating').parentNode, 'selected');
		openRating();
	}
}

function bookmark(elt) {
printfire('BEEP!!! bookmark is deprecated');
	elt.onclick = function() {
		if (document.getElementById('bookmarkdialoog').style.height != 'auto')
			return; // Stupid IE again
		var title = document.getElementById('bookmarktitle').value;
		var omschrijving = document.getElementById('bookmarkomschrijving').value;
		var url = spelerUrl || document.location.href;
		communityFunctionalityService.bookmark(url, title, omschrijving);
		slide(document.getElementById('bookmarkdialoog'));
		attach("#my li.selected", function(elt){removeClass(elt, 'selected')});
	}
}

function bookmarkfocus(params, open) {
printfire('BEEP!!! bookmarkfocus is deprecated');
	attach("#my li.selected", function(elt){removeClass(elt, 'selected')});
  switchMyBorder(true, 'bookmarkdialoog');
	if (open) {
    switchMyBorder(false, 'bookmarkdialoog');
		addClass(document.getElementById('bookmark').parentNode, 'selected');
		// remove prefix from the suggested title
		document.getElementById('bookmarktitle').value = document.title.replace(/3VOOR12\W?-?\W?/,'');
		document.getElementById('bookmarkomschrijving').focus();
	}
}

function emailSend(data){
printfire('BEEP!!! emailSend is deprecated');
	slide(document.getElementById('sendafrienddialoog'));
	attach("#my li.selected", function(elt){removeClass(elt, 'selected')});
}

function sendfriendfocus(params, open) {
printfire('BEEP!!! sendfriendfocus is deprecated');
	attach("#my li.selected", function(elt){removeClass(elt, 'selected')});
	switchMyBorder(true, 'sendafrienddialoog');
  if (open) {
	  switchMyBorder(false, 'sendafrienddialoog');
  	addClass(document.getElementById('sendafriend').parentNode, 'selected');
		document.getElementById('emailSubject').value = document.title;
		document.getElementById('email').focus();
	}
}

function sendFriend(elt){
printfire('BEEP!!! sendFriend is deprecated');
	elt.onclick = function() {
		document.getElementById('sendafrienddialoog').style.height = 'auto';
		var email = document.getElementById('email').value;
		var body = document.getElementById('emailBody').value;
		var subject = document.getElementById('emailSubject').value;
		var url = spelerUrl || document.location.href;

		communityFunctionalityService.sendAFriendEmail(email, subject, body, url, function() {
		  slide(document.getElementById('sendafrienddialoog'));
		});
	}
}

function makeFriend(elt) {
printfire('BEEP!!! makeFriend is deprecated');
	elt.onclick = function() {
		profileService.makeFriend(profileName, done);
		waitStart();
		function done() {
			waitStop();
			slide(document.getElementById('frienddialoog'));
		}
	}
}

function addTag(elt) {
printfire('BEEP!!! addTag is deprecated');
	elt.onclick = function() {
		addTag2();
	}
}

function tagenter(elt) {
printfire('BEEP!!! tagenter is deprecated');
	elt.onkeypress = function(evt) {
		//printfire("tagenter: %o", elt);
		var c = evt ? evt.keyCode : window.event.keyCode;

		var ret = true;

		if (c == 13) {
			addTag2();
			ret = false;
		}
		return ret;
	}
}

function addTag2() {
printfire('BEEP!!! addTag2 is deprecated');
	document.getElementById('tagdialoog').style.height = 'auto';
	var taginput = document.getElementById('tagvalue');
	var tag = taginput.value.toLowerCase();
	if (tag == '')
		return;

	var tagsul = document.getElementById('mytags');
	var lis = tagsul.getElementsByTagName('li');
	for (var i=0; i<lis.length; i++) {
		if (lis[i].innerHTML == tag)
			return;
	}
	communityFunctionalityService.tag(tag, nodenr, tagReturn);
	taginput.className = 'busy';
}

function tagReturn(data) {
printfire('BEEP!!! tagReturn is deprecated');
	var taginput = document.getElementById('tagvalue');
	taginput.value = '';
	taginput.className = '';
	taginput.focus();
	var tagsul = document.getElementById('mytags');
	var li = document.createElement('li');
	tagsul.appendChild(li);
	li.innerHTML = data.value;
}

function tagfocus(params, open) {
printfire('BEEP!!! tagfocus is deprecated');
	attach("#my li.selected", function(elt){removeClass(elt, 'selected')});
  switchMyBorder(true, 'tagdialoog');
	if (open) {
    switchMyBorder(false, 'tagdialoog');
		addClass(document.getElementById('tag').parentNode, 'selected');
		document.getElementById('tagvalue').select();
	}
}

/**
 * @todo
 * @deprecated
 * @param {Object} msg
 */
function setCommunitybarText(msg) {
printfire('BEEP!!! setCommunitybarText is deprecated');
	var p = document.getElementById('my').getElementsByTagName('p');
	if (p.length)
		p[0].innerHTML = msg;
}

/**
 * Voeg ingevulde reactie toe
 * @deprecated 20070522
 */

function reageer(elt) {
printfire('BEEP!!! reageer is deprecated');
	elt.onclick = function() {
		var body = getText('reageerbody');
		communityFunctionalityService.comment("", body, nodenr, function(){updateReacties(true, true)});
		slide(document.getElementById('reageerbox'), {after: function(){clearText('reageerbody')}});
	}
}

function reageerfocus(params, open) {
printfire('BEEP!!! reageerfocus is deprecated');
	if (open){
		addClass(document.getElementById('reageerknop'), 'selected');
	}
	else{
		removeClass(document.getElementById('reageerknop'), 'selected');
  }
	focusText('reageerbody');
}

/**
 * reload: forceren, after: klik op meer-knop of na toevoegen nwe reactie
 * @deprecated 20070522
 */
function updateReacties() {
printfire('BEEP!!! updateReacties is deprecated');
	if (typeof nodenr == 'undefined'){
		return;
  }
	communityFunctionalityService.countRelatedComments(nodenr, function(cnt){onloadCounter(cnt)});
}

/************************** end OUDE COMMUNITYBAR ******************************/

/**
 * 
 * Geen closure voor deze functie omdat IE anders crasht.
 * cnt is nieuwe aantal reacties
 * 
 * @deprecated
 * @todo is dit nog wel nodig ivm nwe communitybar
 * @param {Object} cnt
 */ 
function onloadCounter(cnt) {
	var myCommentsnum = document.getElementById('my-commentsnum');
	if (myCommentsnum){
    myCommentsnum.innerHTML = cnt;
	}
	var reageerCommentsnum = document.getElementById('reageer-commentsnum');
	if (reageerCommentsnum){
		reageerCommentsnum.innerHTML = cnt;
	}
	communityFunctionalityService.findCommentsFor(nodenr, 0, cnt, onloadComments);

	function onloadComments(comments) {
		//printfire("onloadComments: comments: %o", comments);
		waitStop();
		var reageerDiv = document.getElementById('reageer');
		var reageerBalk = document.getElementById('reageerbalk');

		// first, delete all current comments
		var reacties = reageerDiv.getElementsByTagName('div');
		for (var r = reacties.length - 1; r >= 0; r--) {
			if (hasClass(reacties[r], 'reactie')){
				reageerDiv.removeChild(reacties[r]);
			}
		}

		for (var i=comments.length-1; i>=0; i--) {
			var div = maakReactieDiv(comments[i]);
			reageerDiv.insertBefore(div, reageerBalk);
			slide(div);
		}

		function maakReactieDiv(comment) {
			var div = document.getElementById('reageerempty').cloneNode(true);
			div.id = '';
			div.className = 'reactie';
			var editHtml, userImage, username = '';
      // workaround: sommige postings hebben soms geen user Object :s
      if(!comment.user){
        comment.user = {};
      }

			if(comment.user.profile && comment.user.profile.image){
        editHtml = "<img class='userimage' src='"+comment.user.profile.image.URL+"+s(!30x!20)+f(asis)"+"'/>";
      }
      else{
        editHtml = "<img class='userimage' src='/pix/iconen/user-lichtrood-op-ccc.gif' width='30' height='20'/>";
      }

			var body = comments[i].body;
			body = body.replace(/&apos;/g, '\'');
			if (!body.match(/<p>/)){
				body = "<p>"+body+"</p>";
			}
			div.getElementsByTagName('div')[0].innerHTML = body;

			var deleteImg = '';
      if (loggedin && comment.user.number == userNumber) {
				deleteImg += '<img class="delete" src="/pix/iconen/delete.png" width="20" height="20" onclick="deleteComment(this, '+comment.number+')">';
			}

			if (comment.user.siteAccount){
        username = comment.user.siteAccount.replace('@no.nick', '');
      }

			if (comment.user.profile && username != '') {
				var url = '/mijn3voor12/'+username;
				editHtml = '<a href="'+url+'/weblog">'+editHtml+'</a>';
				username = '<a href="'+url+'/profiel"><b>'+username+'</b></a>';
			}

      editHtml += deleteImg;
      editHtml += username ? username+' - ' : '';
      editHtml += getDate(comment.created)+' '+getTime(comment.created);
			
      
      div.getElementsByTagName('h4')[0].innerHTML += editHtml;
			div.style.height = 0;
			return div;
		}

	}
}

/**
 * retrieves the user info from a cookie
 */
function getUserInfo() {
printfire('getUserInfo');
	var cookieval = $.cookie('userinfo');
	if(cookieval != undefined) {
		var cookievals = cookieval.replace(/"/g, '').split(',');
		userNumber = cookievals[0];
		name = cookievals[1];
		loggedin = cookievals[2];
		userEmail = cookievals[3];
	}
printfire('getUserInfo DONE');
}

// @depricated 20070522
function editComment(obj, nodenr) {
printfire('BEEP!!! editComment is deprecated');
	if (document.getElementById('comment')){
		return;
	}
	addClass(obj.parentNode.parentNode, 'edit');
	var div = obj.parentNode.parentNode.getElementsByTagName("div")[0];
	var p = document.createElement("p");
	p.innerHTML = "Wijzig je reactie:";
	var textarea = document.createElement("textarea");
	textarea.id = 'comment';
	textarea.cols = 60;
	textarea.rows = 6;
	textarea.value = div.innerHTML;
	var input = document.createElement("input");
	input.type = 'image';
	input.value = 'OK';
	input.className = 'button';
	input.onclick = submit;
	input.src = '/pix/navigatie/ok.png';
	var input2 = document.createElement("input");
	input2.type = 'image';
	input2.value = 'ANNULEREN';
	input2.className = 'button';
	input2.onclick = function(){updateReacties(true)};
	input2.src = '/pix/navigatie/annuleren.png';

	div.parentNode.insertBefore(p, div);
	div.parentNode.insertBefore(textarea, div);
	div.parentNode.insertBefore(input, div);
	div.parentNode.insertBefore(input2, div);
	div.parentNode.removeChild(div);
	makeRichText('comment', 'Talk');

	function submit() {
		var body = getText('comment');
		communityFunctionalityService.updateComment(nodenr, "", body, done);
		slide(obj.parentNode.parentNode, []);

		function done() {
			updateReacties(true);
		}
	}
}

function removeChildren(obj) {
	if (!obj){
		return;
	}
	var elts = obj.childNodes;
	for (var i=elts.length-1; i>=0; i--) {
		cleanUp(elts[i]);
		try {
			obj.removeChild(elts[i]);
		}
		catch(e) {
		}
	}
	obj.innerHTML = '';
}

// @deprecated ???
function verwijderReacties() {
	var reageerDiv = document.getElementById('reageer');
	var divs = reageerDiv.getElementsByTagName('div');
	for (var i=divs.length-1; i>=0; i--) {
		if (hasClass(divs[i], 'reactie')){
			reageerDiv.removeChild(divs[i]);
		}
	}
}

var locationAfterLogin;
function login(elt, parms) {
	if (parms){
		var href = parms.href;
	}

	elt.onclick = function(evt) {
		if (/Safari/.test(navigator.userAgent)) {
			document.location = savePath("/users/login.jsp?cssid=3voor12&referrer="+document.URL);
		}
    else {
			locationAfterLogin = href;
			loginElt = elt;
			makeframebox(savePath("/users/login.jsp?cssid=3voor12&referrer=/3voor12ce/home/signon.jsp"), 440, 500, 'signon');
		}
		return false;
	}
}

/**
 * new function to login from communitybar
 * @todo clean up login en loginNew
 * @todo fix for safari
 */
function loginNew(params){
 	var params = params || {};
	if(params.afterLoginParams){
		afterLoginParams = params.afterLoginParams; 
	}
	if (/safari/.test(navigator.userAgent.toLowerCase())) {
		document.location = savePath("/users/login.jsp?cssid=3voor12&referrer="+document.URL);
	}else{	
  		makeframebox(savePath("/users/login.jsp?cssid=3voor12&referrer=/3voor12ce/home/signon.jsp"), 440, 500, 'signon');
  	}
}

/**
 * checkDoLogin Checks for queryvar 'login=1' to open up the login console
 * @note it's nicer to remove the login parameter from the referrer,
 *		eventhough loggedin status is checked prior to showing the console.
 * @author frank 20080219
 */
function checkDoLogin(){
	var doLogin = getUrlParam('login');
	if((doLogin) && doLogin == '1'){
		li = (typeof loggedin != 'undefined')? ((loggedin == 'true')? true : false) : false ;
		if(!li){
			 setTimeout(loginNew,1);
		}
	}
}


function newAccount(params){
  var params = params || {};
  if(params.afterLoginParams){
    afterLoginParams = params.afterLoginParams; 
  }
  makeframebox(savePath("/users/newaccount.jsp?cssid=3voor12&referrer="), 440, 500, 'signon');
}

function savePath(path) {
	var host;
	if (document.location.host == 'vpro.react.nl'){
		host = 'http://3voor12.vpro.nl';
	}
	else {
		host = '';
	}
	//printfire("savePath result: host + path: %o", host + path);
	return host + path;
}

/**
 * is called after succesfull login
 * 
 * @param {String} username
 */
function afterLogin(username) {
	var hash = '';
	var url = document.URL;
  if(afterLoginParams && afterLoginParams.href){
    url = afterLoginParams.href.replace("{user}", username);
    afterLoginParams.href = null;
  }
  /** take care of hash # in URL */
  if(/#/.test(url)){
  	hash = url.match(/#.+/)[0];
  	url = url.replace(hash, '');
  }  
  url += (/\?/.test(url)) ? '&' : '?';
  url += 'refresh=true';
  if(afterLoginParams){
    for(key in afterLoginParams){
      url += '&'+key+'='+afterLoginParams[key];
    }
  }
	document.location = url + hash;
}

/**
 * opens the quiz in an overlay
 * @param {Object} elt
 * @return {Boolean}
 * @todo implement jQuery
 */
function quiz(elt) {
  elt.onclick = function() {
		makeframebox("http://quiz.vpro.nl/quiz/3voor12/", 648, 500, "quiz");
		return false;
	}
}

/**
 * opens dagboek in an overlay
 * @param {Object} elt
 * @todo implement jQuery
 */
function dagboek(elt) {
	elt.onclick = function(evt) {
		var a = elt.getElementsByTagName('a');
		if (a && a[0]) {
			makeframebox(a[0].href, 770, 475, "dagboek");
		}
		return false;
	}
}

function popup(url, width, height, name) {
	window.open(url, name, 'width='+width+',height='+height);
}

/**
 * 
 * @param {Object} url
 * @param {Object} width
 * @param {Object} height
 * @param {Object} name
 * @todo fix framebox for safari
 */
function makeframebox(url, width, height, name) {
	if (/Safari/.test(navigator.userAgent)) {
		popup(url, width, height, name);
		return true;
	}
	var arrayPageSize = getPageSize();
	darken();
	var iframe = document.createElement("iframe");
	iframe.style.width = width+'px';
	iframe.id = name;
	iframe.name = name;
	iframe.style.left = Math.floor((arrayPageSize[0]-width)/2)+'px';
	document.body.appendChild(iframe);
	iframe.src = url;
	window.scrollTo(0, 0);
	var header = document.createElement("div");
	header.style.width = (width-2)+'px';
	header.id = 'frameHeader';
	header.style.left = Math.floor((arrayPageSize[0]-width)/2-1)+'px';
	var close = new Image();
	close.title = 'Sluiten';
	close.src = '/pix/iconen/delete.png';
	close.onclick = cancelframebox;
	header.appendChild(close);
	document.body.appendChild(header);

	function cancelframebox() {
		document.body.removeChild(iframe);
		document.body.removeChild(header);
		cancelDarken();
	}
}

function logout(elt) {
  elt.onclick = function() {
    communityFunctionalityService.logout(reload);
    function reload() {
      document.location.reload();
    }
    return false;
	}
}

/**
 * 
 * @param {Object} name
 * @param {Object} value
 * @todo implement $.cookie 
 */
function setCookie(name, value) {
	var exp = new Date(new Date().getTime()+60*60*24*1000*1000).toGMTString(); // 1000 days
	//$.cookie(name, value, {expires: exp, path: '/'});
	document.cookie = name+"="+escape(value)+";expires="+exp+";path=/";
}


/**
 * getCookie is depricated! use $.cookie(name)
 * @deprecated
 * @param {Object} name
 * @todo delete this code
 */
function getCookie(name){
  printfire('BEEP!! getCookie is deprecated! use $.cookie(%o)', name);
	return $.cookie(name) || null;
}

/**
 * 
 * @param {Object} name
 * @todo implement $.cookie
 */
function deleteCookie(name) {
	document.cookie = name+"=;path=/;expires=Thu, 01-Jan-1970 00:00:00 GMT;";
}

function darken() {
	var objOverlay = document.getElementById('overlay');
	var objLoadingImage = document.getElementById('loadingImage');
	objOverlay.style.height = (arrayPageSize[1] + 'px');
	objOverlay.style.display = 'block';
	objLoadingImage.style.display = 'none';
	objOverlay.onclick = null;
}

function cancelDarken() {
//printfire('cancelDarken');
	var objOverlay = document.getElementById('overlay');
	objOverlay.style.display = 'none';
}

/**
 * preloads an image
 * @param {Object} url
 */
function preFetch(url) {
	var img = new Image();
	img.src = url;
}

function tijdnav(elt) {
	var timer = null;
	var curPos = (curDate.getTime()-msBegin)/(msEinde-msBegin)*tijdbalkBreedte;
	var todayPos = (new Date().getTime()-msBegin)/(msEinde-msBegin)*tijdbalkBreedte;
	elt.onmousemove = tijdmove;
	elt.onmouseout = outSlider;
	elt.onmouseover = overSlider;
	elt.onclick = klikSlider;
	document.getElementById("slider").onclick = klikSlider;
	resetSlider();


	function tijdmove(e) {
		evt = e || window.event;
		var x = evt.clientX-elt.offsetLeft;
		if (x > todayPos){
			x = todayPos;
		}
		else if (x < 1){
			x = 0;
		}
		setSlider(x);
	}
	
	function setSlider(x) {
		document.getElementById("slider").style.left = elt.offsetLeft-1+x+'px';
		var ms = msBegin + x*(msEinde-msBegin)/1000;
		var d = new Date(ms);
		var sliderdatum = document.getElementById('sliderdatum');
		sliderdatum.innerHTML = getDate(d);
		sliderdatum.style.left = elt.offsetLeft+x-sliderdatum.offsetWidth*x/tijdbalkBreedte+'px';
	}
	
	function klikSlider(e) {
		evt = e || window.event;
		var x = evt.clientX-elt.offsetLeft;
		if (x > todayPos){
			x = todayPos;
		}
		var ms = msBegin + x*(msEinde-msBegin)/tijdbalkBreedte;
		var d = new Date(ms);
		document.location = tijdbalkUrl+(d.getDate()<10?'0':'')+d.getDate()+months[d.getMonth()]+d.getFullYear();
		elt.onclick = null;
		elt.onmousemove = null;
		elt.onmouseout = null;
		elt.onmouseover = null;
	}
	
	function outSlider(evt) {
		timer = setTimeout(resetSlider, 500);
	}
	
	function overSlider(evt) {
		clearTimeout(timer);
	}
	
	function resetSlider() {
		var top = document.body.offsetTop+elt.offsetTop;
		var slider = document.getElementById("slider");
		var sliderDatum = document.getElementById("sliderdatum");
		slider.style.top = top+'px';
		sliderDatum.style.top = top-15+'px';
		slider.style.visibility = 'visible';
		sliderDatum.style.visibility = 'visible';
		setSlider(curPos);
	}
}

function getDate(d) {
	return d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();
}

function getFullDate(d){
	var day = d.getDay() == 0 ? 6 : d.getDay()-1;
	return days[day]+' '+d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();
}

function getTime(d) {
	return d.getHours()+':'+(d.getMinutes()<10?'0':'')+d.getMinutes();
}

function getDateTime(d) {
	return getDate(d) + ' ' + getTime(d);
}

/**
 * 
 * @param {Object} elt
 * @todo use jQuery
 */
function getSibling(elt) {
	var s = getParentByTagName(elt, 'dt');
	do {
		s = s.nextSibling;
	}
	while (!s.tagName);
	return s;
}

/**
 * @todo vervangen? use jQuery en communitybar functionality
 * @deprecated ???
 */
var openDialog = null;
function slider(elt, params) {
	var fullHeight = null;
	var destHeight = null;
	var slideObject = null;
	var completed = null;

	if (params.slide){
		slideObject = document.getElementById(params.slide);
	}
	else if (params.fn){
		slideObject = params.fn(elt);
	}

	attach('input.cancel', function(e){e.onclick=function(){elt.onclick()}}, [], slideObject);

	elt.setCompletedHandler = function(h) {
		params.after = h;
	}

	elt.onclick = function() {
		if (params.alwaysbefore){
			params.alwaysbefore(elt, params);
		}
		if (params.radio) {
			if (openDialog && openDialog != elt) {
				openDialog.style.zIndex = 1;
				slideObject.style.zIndex = 2;
				e = openDialog.onclick();
				e.setCompletedHandler(function(params){params.after=null; elt.onclick()});
				return elt;
			}
			if (slideObject.offsetHeight == 0) {
				openDialog = elt;
			}
			else {
				openDialog = null;
			}
		}
		slide(slideObject, params);
		return elt;
	}
}

/**
 * slides a div
 * @param {Object} obj
 * @param {Object} params
 * @deprecated ??? in favor of new community bar
 * @todo delete this
 */
function slide(obj, params) {
//printfire('SLIDE %o - %o', obj.offsetHeight, params);
	var fullHeight;
	var destHeight;
	var startTime;

	if (!params){
		params = {};
	}

	if (obj.offsetHeight == 0) {
		obj.style.height = 'auto';
		fullHeight = obj.offsetHeight;
		if (params.maxheight && fullHeight > params.maxheight){
			fullHeight = params.maxheight;
		}
		obj.style.height = '0';
		destHeight = fullHeight;
	}
	else {
		destHeight = 0;
	}
	startTime = new Date().getTime();
	step();

	function step() {
		var ms = new Date().getTime() - startTime;
		var dif = Math.round(ms * pps / 1000);
		var newPos = obj.offsetHeight + (destHeight ? dif : -dif);
		if (newPos > fullHeight || newPos < 0) {
			if (destHeight == 0){
				obj.style.height = 0;
			}
			else{
				obj.style.height = params.maxheight ? (destHeight+'px') : 'auto';
			}
			if (typeof params.after == 'function'){
				params.after(params, destHeight != 0);
			}
			if (typeof params.alwaysafter == 'function'){
				params.alwaysafter(params, destHeight != 0);
			}
			return;
		}
		else {
			setTimeout(step, 40);
		}
		obj.style.height = newPos+'px';
	}

}

/**
 * 
 * @param {Object} elt
 * @param {Object} params
 * @deprecated
 * @todo implement jQuery
 */
function fade(elt, params) {
	params = params || {};
	var opacity = 100;
	var destOpacity = 0;
	if (elt.style.visibility == 'hidden') {
		elt.style.visibility = 'visible';
		opacity = 0;
		destOpacity = 100;
	}
	var startTime = new Date().getTime();
	step();

	function step() {
		var ms = new Date().getTime() - startTime;
		var dif = Math.round(ms / 10);
		var newOpacity = opacity + (destOpacity ? dif : -dif);

		if (newOpacity > 100 || newOpacity < 0) {
			if (newOpacity > 100){
				newOpacity = 100;
			}
			else{
				newOpacity = 0;
			}
			if (typeof params.after == 'function'){
				params.after(params, newOpacity != 0);
			}
		}
		else {
			setTimeout(step, 40);
		}

		if (elt.style.MozOpacity != null){
			elt.style.MozOpacity = newOpacity/100;
		}
		else if (elt.style.opacity != null){
			elt.style.opacity =  newOpacity/100;
		}
		else if (elt.style.filter != null){
			elt.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=0, opacity='+newOpacity+')';
		}
	}
}

/**
 * 
 * @param {Object} fn
 * @todo implement jQuery
 * @deprecated
 */
var Effects = {
	timers: [],
	fn: null,
	ifDone: function(fn){
		Effects.fn=fn;
	},
	fade: function(e) {
		for (var t = 0; t < Effects.timers.length; t++) {
			clearTimeout(Effects.timers[t]);
		}
		Effects.timers = [];
		var op=105, fadeIn=false;
		if(e.style.visibility == 'hidden'){
			op = -5;
			fadeIn = true;

		}
		setOpacity();
		e.style.visibility = 'visible';

		for(var i=0; i<20; i++){
			Effects.timers.push(setTimeout(setOpacity, i * 30));
		}
		if(Effects.fn){
			Effects.timers.push(setTimeout(Effects.fn, 20 * 30));
		}

		function setOpacity(){
			op = fadeIn ? op + 5 : op - 5;
			if(e.style.MozOpacity != null){
				e.style.MozOpacity = op > 0 ? (op/100)-.001 : 0;
			}
			else if(e.style.KhtmlOpacity != null){
				e.style.KhtmlOpacity = op > 0 ? (op/100)-.001 : 0;
			}
			else if(e.style.opacity != null){
				e.style.opacity =  op > 0 ? (op/100)-.001 : 0;
			}
			else if(e.style.filter != null){
				e.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=0, opacity='+op+')';
			}
		}

		function getOpacity(){
			if(e.style.MozOpacity != null){
				return e.style.MozOpacity;
			}
			else if(e.style.KhtmlOpacity != null){
				return e.style.KhtmlOpacity;
			}
			else if(e.style.opacity != null){
				return e.style.opacity;
			}
			else if(e.style.filter != null){
				return e.style.opacity;
			}
		}

	}
}


/********************* mouseover ****************************/
/**
 * 
 * @param {Object} elt
 * @param {Object} params
 * @deprecated
 * @todo implement addHover() and jQuery
 */
function highlight(elt, params) {
//	printfire("highlight: elt: %o", elt);
//	printfire("highlight: params: %o", params);
	elt.onmouseover = function(evt) {
		var a = elt.getElementsByTagName('a');
    if ((a && a[0]) || (params && params.link === false)) {
			addClass(elt, 'highlight');
			if (a && a[0]){
				window.status = a[0].href;
      }
		}
	}
	
	elt.onmouseout = function(evt) {
		removeClass(elt, 'highlight');
		window.status = '';
	}
	
  // skip onclick
  if (!params || (params && params.skipOnclick !== true)){
    elt.onclick = function(evt) {
  		printfire("klik !!");
  		var aa = elt.getElementsByTagName('a');
  		if (aa && aa[0]) {
  			a = aa[0];
  			if (a.getAttribute('rel') == 'speler' || /\/speler\/(luisterpaal|ondemand)\//.test(a.href)){
  				openSpeler('', {url: a.href})
  			}
			else if (a.getAttribute('rel') == 'lightbox') {
  				a.onclick();
  			}
			else {
  				document.location = a.href;
  			}
  			return false;
  		}
  	}
  }
}
/** end mouseover ***/

/**
 * 
 * @param {Object} elt
 * @param {Object} tagName
 * @todo use jQuery
 */
function getParentByTagName(elt, tagName) {
	while (elt && elt.tagName.toLowerCase() != tagName.toLowerCase()){
		elt = elt.parentNode;
	}
	return elt;
}

/**
 * @param {Object} elt
 * @param {Object} className
 * @todo use jQuery
 */
function getParentByClassName(elt, className) {
	while (elt && !hasClass(elt, className)){
		elt = elt.parentNode;
	}
	return elt;
}

/**
 *
 * @param {Object} cls
 * @param {Object} tag
 * @param {Object} node
 * @todo use jQuery
 */
function getElementsByClassName(cls, tag, node){
  if(document.getElementsByClassName){
    return document.getElementsByClassName(cls);
  }
  var els = (node || document).getElementsByTagName((tag || '*'));
  var regEx = new RegExp("\\b"+cls+"\\b");
  for(var found=[], len=els.length; len > 0; len--){
    if(els[len-1].className != '' && regEx.test(els[len-1].className)){
      found.push(els[len-1]);
    }
  }
  return found;
}

/**
 * displays a message in the Firebug Console
 * @link http://getfirebug.com
 * @todo check getfirebug.com voor andere manier
 * @todo implement firebug light for IE en Safari
 */
function printfire(){
  if(!DEBUG_PRINT){ return; }
  try{
    console.info.apply(this, arguments);
  // window.console.log() // safari > 3.1
  }
  catch(e){
    
  }
    
}

//function printfireOld() {
//	if(!DEBUG_PRINT || /Safari/.test(navigator.userAgent)){
//		return;
//  }
//console.info('Typeof', typeof console);
//  switch (typeof console) { // in IE8 console == object
//    case 'object':
//      //console.info.apply(this, arguments);
//    break;
//    case 'function':
//      var arg = [];
//      for (var i = 0; i < arguments.length; i++) {
//        arg.push(arguments[i]);
//      }
//      console.info(arg.join(', '));
//    break;
//	}
//}

/**
 * 
 * @param {Object} elt
 * @todo use jQuery
 */
function rowhighlight(elt) {
	var tr = getParentByTagName(elt, 'tr');
	elt.onmouseover = function() {
		if (hasClass(tr, 'mo')) {
			var tds = tr.getElementsByTagName('td');
			for (var i=0; i<tds.length; i++) {
				addClass(tds[i], 'highlight');
			}
		}
	}
	elt.onmouseout = function() {
		if (hasClass(tr, 'mo')) {
			var tds = tr.getElementsByTagName('td');
			for (var i=0; i<tds.length; i++) {
				removeClass(tds[i], 'highlight');
			}
		}
	}

	if (hasClass(elt, 'nohighlight')){
		return;
	}

	elt.onclick = function() {
		if (hasClass(tr, 'mo')) {
			var a = tr.getElementsByTagName('a');
			if (a && a[0] && a[0].href){
        document.location = a[0].href;
      }
		}
	}
}

function waitStart(kleur) {
	document.getElementById('body-wide').style.cursor = "wait";
	document.getElementsByTagName('body')[0].style.cursor = "wait";
	document.getElementById('logo').src = '/pix/iconen/logo_loading_rood.gif';
// niet meer nodig, zie DRIE-1353
//	var bezigmetladen = document.getElementById('bezigmetladen');
//	if (kleur) {
//		bezigmetladen.className = '';
//	} else {
//		kleur = 'ffffff';
//		bezigmetladen.className = 'ondoorzichtig';
//	}
//	bezigmetladen.getElementsByTagName('img')[0].src = "/pix/iconen/bezigmetladen-"+kleur+".gif";
//	bezigmetladen.style.display = 'block';
//	bezigmetladen.style.visibility = 'hidden';
//	Effects.fade(bezigmetladen);
}

function waitStop() {
	document.getElementById('body-wide').style.cursor = "auto";
	document.getElementsByTagName('body')[0].style.cursor = "auto";
	document.getElementById('logo').src = '/pix/iconen/logo_zwart.gif';
	Effects.ifDone(done);
	Effects.fade(document.getElementById('bezigmetladen'));
	function done() {
		document.getElementById('bezigmetladen').style.display = 'none';
	}
}

function niceTruncate(value, maxLength) {
  if(value.length > maxLength){
    var trunc = value.substr(0, maxLength - 3);
    var lastSpace = trunc.lastIndexOf(' ');
    if (lastSpace > maxLength - 20 || lastSpace > maxLength/2){
      trunc = trunc.substr(0, lastSpace);
		}
    return trunc + '...';
  }
  else {
    return value;
  }
}

// Workaround FF1.0 refresh bug
function refresh(elt) {
	if (/Firefox\/1.0/.test(navigator.userAgent)) {
		elt.style.overflow = 'visible';
		setTimeout(again, 100);
	}
	function again() {
		elt.style.overflow = 'hidden';
	}
}

/**
 * 
 * @param {Object} e
 * @todo use jQuery
 */
function hideDiv(e){
  document.getElementById(e).style.display = 'none';
}

/**
 * 
 * @param {Object} e
 * @todo use jQuery
 */
function showDiv(e){
  document.getElementById(e).style.display = 'block';
}

/**
 * 
 * @param {Object} e
 * @todo use jQuery
 */
function toggleDiv(e){
	var el = document.getElementById(e);
	el.style.display = el.style.display == 'none' ? 'block': 'none';
}

/**
 * 
 * @param {Object} e
 * @todo use jQuery
 */
function makeInvisible(e){
	document.getElementById(e).style.visibility = 'hidden';
}

/**
 * 
 * @param {Object} e
 * @todo use jQuery
 */
function makeVisible(e){
	document.getElementById(e).style.visibility = 'visible';
}

/**
 * 
 * @param {Object} e
 * @todo use jQuery
 */
function toggleVisibility(e){
	var el = document.getElementById(e);
	el.style.visibility = el.style.visibility == '' ||  el.style.visibility == 'visible' ? 'hidden' : 'visible';
}

/**
 * 
 * @param {Object} div1
 * @param {Object} div2
 * @todo use jQuery
 */
function showHide(div1, div2){
	showDiv(div1);
	hideDiv(div2);
}

/**
 * @todo use jQuery
 * @todo teksten dynamisch maken via de editors
 */
function menuHover() {
	var teksten = [
		{id: 'menu-hoofd', tekst: 'Bekijk hier de voorpagina van 3VOOR12.'},
		{id: 'menu-bodh', tekst: 'Kijk hier voor nieuws, festivals, 3VOOR12/lokaal en Rebelbass.'},
		{id: 'menu-kel', tekst: 'Kijk hier voor radio- en tv-kanalen, de luisterpaal, concerten, dj-sets en programma\'s.'},
		{id: 'menu-doemee', tekst: 'Kijk hier voor Mijn 3VOOR12, de quiz, de 3VOOR12 wiki en het tag-overzicht.'},
		{id: 'menu-artiesten', tekst: 'Kijk hier als je alle 3VOOR12 inhoud op artiest gebundeld wilt vinden.'},
		{id: 'menu-service', tekst: 'Kijk hier voor antwoorden op veelgestelde vragen, de Club 3VOOR12 gastenlijst en mail aan de redactie.'},
		{id: 'menu-winkel', tekst: 'Kijk hier als je wat wilt kopen.'}
	];

	var t = document.getElementById('menu-tekst');
	if (t) {
		for (var a = 0; a < teksten.length; a++) {
			var menu = document.getElementById(teksten[a].id);
			menu.onmouseover = function(i){return function(){t.innerHTML = teksten[i].tekst}}(a);
			menu.onmouseout = function(){t.innerHTML = ''};
		}
	}
}

/**
 * Edwins 400-bytes Ajax-functie. Hoezo bilbliotheken van 40k?
 * mooie functie, maar toch maar migreren naar jQeury $.Ajax ivm forward compatiblity
 * @param {Object} url
 * @param {Object} fn
 * @todo use jQuery
 * @depricated
 */
function fetchXML(url, fn) {
  if(typeof(noAjax) != 'undefined' && noAjax){
    return;
  }
  
	var xmlHttp = null;
  var prop = arguments[2] || 'responseXML';
	
  if (window.XMLHttpRequest){
    xmlHttp = new XMLHttpRequest();
  }
  else if (window.ActiveXObject){
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  
	try {
    if (xmlHttp) {
      xmlHttp.onreadystatechange = done;
      xmlHttp.open('GET', url, true);
      xmlHttp.send('');
    }
  }
  catch(e) {
  }
  
	function done() {
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
      fn(xmlHttp[prop]);
    }
  }
}

/**
 * 
 * @param {Object} url
 * @param {Object} fn
 * @todo use jQuery
 */
function fetchHTML(url, fn) {
	fetchXML(url, fn, 'responseText');
}

var timeDiff = 0;
function sync() {
  var syncurl = "/3voor12ce/live/livetimexml.jsp";
  fetchXML(syncurl, done);

  function done(xml) {
    var localTime = Math.round(new Date().getTime()/1000);
    var serverTime = getTextContent(xml.getElementsByTagName('currentservertime')[0]);
    timeDiff = localTime - serverTime;
  }
}

/**
 * fetches the current time from the server. 
 * @todo implement server call time latency
 * @return time in seconds
 */
var serverTime = 0;
var serverTimeObj;
function getServerTime(params){
  var params = params || {};
  var syncurl = "/3voor12ce/live/livetimexml.jsp";
//  var start = new Date().getTime();
  fetchXML(syncurl, done);

  function done(response){
    var clientTime = new Date().getTime();
    serverTime = getTextContent(response.getElementsByTagName('currentservertime')[0]);
		serverTimeObj = new Date(serverTime * 1000);
		timeDiff = (serverTime * 1000) - clientTime; 

		//server xml: 1196883142 // 11968833551
    if(params.callback){
      params.callback();
    }		
	}
}

/**
 * returns the current time in sync with the server
 */
function getCurrentTime() {
  function returnCurrentTime(){
		return Math.round((new Date().getTime() + timeDiff)/1000);
  }
	
	if(serverTime == 0){
    printfire('Sync FORCED!');
		getServerTime({callback: returnCurrentTime});
	}
	else{
		return returnCurrentTime();
	}
}

/**
 * @deprecated use getCurrentTime()
 */
function getPlayerTime() {
	printfire('BEEP!!! getPlayerTime is deprecated');
	return getCurrentTime();
}

function openSpeler(type, data) {
	//printfire("openSpeler: data: %o", data);
	var url;
	if (data.url) {
		url = data.url;
	}
	else {
		url = "/speler/"+type+"/"+data.number;
	}
	printfire("openspeler: %s", url);
	var popup = window.open(url, '3voor12speler', 'width=800,height=510');
	popup.focus();
	return false;
}

/**
 * returns all url params or null. if name is given only that value is returned
 * @param {Object} name the name of the param to retrieve
 */
function getUrlParam(name) {
	var query = document.location.search.substring(1);
	var kvs = query.split(/&/);
  var ret = {};
	for(var i=0,len=kvs.length; i<len; i++) {
		var kv = kvs[i].split(/=/);
    if(name && kv[0] == name){
			return kv[1];
    }
    else if(!name){
      ret[kv[0]] = kv[1];
    }
	}
  for(a in ret){
    return ret;
  }
  return null;
}

/**
 * alias for getUrlParam()
 */
function getUrlParams(n){
  return getUrlparam(n);
}

/**
 * 
 * @param {Object} node
 * @author B.Wikkeling
 */
function getTextContent(node){
  if(!node){
    return;
  }
	if(node.textContent){
  	return node.textContent;
	}
	if(node.innerText){
	 return node.innerText;
	}
	if(node.text){
	 return node.text;
	}
	if(node.firstChild && node.firstChild.nodeValue){
	 return node.firstChild.nodeValue;
	}
  if(node.childNodes && node.childNodes.length > 0){
    var innerText = '';
    for(var i=0; i< node.childNodes.length; i++){
      innerText += getTextContent(node.childNodes[i]);
    }
    return innerText;
  }
}

/**
 * @todo wordt dit nog wel gebruikt ivm SSO???
 * @deprecated ???? 
 */
function accountedit() {
	var url = '/users/accountinfo.jsp?cssid=3voor12';
	if (/Safari/.test(navigator.userAgent)) {
		document.location = url+'&referrer='+document.URL;
	}
  else {
		makeframebox(url+'&referrer=/3voor12ce/home/signon.jsp', 430, 540, 'signon');
	}
	return false;
}

/**
 * 
 * @param {Object} number
 * @param {Object} parameters
 * @todo wodt dit wel gebruikt?
 * @deprecated dd.20090121 ???
 */
function imageUrl(number, parameters) {
	return 'http://images.vpro.nl/images/'+number+(parameters||'');
}

/********************************** RATING *************************************/

/**
 * handles the rating
 */
function openRating(){
	var node = nodenr;
	if (typeof node == 'undefined'){
		printfire("Error: geen nodenr!");
  }
  //printfire("initRating: node: %o", node);
	getPersonalRating();

	function getPersonalRating(){
		if (typeof openRating.personalRating != 'undefined'){
			calculateRating(openRating.personalRating);
		}
		else{
			communityFunctionalityService.findRatingForUser(node, calculateRating);
    }
		function calculateRating(rating){
printfire('calc RAT', rating);
			if(!rating){
				rating = 0;
			}
			createRating(rating);
		}
	}

	function createRating(currentRating){
		printfire("createRating: currentRating: %o", currentRating);
		var starcount = 5;
		var starwidth = 20;
		var div = gE('ratingsterren');
		div.innerHTML = '';

		var personal = cE('div');
		personal.id = 'personalRating';
		div.appendChild(personal);


		var adjust = cE('div');
		adjust.id = 'adjustRating';
		p = cE('p', "Geef je eigen waardering:");
		adjust.appendChild(p);

		for(var i = 1; i <= starcount; i++){
			img = cE('img');
			img.id = 'ster'+i;
			img.src = '/pix/iconen/ster-lichtrood-16px.png';
			img.onmouseover = starMouseOver(i);
			img.onmouseout = starMouseOut(i);
			img.onclick = starClick(i);
			adjust.appendChild(img);
		}

		div.appendChild(adjust);

		showPersonalRating(currentRating);

		function starMouseOver(i){
			return function() {
				varRating(i);
			}
		}

		function starMouseOut(i){
			return function() {
				varRating(0);
			}
		}

		function varRating(i) {
			var ster;
			for (var j = 1; j <= 5; j++) {
				ster = document.getElementById('ster'+j);
				if (j <= i){
					ster.src = '/pix/iconen/ster-lichtrood-16px.png';
				}
				else{
					ster.src = '/pix/iconen/ster-999.png';
				}
			}
		}

		function starClick(i) {
			return function() {
				printfire("Rated: i*2: %o", i*2);
				openRating.personalRating = i*2;
				communityFunctionalityService.rate(node, i*2);
				createRating(i*2);
				setTimeout(gE('rating').onclick, 500);
			}
		}

	}
}

function setPersonalRating(currentRating) {
	printfire("BEEP! Gebruik showPersonalRating ipv setPersonalRating: het is heel verwarrend.");
	showPersonalRating(currentRating);
}

function showPersonalRating(currentRating) {
	printfire("showPersonalRating: currentRating: %o", currentRating);
	openRating.personalRating = currentRating;
	personal = document.getElementById('personalRating');
	if (!personal) {
		openRating();
		return;
	}
	personal.innerHTML = '';
	if (currentRating > 0) {
		var p = cE('p', "Jouw waardering:");
		personal.appendChild(p);
		var img;
		for (var i = 0, c = Math.ceil(currentRating/2); i < c; i++) {
			img = cE('img');
			img.src = "/pix/iconen/ster-999.png";
      img.style.width = '16px'; 
      img.style.height = '20px';
      //img.width = '16'; 
      //img.height = '20';
      img.className = 'png';
			personal.appendChild(img);
		}
		document.getElementById('adjustRating').style.display = 'none';
	}
	else {
		document.getElementById('adjustRating').style.display = 'block';
	}
}

/*******************************************************************************/

/**
 * @todo deze drie refactoren naar 1 function
 * setLoginButton, setDoemeeButton, setSitemapDoemeeButton
 */
function setLoginButton() {
	var comp = document.getElementById('menuLogin');
	if (!comp){
		return;
	}
	if(!loggedin) {
    // 4.1 rel-2: vraagteken linkt naar info
    //<a href="/3voor12inloguitleg">?</a>
		comp.innerHTML='<a id="login" href="'+savePath('/users/login.jsp?cssid=3voor12&referrer='+initialRequestURL)+'"><img src="/pix/navigatie/inloggen.png" width="64" height="20" alt="INLOGGEN"/></a>';
	}
	else {
		var str = '';
		if (loggedin == 'false' || /@no.nick/.test(name)) { // profile is not configured
			str += '<a class="tekst" href="'+savePath('/doemee/bewerkprofiel')+'">'+name+'</a>';
		}
		else {
			str += '<a class="tekst" href="'+savePath('/mijn3voor12/'+name+'/profiel')+'">'+name+'</a>';
		}
		str += '<a href="'+savePath('/users/accountinfo.jsp?cssid=3voor12')+'"><img src="/pix/iconen/aanpassen-wit.png" width="20" height="20" id="edit" alt="ACCOUNT AANPASSEN" title="ACCOUNT AANPASSEN"/></a>';
		str += '<a id="logout" href="'+savePath('/users/logout.jsp?cssid=3voor12&referrer='+initialRequestURL)+'"><img src="/pix/navigatie/uitloggen.png" width="72" height="20" alt="UITLOGGEN"/></a>';

		comp.innerHTML = str;
	}
}

function setDoemeeButton() {
	var comp = document.getElementById('doemeeLogin');
	if (!comp){
		return;
	}
	var classActief = '';
	if (/^\/mijn3voor12\//.test(document.location.pathname)){
		classActief = " class='actief'";
	}
	if(userNumber <= 0) {
		comp.innerHTML = '<a'+classActief+' id="persoonlijk" href="'+savePath('/users/login.jsp?cssid=3voor12&referrer=/doemee/overzicht/')+'"><img src="/pix/navigatie/mijn3voor12.png" width="90" height="20" alt="MIJN 3VOOR12"/></a>';
	}
	else {
		var str = '';
		if (loggedin == 'false' || /@no.nick/.test(name)) { // profile is not configured
			str += '<a'+classActief+' href="/doemee/bewerkprofiel"><img src="/pix/navigatie/mijn3voor12.png" width="90" height="20" alt="MIJN 3VOOR12"/></a>';
		}
		else {
			str += '<a'+classActief+' href="/mijn3voor12/'+name+'/profiel"><img src="/pix/navigatie/mijn3voor12.png" width="90" height="20" alt="MIJN 3VOOR12"/></a>';
		}
		comp.innerHTML = str;
	}
}

function setSitemapDoemeeButton() {
	var comp = document.getElementById('doemeeLoginSitemap');
	if (!comp){
		return;
	}
	if(userNumber <= 0){
		comp.innerHTML = '<h2><a class="persoonlijk" href="'+savePath('/users/login.jsp?cssid=3voor12&referrer=/doemee/overzicht/')+'">MIJN 3VOOR12</a></h2>';
	}
  else{
    var str = '';
		if(loggedin == 'false' || /@no.nick/.test(name)) { // profile is not configured
			str += '<h2><a href="/doemee/bewerkprofiel">MIJN 3VOOR12</a></h2>';
		}
    else{
			str += '<h2><a href="/mijn3voor12/'+name+'/profiel">MIJN 3VOOR12</a></h2>';
		}
		comp.innerHTML = str;
	}
}

/* end refactor */

function cancelEvent(evt){
  if(!evt){
    var evt = window.event;
	}
	evt.cancelBubble = true;
  if(evt.stopPropagation){
    evt.stopPropagation();
  }
}

function setUitleg(heeftInhoud, eigen) {
	if(heeftInhoud){
		var uitleg = document.getElementById('uitleg');
		if (eigen && uitleg){
			uitleg.style.display = 'block';
		}
	}
	else {
		if (eigen) {
			var leeg = document.getElementById('leeg-eigen');
		}
		else {
			var leeg = document.getElementById('leeg-ander');
		}
		if (leeg){
			leeg.style.display = 'block';
		}
	}
}

/**
 * @param {Object} elt
 * @deprecated as of 4.1 REL-2
 * @todo vervangen door communitybar new Wordt nog in speler.js gebruikt
 */
function inactiveAlert(elt) {
printfire('BEEP!!! inactiveAlert is deprecated');
	elt.onclick = function() {
		alert('Je moet inloggen om deze knoppen te gebruiken. Klik op de knop "inloggen".');
	}
}

/**
 * Make a string flat for use as filename, in url etc.
 *  
 * @param {Object} s
 * @author E.Martin
 * @todo still used?
 * @deprecated ???
 */
function flatten(s) {
	if (!s){
		return '';
	}
	var convstr = "E  f                              cP Y   Ca   R   23 u          AAAAAAACEEEEIIIIDNOOOOOxOUUUUYdBaaaaaaaceeeeiiiionooooo-ouuuuydy";

	s = s.replace(/&(.)[a-z]+;/g, '$1');
	news = '';
	for (var i = 0; i < s.length; i++) {
		c = s.charAt(i);
		ord = c.charCodeAt(0);
		if (ord >= 128){
			news += convstr.charAt(ord - 128);
		}
		else if (c.match(/[a-zA-Z0-9_]/) != c){
			news += " ";
		}
		else{
			news += c;
		}
	}
	news = news.replace(/^ *(.*?) *$/, '$1');
	news = news.replace(/ /g, '_');
	news = news.replace(/__+/g, "_");
	return news;
}

function tagcloud(elt) {
  if(typeof(noAjax) != 'undefined' && noAjax){ // voor forum header
    return;
  }
  fetchHTML("/components/tagcloud", tagcloudResponse);

  function tagcloudResponse(resp){
    elt.innerHTML = resp;
  }
}

/**
 * Parse format 20061019T111931
 * @param {Object} s
 */
function parseDateISO8601(s) {
	/([0-9]{4})([0-9]{2})([0-9]{2})T([0-9]{2})([0-9]{2})([0-9]{2})/.exec(s);
	return new Date(RegExp.$1, RegExp.$2 - 1, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6);
}

/**
 * Curry
 * @link http://en.wikipedia.org/wiki/Currying#JavaScript
 * @param {Object} f
 * @param {Object} x
 */
function curry(f,x){
  return function(){
    var arg=[x].concat(Array.prototype.slice.apply(arguments));
    return f.apply({},arg);
  };
}

/**
 * sets the Notification at the top of the site
 * @author B.Wikkeling
 */
function setNotification(){
	printfire('setNof');
	if(typeof inSpeler != 'undefined' && inSpeler){
    return;
  }
  if(messageService){ // tbv forum op react.nl
	  messageService.findCurrentSystemNotification(displayMsg);	
	}
  function displayMsg(resp){
    if(resp != ''){
      $("#notificationDiv").html('<div>'+resp+'</div>').slideDown('slow');
    }
  }
}

/**
 * @deprecated 20071022
 * @todo remove me
 * @param {Object} id
 */
function fixAd(id){
printfire('BEEP!!! fixAd is deprecated');
/*
  var adDiv = gE('ad_300x250');
  for(var i, len = adDiv.childNodes.length; i < len; ++i){
    printfire(adDiv.childNodes[i]);
  }

  printfire('ad %o', adDiv.childNodes);
  eval(adDiv.childNodes[0].childNodes[0]);
  //removeClass('div.hidden_ad');
*/
}

/**
 * checks of de gebruikte browser supported is.
 * @todo fixme
 */
function browserNotification(){
  if(typeof isBrowsercheckPage != 'undefined' && isBrowsercheckPage == true){
    $("#browserStringSpan").html('&nbsp;[' + $.browser.browser()+' versie ' + $.browser.version.string() + ' op '+$.browser.OS()+']');
    return;
  }
  var checked = $.cookie('browercheck');
  if(checked == 1){
    return;
  }
  setCookie('browercheck', 1);
  var browserOk = false;
  var allowed = [{os: 'Windows', browser: 'Firefox', version: 2},
                 {os: 'Windows', browser: 'Internet Explorer', version: 6},
                 {os: 'Mac OS', browser: 'Firefox', version: 2},
                 {os: 'Mac OS', browser: 'Safari', version: 2}];
  var userBrowser = {
    OS: $.browser.OS(),
    browser: $.browser.browser(),
		version: $.browser.version.number() 
	};
	for(var i=0, len=allowed.length; i<len; ++i){
    if(userBrowser.OS == allowed[i].os 
       && userBrowser.browser == allowed[i].browser
       && userBrowser.version >= allowed[i].version){
         browserOk = true;
         break;
       }
  }
  if(!browserOk){
    window.location.href = '/browsercheck/';
  }
  
}

/*******************************************************************************/

/**
 * AjaxNumComments
 * Haalt het aantal commentaars op voor de gehele pagina
 *
 * Usage
 * 
 * immediate:
 * displays all numComments for divs with class ajaxNumComments and id ending with 
 * nodenumber
 * AjaxNumComments.init();
 * 
 * with extra options
 * AjaxNumComments.setNodenr(12345678);
 * AjaxNumComments.setAutoReload();
 * AjaxNumComments.showComments();
 * 
 * Depends on  jQuery
 * 
 * @author Bjorn Wikkeling <bjorn@wikkeling.nl>
 * 
 */
var AjaxNumComments = {
  init: function(){
    this.showNumComments();
  },

  showNumComments: function(){
    this.handleShowComments();
    if(this.getAutoReload()){
      setInterval(curry(this.handleShowComments, this), 60000);
    }
  },

  handleShowComments: function(me){
    var me = me || this;
    var nodenr;
    me.tags = getElementsByClassName('ajaxNumComments', 'div');
    if(me.tags && me.tags.length > 0){
      DWREngine.beginBatch();
      for(var i=0,len=me.tags.length; i<len; ++i){
        if((nodenr = me.getNodenr()) && new RegExp(nodenr).test(me.tags[i].id)){
          communityFunctionalityService.countRelatedComments(nodenr, 
            {callback:curry(me.showComment, {el:me.tags[i], displayZero:me.getDisplayZero()})});    
          continue;
        }
        nodenr = me.getNumberFromId(me.tags[i]);
        if(nodenr != '##NUMBER##' && !isNaN(nodenr)){
          communityFunctionalityService.countRelatedComments(nodenr, 
            {callback:curry(me.showComment, {el:me.tags[i], displayZero:me.getDisplayZero()})});    
        }
      }
      DWREngine.endBatch();
    }    
  },
  
  showComment: function(params, response){
    $el = $(params.el);
    if(response > 0 || (params.displayZero == true && response == 0)){
      $el.removeClass('nullValue');
      // Bjorn: 20071016 - use jQuery html() method because innerHTML adds an 
			// extra <a> element ????
      $el.html(response);
    }
    else{
      if(!$el.hasClass('nullValue')){
        $el.addClass('nullValue');
      }
    }    
  },
  
  setAutoReload: function(b){
    this.autoReload = b || true;
  },

  setDisplayZero: function(b){
    this.displayZero = b;
  },

  setNodenr: function(n){
    this.nodenr = n;
  },
  
  getAutoReload: function(){
    return this.autoReload || false;  
  },

  getDisplayZero: function(){
    return this.displayZero || false;
  },

  getNodenr: function(){
    return this.nodenr || false;  
  },
  
  getNumberFromId: function(el){
    var num = el.getAttribute('id').split('_');
    return num[num.length-1];
  }
}

/*******************************************************************************/

/**
 * AjaxTags
 * Haalt de tags voor de gehele pagina op via Ajax.
 * 
 * usage:
 * var tags = AjaxTags;
 * tags.init(5);                  // optional 5 is max number of tags to display
 * tags.setMaxNum(5);             // 5 is max number of tags to display
 * tags.setClassname('col_fff');  // set the css classname for the tags <ul>
 * tags.showTags();               // show the tags
 * tags.setUseLink();             // adds a link for each tag to the tag page
 * tags.reload(nodenr);           // reload tags for a node number 
 * tags.setAutoReload();          // initializes autoreload after 60 seconds
 * tags.setUseBatch();            // batches the requests default: true
 * 
 * In template:
 * <div id="ajaxTags_${item.number}" class="ajaxTags"></div>
 * 
 * @author Bjorn Wikkeling <bjorn@wikkeling.nl>
 * 
 */
var AjaxTags = {
  init: function(n){
    if(n){ this.setMaxNum(n); }
    this.tags = getElementsByClassName('ajaxTags');
  },
  
  findTagsFor: function(nodenr, el){
    communityFunctionalityService.findTagsFor(nodenr, 0, this.getMaxNum(),  
      {callback:curry(this.showTag, {el:el, cls:this.getClassName(), useLink:this.getUseLink()})} );    
  },
  
  reloadTags: function(nodenr){
    this.findTagsFor(nodenr, document.getElementById('ajaxTags_'+nodenr));
  },

  showTags: function(){
    if(this.tags.length > 0){
      if(this.getUseBatch){
        DWREngine.beginBatch();  
      }
      for(var i=0,len=this.tags.length; i<len; ++i){
        var nodenr = this.getNumberFromId(this.tags[i]);
        this.findTagsFor(nodenr, this.tags[i]);
      }
      if(this.getUseBatch){
        DWREngine.endBatch();   
      }
    }
  },
   
  showTag: function(params, response){
    var h = '';
    if(response && response.length > 0){
      h += '<ul class="'+params.cls+'">';
      for(var j=0, len=response.length; j < len; j++){
        h += '<li>';
        h += params.useLink ? '<a href="/doemee/tags/'+escape(response[j].value)+'">'+unescape(response[j].value)+'</a>' : unescape(response[j].value);
        h += '</li>';
      }
      h += '</ul>';
    }
    params.el.innerHTML = h;
  },
  
  setClassName: function(str){
    this.className = this.className ? this.className += ' '+str : str;
  },
  
  setMaxNum: function(n){
    this.maxNum = n;
  },
  
  setUseBatch: function(b){
    this.useBatch = b || true;  
  },
  
  setUseLink: function(v){
    this.useLink = v || true;  
  },
  
  getClassName: function(){
    return this.className || 'tags';
  },
  
  getMaxNum: function(){
    return this.maxNum || 5;
  },

  getNumberFromId: function(el){
    var num = el.getAttribute('id').split('_');
    return num[num.length-1];
  },
  
  getUseBatch: function(){
    return this.useBatch || true;
  },

  getUseLink: function(){
    return this.useLink || false;
  }

}
 
/*******************************************************************************/

/**
 * AjaxRating
 * Haalt de ratings voor de gehele pagina op via Ajax.
 * 
 * usage:
 * var rating = AjaxRating;
 * rating.init();                   // initializes the object
 * rating.setColor();               // sets the star color default: lichtgrijs
 * rating.showRatings();            // show the tags
 * rating.setShowCount();           // show the number of ratings default: false
 * rating.setUseBatch();            // batches the requests default: true
 * 
 * In template:
 * <div id="ajaxRating_${item.number}" class="ajaxRating"></div>
 * 
 * @author Bjorn Wikkeling <bjorn@wikkeling.nl>
 * 
 */
var AjaxRating = {
  init: function(){
    this.ratings = $('.ajaxRating');
    this.initialized = true;
  },

  showRating: function(params, response){
    printfire('showRating', params, response);

    var h = '',
        img = '<img src="/pix/iconen/ster-'+params.color+'.png" width="18" height="20" alt="*" class="png';
        //img += params.cls ? ' '+params.cls : ''; 
        img += '" />';
        
    if(response){
      var rating = Math.round(response.averageRating/2) || 0;
      if(rating > 0){
        h += '<div class="'+params.cls+'">';
        for(var j=0; j < rating; ++j){
          h += img;
        }
        if(params.showCount && response.numberOfVotes){
          h += '<span>('+response.numberOfVotes+' stem';
          h += response.numberOfVotes > 1 ? 'men' : '';
          h += ')</span>';          
        }
        h += '</div>';
      }
    }
    printfire('html-ingn: %o - html: %o', params.el, response, h);
    $(params.el).html(h);
  },
  
  findRatingsFor: function(nodenr, el){
    communityFunctionalityService.findAverageRatingFor(nodenr,  
      {callback:curry(this.showRating, {el:el, cls:this.getClassName(),showCount:this.getShowCount(),color:this.getColor()})} );    
  },
  
  showRatings: function(){
    if(!this.initialized){
      this.init();
    }
    if(this.ratings.length > 0){
      if(this.getUseBatch){
        DWREngine.beginBatch();  
      }
      for(var i=0,len=this.ratings.length; i<len; ++i){
        var nodenr = this.getNumberFromId(this.ratings[i]);
        this.findRatingsFor(nodenr, this.ratings[i]);
      }      
      if(this.getUseBatch){
        DWREngine.endBatch();   
      }
    }
  },

  setClassName: function(str){
    this.className = this.className ? this.className += ' '+str : str;
  },
  
  setColor: function(c){
    this.color = c;  
  },

  setShowCount: function(b){
    this.showCount = b || true;  
  },

  setUseBatch: function(b){
    this.useBatch = b || true;  
  },

  getNumberFromId: function(el){
    var num = el.getAttribute('id').split('_');
    return num[num.length-1];
  },
    
  getShowCount: function(){
    return this.showCount || false;
  },

  getUseBatch: function(){
    return this.useBatch || true;
  },

  getClassName: function(){
    return this.className || '';
  },
      
  getColor: function(){
    return this.color || 'lichtgrijs';
  }

}

/*******************************************************************************/

/**
 * zet het aantal geregistreerde gebruikers in de menubalk
 * @param {Object} e DOM Element waar het getal in komt
 * @author Bjorn Wikkeling <bjorn@wikkeling.com>
 */
function setNumUsers(e){
//  return true;
  searchService.countAllUsers(handleResponse);
  function handleResponse(response){
    e.innerHTML = response;
  }
}

/**
 * zet het aantal groepen in de menubalk. wordt nog niet gebuikt
 * @param {Object} e DOM Element waar het getal in komt
 * @author Bjorn Wikkeling <bjorn@wikkeling.com>
 */
function setNumGroups(e){
  searchService.countAllGroups(handleResponse);
  function handleResponse(response){
    e.innerHTML = response;
  }
}

/************************* Communitybar newstyle *******************************/

/**
 * Communitybar functionaliteit.
 * depends on jQuery
 * @author B.Wikkeling
 */
var slideDiv = openSlide = null;
var communitybarLastLi;
function initCommunitybar(div){

  function handleClick(e){
    var e = e || window.event;
    var li = $(this);
    var what = li.find('img').attr('alt');
    slideDiv = li.parent().parent().siblings('div.slideDiv');
    if(openSlide){
      var close = openSlide[0] === slideDiv[0] && communitybarLastLi == what ? true : false; 
          openSlide.slideUp('fast', function(){
            openSlide.siblings().find('li.actief').removeClass('actief');
            openSlide.empty();
            if(window['after_cancel']){
              window['after_cancel']();
              window['after_cancel'] = null;
            }
            openSlide = close ? null : doSlide(e);
          });
       }
      else{
        openSlide = doSlide(e);
      }
    
  communitybarLastLi = what;
    
    function doSlide(e){
      beforeSlide(e);
      if(li.is('.noslide')){
        return afterSlide(e);
      }
      var html = $('#'+what+'-dialoog').children(".communitybar-dialoog").clone();
      if(!loggedin){
        html.find('.uitlegDiv').removeClass('hidden');
        html.find(".submit")
          .attr({src:'/pix/navigatie/inloggen-d30202.png', width: 75, value:'INLOGGEN_EN_BEWAREN'})
          .removeClass("submit")
          .addClass("inloggen_en_bewaren")
          .click(login_and_save);
      }
      else{
        html.find('.formulierDiv').removeClass('hidden');
        
        html.find('.submit')
          .attr({src:'/pix/navigatie/bewaren.png', width: 75, value:'BEWAREN'}) // voor IE nogmaals afbeelding erin :s
          .click(function(e){if(window['submit_'+what]){window['submit_'+what](e, slideDiv);}});
        
        //html.find('.meldingversturen_ie')
        //  .attr({src:'/pix/navigatie/melding_versturen.png', width: 115, value:'MELDING VESTUREN'}); // voor IE nogmaals afbeelding erin :s

      }
      html.find('.cancel')
        .attr({src:'/pix/navigatie/annuleren.png', width: 75, value:'ANNULEREN'}) // voor IE nogmaals afbeelding erin :s
        .click(function(e){if(window['cancel_'+what]){window['cancel_'+what](e, slideDiv);}else{cancel_slideDiv(e);}});
      
      slideDiv.html(html).slideDown('slow', function(){afterSlide();});    
      li.addClass('actief');
      
      return slideDiv;
    }
    
    function afterSlide(){
      if(window[what+'_afterSlide']){
        return window[what+'_afterSlide']();
      }
      return null;
    }
    
    function beforeSlide(e){
      if(window['restore_beforeSlide']){
        window['restore_beforeSlide'](e);
        window['restore_beforeSlide'] = null;
      }
      if(window[what+'_beforeSlide']){
        window[what+'_beforeSlide'](e);
      }
    }

  }
  
  var element = div ? '#'+div : document;
  $('ul.communitybarUl li', element)
    .addHighlight()
    .bind('click', handleClick);

  var urlParams = getUrlParam();
  if(urlParams && urlParams.refresh && urlParams.number && urlParams.lastAction){
    $('li', 'ul#bar_'+urlParams.number)
      .filter(function(i){
        return $('img', this).attr('alt') == urlParams.lastAction;
      })
      .click();
  }

}

function reageer_beforeSlide(){
	slideDiv = null;
	$('img[alt="addComment"]').focus().parent().click();
}

function reageer_afterSlide(){
  return $('div#addComment_SlideDiv');
}

/**
 * bookmark_afterSlide
 * wordt aangeroepen nadat de bookmark slide getoond wordt
 * @param {Object} params
 */
function bookmark_afterSlide(params){
	var defSites = {
		bookmarkSites: ['ekudos', 'delicious', 'nujij', 'digg', 'respons', 'technorati'],
		rssSites: ['bloglines', 'netvibes', 'google', 'windows_live', 'newsgator', 'pageflakes']
	};
	var params = params || {};
	var href = params.href || location.href;
	var title = params.title || document.title;
	var sites = defSites[params.sites] || defSites['bookmarkSites']; 
  var socialSites = { bloglines: {name: 'Bloglines', url: 'blogines.com', icon: 'icon_bloglines.gif',
                                  addLink: 'www.bloglines.com/sub?url=<<<URL>>>'},
	                    blinklist: {name: 'BlinkList', url: 'blinklist.com', icon: 'icon_blinklist.gif',
                                  addLink: 'blinklist.com/index.php?Action=Blink/addblink.php&amp;Description=<<<DESCRIPTION>>>&amp;Tag=<<<TAGS>>>&amp;Url=<<<URL>>>&amp;Title=<<<TITLE>>>'},
                      delicious: {name: 'delicious', url: 'del.icio.us', icon: 'icon_delicious.gif', 
                                  addLink: 'del.icio.us/post?v=2&amp;url=<<<URL>>>&amp;notes=&amp;tags=&amp;title=<<<TITLE>>>'},
                      digg: {name: 'Digg', url: 'digg.com', icon: 'icon_digg.gif',
                             addLink: 'digg.com/submit?phase=2&amp;url=<<<URL>>>&amp;bodytext=<<<DESCRIPTION>>>&amp;tags=<<<TAGS>>>&amp;title=<<<TITLE>>>'},
                      ekudos: {name: 'Ekudos', url: 'ekudos.nl', icon: 'icon_ekudos.gif',
                               addLink: 'ekudos.nl/artikel/nieuw?url=<<<URL>>>&title=<<<TITLE>>>&desc=<<<DESCRIPTION>>>'},
                      furl: {name: 'Furl', url: 'furl.net', icon: 'icon_furl.gif',
                             addLink: 'furl.net/storeIt.jsp?u=<<<URL>>>&amp;keywords=<<<TAGS>>>&amp;t=<<<TITLE>>>'},
                      google: {name: 'Google', url: 'google.com/ig', icon: 'icon_google.gif',
                                   addLink: 'fusion.google.com/add?feedurl=<<<URL>>>'},
                      msnreporter: {name: 'MSN Reporter', url: 'reporter.msn.nl', icon: 'icon_msnreporter.gif',
                                 addLink: 'reporter.msn.nl/?f=contribute&Title=<<<TITLE>>>&URL=<<<URL>>>&cat_id=7&tag_id=18&referrer=3VOOR12'},
                      netvibes: {name: 'Netvibes', url: 'netvibes.com', icon: 'icon_netvibes.gif',
                                   addLink: 'www.netvibes.com/subscribe.php?url=<<<URL>>>&type=feed'},
                      newsgator: {name: 'Newsgator', url: 'newsgator.com', icon: 'icon_newsgator.gif',
                                   addLink: 'www.newsgator.com/ngs/subscriber/subext.aspx?url=<<<URL>>>'},
                      newsvine: {name: 'Newsvine', url: 'newsvine.com', icon: 'icon_newsvine.gif',
                                 addLink: 'newsvine.com/_wine/save?popoff=1&amp;u=<<<URL>>>&amp;tags=<<<TAGS>>>&amp;blurb=<<<TITLE>>>'},
                      nowpublic: {name: '', url: '', icon: '',
                                  addLink: ''},
                      nujij: {name: 'NUjij', url: 'nujij.nl', icon: 'icon_nujij.gif',
                              addLink: 'www.nujij.nl/jij.lynkx?t=<<<TITLE>>>&u=<<<URL>>>'},
                      pageflakes: {name: 'Pageflakes', url: 'pageflakes.com', icon: 'icon_pageflakes.gif',
                              addLink: 'www.pageflakes.com/subscribe.aspx?url=<<<URL>>>'},
                      respons: {name: 'Re:spons', url: 're-spons.nl', icon: 'icon_respons.gif',
                              addLink: 'respons.omroep.nl/goed?title=<<<TITLE>>>&url=<<<URL>>>&category=muziek'},
                      technorati: {name: 'Technorati', url: 'technorati.com', icon: 'icon_technorati.gif',
                                   addLink: 'technorati.com/faves?add=<<<URL>>>&amp;tag=<<<TAGS>>>'},
                      windows_live: {name: 'Windows Live', url: 'live.com', icon: 'icon_windows_live.gif',
                                   addLink: 'www.live.com/?add=<<<URL>>>'}
										 };

  for (var i = 0, len = sites.length; i < len; i++) {
    var link = socialSites[sites[i]].addLink
                 .replace(/<<<URL>>>/,encodeURIComponent(href))
                 .replace(/<<<TITLE>>>/, encodeURIComponent(title))
                 //.replace(/<<<TAGS>>>/, encodeURIComponent(document.title))
                 //.replace(/<<<DESCRIPTION>>>/, encodeURIComponent(document.title))
                 .replace(/<<<(.*)>>>/, '');

    var h = '';
    h += '<div>';
    h += '<a href="http://' + link + '" title="' + socialSites[sites[i]].name + '" rel="nofollow">';
    h += '<img src="/pix/bookmarks/' + socialSites[sites[i]].icon + '" alt="" width="20" height="20" title="' + socialSites[sites[i]].name + '" /><strong>' + socialSites[sites[i]].name + '</strong>';
    h += '</a>';
    h += '</div>';

    $(h)
      .find('a')
      .bind('click', function(e){
			  e.preventDefault();
				var u = $(this).attr('href');
        if($.browser.msie){
					document.location.href = u; 
				}
				else{
					window.open(u, 'addFeedWindow');
				}
			})
      .end()
      .appendTo(slideDiv.find('div.socialbookmarks'));
	}

}

/**
 * rating
 */
function rating_beforeSlide(){
 var starRedSrc = '/pix/iconen/ster-lichtrood-16px.png',
     starGreySrc = '/pix/iconen/ster-999.png',
     starCount = 5,
     starWidth = 16,
     starHeight = 20,
     strRate = 'Geef je eigen waardering',
     strOwnRating = 'Jouw waardering',
     strNoRatings = 'Er zijn nog geen waarderingen',
     strRatings = 'Gemiddelde waardering',
     strRated = 'Je waardering is opgeslagen',
     personalRating = 0,
     nodenr = $(slideDiv).attr('id').match(/communitybarbar_([\d]+)SlideDiv/)[1];

  function createStarHtml(id, n){
    var h = '',
        num = n || starCount,
        type = id || 'personal';
    for(i = 1; i <= num; ++i){
      h += '<img id="'+type+i+'" src="'+starGreySrc+'" alt="*" width="'+starWidth+'" height="'+starHeight+'" />'; 
    }
    return h;
  }
  
  function createRatingHtml(p){
    var html = '',
        params = p || {},
        averageRating = Math.round(params.averageRating/2) || 0,
        numberOfVotes = params.numberOfVotes || 0;
    
    html += '<p>';
    if(averageRating > 0){
      html += strRatings;
      html += ' ('+numberOfVotes+' stem';
      html += numberOfVotes > 1 ? 'men' : '';
      html += '):';
      html += '</p>';
      html += createStarHtml('global', averageRating);
    } else {
      html +=  strNoRatings;
      html += '</p>';
    }

    $('#globalrating').html(html);
  }
  
  function createPersonalRatingHtml(current){
    var html = '';
    personalRating = Math.round(current/2) || 0;
    
    function getIdFromStar($img){
      return $img.attr('id').match(/personal([\d]+)/)[1];;
    } 
       
    function setRating(n){
      $('#personalrating img').each(function(i){
        if(i <= n - 1 && n != 0){
          $(this).attr('src', starRedSrc);
        } else {
          $(this).attr('src', starGreySrc);
        }
      });
    }
    
    function rated(response){
      function fadeRated(){
        $('#personalrating div.rated').fadeOut('slow', function (){
          $(this).remove();
//          rating_afterSlide(); // TODO dichtklappen of reloaden?
          cancel_slideDiv();
        });
      }
      $('#personalrating p')
        .html(strOwnRating)
        .parent('div')
        .append('<div class="rated">'+strRated+'</span>')
        .fadeIn();
      setRating(personalRating);
      setTimeout(function(){fadeRated();}, 2000);
      waitStop();  
    }
    
    function starMouseOver(e){
      var id = getIdFromStar($(e.target));
      setRating(id);
    }
    
    function starMouseOut(){
      setRating(personalRating);
    }
  
    function starMouseClick(e){
      waitStart();  
      personalRating = getIdFromStar($(e.target));
      communityFunctionalityService.rate(nodenr, personalRating*2, rated);
    }

    if(personalRating > 0){
      html += '<p>'+strOwnRating+'</p>';
      html += createStarHtml('personal');     
    } else {
     html += '<p>'+strRate+'</p>';
     html += createStarHtml('personal');
    }
    
    $('#personalrating')
      .html(html)
      .find('img')
      .hover(starMouseOver, starMouseOut)
      .bind('click', starMouseClick);
    
    setRating(personalRating);
  }   
  
  communityFunctionalityService.findAverageRatingFor(nodenr, createRatingHtml);
  if(loggedin){
    communityFunctionalityService.findRatingForUser(nodenr, createPersonalRatingHtml);
  }

}

function rss_afterSlide(){
  var u = pageFeed;
  var t = document.title;
  var params = {href: u, title: t};
  bookmark_afterSlide(params);
  slideDiv
    .find('span.feedUrl')
		.html('<a href="'+u+'" target="_new">'+u+'</a>');  
}

function tag_afterSlide(){
  slideDiv.find('input[name=taginput]')
    .each(function(){if(loggedin){this.focus();}})
    .keypress(function(e){
      var e = e || window.event;
      if(e.keyCode==13){submit_tag();}
    });
}

/**
 * Print page
 */
var printPaginaWindow = null;
function print_afterSlide(){
  if(canPrintFromIFrame()){
    printPaginaWindow = window.open('/3voor12ce/blijf_op_de_hoogte/print_template.html', 'print_pagina', 'width=400,height=400,resizable');
  }
  else {
    var iframe = document.getElementById('print_pagina');
    if(!iframe){
      iframe = document.createElement('iframe');
      iframe.height = 0;
      iframe.width = 0;
      iframe.style.border = 'none';
      iframe.id = 'print_pagina';
      _D.body.appendChild(iframe);
      /*
      $('<iframe>')
        .css({height: 0, width: 0, border: 'none'})
        .attr({height: 0, width: 0, id: 'print_pagina'})
        .appendTo('body');
      */        
    }
  iframe.src = '/3voor12ce/blijf_op_de_hoogte/print_template.html';
  }
}

function printPaginaVerder(d) {
  var b = d.body;
  var link = d.createElement('p');
  link.className = 'url';
  link.innerHTML = document.URL;
  b.appendChild(link);
  var kop = d.createElement('div');
  kop.className = 'kop';
  kop.innerHTML = document.getElementById('artikelkop').innerHTML;
  b.appendChild(kop);
  var artikel = d.createElement('div');
  artikel.innerHTML = document.getElementById('artikel').innerHTML;
  b.appendChild(artikel);

  setTimeout(print, 50);

  function print() {
    if (canPrintFromIFrame()) {
      if (printPaginaWindow){
        printPaginaWindow.print();
			}
    }
		else {
      var iframe = document.getElementById('print_pagina');
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  }
}

function canPrintFromIFrame() {
  return /MSIE 6/.test(navigator.userAgent);
}
/* end print */

/**
 * comments
 */
function addComment_afterSlide(){
//console.log('22 addCOmment b4 makeRich %o',slideDiv.find('textarea[name=commentBody]')[0]);
  makeRichText(slideDiv.find('textarea[name=commentBody]')[0], 'WeblogReact', {width: 480, height:240});
  focusText('commentBody');
}

/**
 * cancel_slideDiv
 * slides the openSlideDiv back up
 * @param {Object} e
 * @param {Object} params
 */
function cancel_slideDiv(e, params){
//printfire('cancel_slideDiv %o - %o', e, openSlide);
  var params = params || {};
	waitStop();
	if(e){
    e.preventDefault();
    //this.blur(); 
  }
  openSlide.slideUp('fast', function(){
    openSlide.siblings().find('li.actief').removeClass('actief');
    openSlide.empty();
    openSlide = null;
    if(window['after_cancel']){
      window['after_cancel']();
      window['after_cancel'] = null;
    }
    if(typeof oFCKeditor != 'undefined'){
      oFCKeditor = null;
    }
    if(params.callback){
      params.callback();
    }
  });
}

function submit_addComment(){
  communityFunctionalityService.comment('', getText('commentBody'), number, submitted_adComment);
  function submitted_adComment(){
    cancel_slideDiv();
		var sort = true;
		if(typeof commentSort != 'undefined'){
			sort = commentSort;
		}
    loadCommentsFor(number, 0, 50, sort);
    var numComments = AjaxNumComments;
    numComments.setNodenr(number);
    numComments.showNumComments();
    oFCKeditor = null;
  }
  //slide(document.getElementById('reageerbox'), {after: function(){clearText('reageerbody')}});
}

function submit_bookmark(){
  var title = slideDiv.find('textarea[name=bookmarktitel]').val();
  var oms = slideDiv.find('textarea[name=bookmarkomschrijving]').val();
  var url = spelerUrl || document.location.href;
  communityFunctionalityService.bookmark(url, title, oms);
  cancel_slideDiv();
}

function submit_bookmarkSmall(){
  submit_bookmark();
}

function submit_makefriend(){
  waitStart();
  profileService.makeFriend(profileName, waitStop);
  cancel_slideDiv();
}

function submit_rss(){
	if(pageFeed && pageFeed != ''){
		waitStart();
		rssReaderService.createFeed(pageFeed, submitted_rss);
	}
	else{
    submitted_rss();
	}
  
	function submitted_rss(){
    cancel_slideDiv();
    waitStop();
  }
}

function submit_sendafriend(){
  waitStart();
  var email = slideDiv.find('input[name=email]').val();
  var subject = slideDiv.find('input[name=emailSubject]').val();
  var body = slideDiv.find('textarea[name=emailBody]').val();
  var url = spelerUrl || document.location.href;
  
  communityFunctionalityService.sendAFriendEmail(email, subject, body, url, function() {
    cancel_slideDiv();
    waitStop();
  });
}

function submit_tag(){
  var tag = openSlide.find('input[name=taginput]').addClass('busy').val().toLowerCase();

  if(tag == ''){
    cancel_slideDiv();
  }
  waitStart();
  var id = getNumberFromSlideDiv(openSlide);
printfire('TAG:: %o, opeS: %o, id: %o', escape(tag), id, openSlide);
  communityFunctionalityService.tag(escape(tag), id, submitted_tag);
  
  function submitted_tag(response){
    AjaxTags.reloadTags(id);
    cancel_slideDiv();
    waitStop();  
  }
}

//TODO check op safari zie: function login(){}
function login_and_save(e){
	printfire('login_and_save %o', openSlide); 
  if(e){
    e.preventDefault();
    //e.blur();
  }
  afterLoginParams.lastAction = openSlide.siblings().find('li.actief img').attr('alt');
  afterLoginParams.number = getNumberFromSlideDiv(openSlide);
  loginNew();
}

function getNumberFromSlideDiv(div){
  var div = div || slideDiv;
	var num = $(div).attr('id').match(/communitybarbar_([\d]+)SlideDiv/);
  return num ? num[1] : '';
}

function submit_on_enter(element, what){
  var c = evt ? evt.keyCode : window.event.keyCode;
  if(c == 13 && window['submit_'+what]){
    window['submit_'+what](el, slideDiv);
  }
}

/**************************** end communitybar ********************************/

/*** comments ***/
function deleteComment(el, n) {
  if(confirm('Weet je zeker dat je deze reactie wilt verwijderen?')){
    communityFunctionalityService.deleteComment(n,
      {callback:curry(deletedComment, el)});
  }
  
  function deletedComment(el){
    $(el).parent().parent().parent().slideUp('fast');
    var numComments = AjaxNumComments;
    numComments.setNodenr(number);
    numComments.setDisplayZero(true);
    numComments.showNumComments();
  }
}

/**
 * laadt de reacties voor een bepaalde node
 *  
 * @param {Object} nodenr
 * @param {Object} offset
 * @param {Object} count
 * @param {Object} sort
 * @author B.Wikkeling
 */
function loadCommentsFor(nodenr, offset, count, sort){
  waitStart();
  var totalComments = 0;
	var offset = offset || 0;
  var count = count || 999;
  var sort = sort || false;

printfire('loadC', nodenr, offset, count, sort);
	function callback(response){
		if(response > 0){
      totalComments = response;
			$("#commentsDiv").slideUp('fast', function(){
        $(this).empty();
        communityFunctionalityService.findCommentsForReverseable(nodenr, offset, count, sort, showComments);
      });
		}
		else{
			waitStop();
		}
	}
  
	function appendComments(nodenr, offset, count, sort){
		$('ul.meerreacties').remove();
		communityFunctionalityService.findCommentsForReverseable(nodenr, offset, count, sort, showComments);
	}
	
  function showComments(comments){
//printfire('show comm');
		var more_html = '';
    more_html += '<ul class="meerreacties">';
    if(totalComments > comments.length+offset){
      more_html += '<li class="right">';
			more_html += '<img src="/pix/navigatie/meerreacties.png" width="130" height="20" alt="MEER REACTIES" title="Klik hier voor meer reacties."/>';
      more_html += '</li>';
    }
		if(totalComments > 1){
		  more_html += '<li class="numPosts">1 - '+(comments.length + offset)+' van '+totalComments+' reacties';
    }
		more_html += '</li></ul> ';
		$more_html = $(more_html);

    for(var i = 0, len = comments.length; i < len && i < count; i++){
      var html = createCommentHtml(comments[i]);
      $("#commentsDiv").append(html);
    }
		$more_html.appendTo('#commentsDiv');
		if(totalComments > comments.length+offset){
      $more_html
		    .click(function(){
          //printfire('click!', nodenr, offset, count, sort);
          appendComments(nodenr, offset, count, sort);
        });
    }
    offset += comments.length;
		$("#commentsDiv").slideDown('fast', function(){waitStop();});
    waitStop();
	} 
  
  function createCommentHtml(comment){
    var headerHtml, bodyHtml, html, username='';
    // workaround: sommige postings hebben soms geen user Object :s
    var user = comment.user || {};
    var anchorHtml = '<a name="comment_'+comment.number+'"></a>';
    if(user.profile && user.profile.image){
      headerHtml = '<img class="userimage" src="'+user.profile.image.URL+'+s(!30x!20)+f(asis)" width="30" height="20" alt="" />';
    }
    else{
      headerHtml = '<img class="userimage" src="/pix/iconen/user-lichtrood-op-ccc.gif" width="30" height="20" alt="" />';
    }     
    var deleteImg = '';
    if(loggedin && (user.number == userNumber || isMijnProfiel)) {
      deleteImg = '<img class="delete" src="/pix/iconen/delete.png" width="20" height="20" onclick="deleteComment(this, '+comment.number+')">';
      //<img src="/pix/iconen/aanpassen-lichtrood.png" width="20" height="20" onclick="editComment(this, '+comment.number+')">';
    }
		var	warningImg = '<img class="warning" src="/pix/iconen/waarschuwing.png" alt="Waarschuwing" width="20" height="20" onclick="abuseSlide(this, '+comment.number+')"/>';
    
    if(user.siteAccount){
      username = user.siteAccount.replace('@no.nick', '');
    }

    if(user.profile && username != '') {
      var url = '/mijn3voor12/'+username;
      headerHtml = '<a href="'+url+'/weblog">'+headerHtml+'</a>';
      username = '<a href="'+url+'/profiel"><b>'+username+'</b></a>';
    }
    headerHtml += username ? username+' - ' : '';
    headerHtml += getDate(comment.created)+' '+getTime(comment.created);    
    
    bodyHtml = comment.body.replace(/&apos;/g, '\'');
    if (!bodyHtml.match(/<p>/)){
      bodyHtml = '<p>'+bodyHtml+'</p>';
    }
    
    html = '<div class="commentContainerDiv" id="commentContainer_'+comment.number+'">';
    html += '<div class="commentHeader">'+anchorHtml+'<h4>'+warningImg+deleteImg+headerHtml+'</h4></div>';
    html += '<div id="commentsSlideDiv_'+comment.number+'"></div>';
    html += '<div class="commentBody">'+bodyHtml+'</div>';
    html += '</div>';
    return html;
  }
  
  communityFunctionalityService.countRelatedComments(nodenr, callback);

}

/**
 * Abuse melding
 */
var commentsSlideDivObj = {};   
function abuseSlide(el, nodenr){
  for(k in commentsSlideDivObj){
		slideDivUp(true);
		break;
  }

	var commentsSlideDiv = $('#commentsSlideDiv_'+nodenr);
	commentsSlideDivObj['element'] = commentsSlideDiv; 
	commentsSlideDivObj['icon'] = $(el);
  commentsSlideDivObj['icon'].addClass('actief');

	var html = $('#comments_warning_template').children().clone();
  if(!loggedin){
    html.find('.uitlegDiv').removeClass('hidden');
    html.find(".submit")
      .attr({src:'/pix/navigatie/inloggen-d30202.png', width: 75, value:'INLOGGEN_EN_BEWAREN'})
      .removeClass("submit")
      .addClass("inloggen_en_bewaren")
      .click(login_first);
  }
  else{
    html.find('.formulierDiv').removeClass('hidden');
    html.find('.submit').click(
		  function(e){
				communityFunctionalityService.increaseModerationLevel(nodenr, slideDivUp);
			}
		);
  }
  
  function login_first(){
		//makeframebox(savePath("/users/login.jsp?cssid=3voor12&referrer=/3voor12ce/home/signon.jsp"), 440, 500, 'signon');
		/**
		 * @todo clean this up! dd 20071122
		 */
		loginNew();
	}
	
	html.find('.cancel').click(function(e){ slideDivUp(false); });
	commentsSlideDiv.html(html).slideDown('slow');
	
	function slideDivUp(preserveObj){
//printfire('preserveObj:: ', preserveObj);
		commentsSlideDivObj['icon'].removeClass('actief');
    commentsSlideDivObj['element'].slideUp('fast', emptyObj);
		function emptyObj(){
			if(!preserveObj){
				commentsSlideDivObj = {};
			}
    }
	}    

}
/*** end display comments ***/

/* jQuery functions ***********************************************************/

/**
 * 
 * @param {Object} params
 * @author Bjorn Wikkeling <bjorn@wikkelng.com>
 * @todo is params.link nog nodig?
 */
jQuery.fn.addHighlight = function(params){
  var params = params || {};
  return this.hover(addHover, removeHover);
  
  function addHover(evt){
    $(this).addClass('highlight').click(handleClick);
  }
  
  function removeHover(evt){
    $(this).removeClass('highlight').click(handleClick);
  }
  
  function handleClick(){
    var a = $(this).find('a')[0];
//if ((a && a[0]) || (params && params.link === false))
    if(params.skipOnclick !== true && a){
      if (a.getAttribute('rel') == 'speler' || /\/speler\/(tv|radio|luisterpaal|ondemand)\//.test(a.href)){
        openSpeler('', {url: a.href})
      }
      else if(a.getAttribute('rel') == 'lightbox'){
        $(a).click();
      }
      else{
        _D.location = a.href;
      }
      return false;
    }
    else if(params && params.clickHandler){
      params.clickHandler(this);
    }
  }
}

/**
 * selecteer een optie van een select dropdown
 * @param {Object} value
 * @param {Object} clear
 */
jQuery.fn.selectOptions = function(value, clear){
  var c = clear || false;
  this.each(
    function(){
      if(this.nodeName.toLowerCase() != "select") {
        return this;
      }
      var o = this.options;
      for(var i=0, ln=o.length; i<ln; i++){
        if(o[i].value == value){
          o[i].selected = true;
        }
        else if(c){
          o[i].selected = false;
        }
      }
    }
  );
  return this;
};

/************************** end jQuery functions ******************************/

/**
 * loadComponent
 * Loads html via Ajax end injects on the page
 * 
 * @param {Object} comp
 * @param {Object} params
 * @author B.Wikkeling
 * @todo is hidden_ad deprecated?
 */
function loadComponent(comp, params){
  var params = params || {};
  printfire('LC', comp, params);
  fetchHTML('/components/'+comp, handleResponse);  
  
  function handleResponse(resp){
    var divx = (typeof params.div != "undefined")? params.div : 'componentResponse';
	$('#'+divx).html(resp).find('.mouseover').addHighlight();
    if(params.afterFunc){
      params.afterFunc();
    }    
  }
}

/**
 * verwijderd alle dubbele waarden uit een array
 * @param {Object} arr
 */
/*
// veranderd volgorde!
function removeDuplicates(arr){
  arr.sort();
	for(var i = 0; i< arr.length; ++i){
		while(arr[i] === arr[i+1]){
			arr.splice(i+1, 1);
		}
	}
	return arr;
}
*/
function removeDuplicates(a) {
  var tmp = [];
  for(var i=0, len=a.length; i<len; ++i){
    if(!contains(tmp, a[i])){
      tmp.push(a[i]);
    }
  }
  return tmp;

  function contains(a, e) {
    for(var i=0, len=a.length; i<len; ++i){
      if(a[i] === e){
        return true
      }
    }
    return false;
  }
}

/**
 * Initialize the page....
 * 
 * !!! KEEP THIS AT THE BOTTOM OF THIS FILE !!!
 *  
 */
$(document).ready(function(){
  initMain();
});

$(document).unload(function(){
  cleanUpAll();
});