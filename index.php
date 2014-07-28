<?php

// Path to config file (relative or absolute)
const CONFIG_FILE = './config.php';


///// DO NOT EDIT BELOW /////


// Init auto-loader
require_once(implode(DIRECTORY_SEPARATOR, array(__DIR__, 'vendor', 'autoload.php')));

// Set class references
use GeoPal\Map\Config;
use GeoPal\Map\Tracker;

// Store and clean up action request alias param (if present)
$action = isset($_GET['action'])
    ? preg_replace('/[\W]*/', null, $_GET['action'])
    : null;

// Create Map Tracker instance
$tracker = Tracker::create(Config::create(CONFIG_FILE));

// Process request
if (empty($action)) {
    $tracker->renderMap()->dumpHTML();
} else {
    $tracker->getData($action);
}
