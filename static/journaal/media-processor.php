<?php
/* Copyright 2008-2011 Edwin Martin <edwin@bitstorm.org> */

// See http://www.imagemagick.org/script/command-line-options.php

error_reporting(E_ALL);

$config = array(
	'screen' => "-resize 850x600",
	'head' => "-resize 684x700",
	'large' => "-resize 588x500",
	'thumb' => "-resize 200x92",
	'cmsthumb' => "-resize 92x92",
	'tiny' => "-resize 40x40"
);

$root = $_SERVER["DOCUMENT_ROOT"];
$file = $root.$_SERVER["SCRIPT_URL"];

/*$root = "/usr/local/sites/www.bitstorm.org/web";
$file = $root."/journaal/2014-6/img_5298~cmsthumb.jpg";*/

$parts = pathinfo($file);
list($basename, $proc) = explode('~', $parts['filename']);
$ext = $parts['extension'];
$orgFile = $parts['dirname'].'/'.$basename.'.'.strtolower($ext);

$imCmd = "-auto-orient " . $config[$proc];

// Security check
if (!preg_match('/^[a-zA-Z0-9:\\/ _~.()-]+$/', $file)) {
	throw new Exception("'$file' is not a valid filename.");
}

// TODO: add bindir to PATH
if (isset($imCmd)) {
	$cmd = "/usr/bin/convert $imCmd \"$orgFile\" \"$file\"";
}

//system($cmd, $ret);

$ret = my_shell_exec($cmd, $stdout, $stderr);

if ($ret == 1) {
//	$fp = fopen("/var/log/http/bitstorm.org/convert-err.log", "a");
//    fwrite($fp, "Command failed: '$cmd' [$stdout][$stderr]");
//    fclose($fp);
	throw new Exception("Command failed: '$cmd' [$stdout][$stderr]");
}

switch($ext) {
	case 'jpg':
		$mimeType = 'image/jpeg';
		break;
	case 'png':
		$mimeType = 'image/png';
		break;
	case 'gif':
		$mimeType = 'image/gif';
		break;
}

header("Content-type: $mimeType");
echo file_get_contents($file);

function my_shell_exec($cmd, &$stdout=null, &$stderr=null) {
	$proc = proc_open($cmd,[
		1 => ['pipe','w'],
		2 => ['pipe','w'],
	],$pipes);
	$stdout = stream_get_contents($pipes[1]);
	fclose($pipes[1]);
	$stderr = stream_get_contents($pipes[2]);
	fclose($pipes[2]);
	return proc_close($proc);
}
?>
