<?php

/*
 * Peek?
 */

/*
 * Caching proxy
 *
 * Setup
 *
 * Create a directory "cache" in the same directory as this script and make this directory writable by the webserver
 *
 *
 * Copyright 2013 Edwin Martin <edwin@bitstorm.org>
 *
 * Lisense: MIT
 *
 */

/*
 * Configuration
 */

$config = array(
  'twitter' => array('url' => '', 'expires' => 60 * 60),
  'github' => array('url' => 'https://api.github.com/users/edwinm/repos', 'expires' => 60 * 60, 'origin' => array("http://test.bitstorm.nl"))
);

/*
 * Code
 */

define("USERAGENT", "caching-proxy.php (+http://www.bitstorm.org)");

set_exception_handler("exceptionHandler");

$target = $_GET["target"];
$targetData = $config[$target];


if (!preg_match('/^[a-zA-Z0-9_-]+$/', $target)) {
	throw new Exception("'$target' is a invalid target.");
}

if (!array_key_exists($target, $config)) {
    throw new Exception("'$target' is a unknown target.");
}

$requestHeaders = getAllHeaders();

if ($targetData["origin"] && $requestHeaders['Origin'] && !in_array($requestHeaders['Origin'], $targetData["origin"])) {
    throw new Exception($requestHeaders["origin"]." is an invalid origin.");
}


$scriptDir = dirname($_SERVER["DOCUMENT_ROOT"].$_SERVER["SCRIPT_URL"]);
$file = "$scriptDir/cache/$target";

$url = $targetData["url"];
$expires = $targetData["expires"];

$filestat = stat($file);

if ($filestat === false || $filestat["size"] == 0 || $filestat["mtime"] + $expires < time()) {
    fetchUrl($url, $file);
    $filestat = stat($file);
}

if (httpDateToTimestamp($requestHeaders["If-Modified-Since"]) ==  $filestat['mtime']) {
    header( "HTTP/1.0 304 Not Modified" );
    exit;
}

$contents = file_get_contents($file);

list($headerText, $body) = preg_split("/\\r\\n\\r\\n/", $contents);

$header = parseHeader($headerText);

header("Content-Type: ".$header['Content-Type']);
header("Content-Length: ".strlen($body));
header("Last-Modified: ".gmstrftime( "%a, %d %b %Y %H:%M:%S GMT", $filestat['mtime']));
header("Expires: ".gmstrftime( "%a, %d %b %Y %H:%M:%S GMT", $filestat['mtime'] + $expires));
if ($targetData["origin"]) {
    header("Access-Control-Allow-Origin: ".$requestHeaders['Origin']);
    header("Access-Control-Allow-Credentials: true");
}
echo $body;



/*
 * Functions
 */

function fetchUrl($url, $file) {
    $curl = curl_init($url);
    $fh = fopen($file, "w");

    curl_setopt($curl, CURLOPT_USERAGENT, USERAGENT);
    curl_setopt($curl, CURLOPT_FILE, $fh);
    curl_setopt($curl, CURLOPT_HEADER, 1);

    curl_exec($curl);
    curl_close($curl);
    fclose($fh);
}

function parseHeader($header) {
    $header = preg_split("/\\r\\n/", $header);

    $newHeader = array();
    foreach($header as $key => $field) {
        preg_match("/^([^:]+): ?(.*)$/", $field, $match);
        $newHeader[$match[1]] = $match[2];
    }

    return $newHeader;
}

function httpDateToTimestamp($dateStr) {
    $months = Array(    "Jan" => 1, "Feb" => 2, "Mar" => 3, "Apr" => 4,
   				        "May" => 5, "Jun" => 6, "Jul" => 7, "Aug" => 8,
   				        "Sep" => 9, "Oct" => 10, "Nov" => 11, "Dec" => 12 );

	if ( preg_match( "/[A-Za-z]+, ([0-9]+) ([A-Za-z]+) ([0-9]+) ([0-9]+):([0-9]+):([0-9]+)/", $dateStr, $regs ) ) {
		$timestamp = gmmktime( $regs[4], $regs[5], $regs[6], $months[$regs[2]], $regs[1], $regs[3] );
	} else {
		$timestamp = 0;
	}

    return $timestamp;
}

function exceptionHandler($exception) {
    header("Content-Type: application/json; charset=utf-8", false, "400 Bad Request");
    echo "{\"errors\": [{\"message\": \"".htmlentities($exception->getMessage())."\"}]}\r\n";
}