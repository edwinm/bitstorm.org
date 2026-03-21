<?php

$md5 = md5($_GET['q']);

header("Content-Type: application/json");

echo "{\"md5\": \"$md5\"}";