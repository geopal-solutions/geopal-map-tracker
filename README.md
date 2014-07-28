geopal-map-tracker
==================

This stand-alone page allows you to track your employees via GeoPal, from within your own project.

![screenshot](https://raw.githubusercontent.com/geopal-solutions/geopal-map-tracker/master/ScreenShot.png)

# Requirements

This project requires PHP 5.3 or greater. You will also need to have [composer](https://getcomposer.org/) installed on your machine to be able to set up the project and install all dependencies.


# Installation

* Clone or download project files to your machine. 
* Run `php composer.phar install`.
* Create a new file called `config.php` from `config_default.php` and modify it with your own settings.
* You are all set.


# Usage

There are multiple ways to use the stand-alone map:

* You can go and display the `index.php` file (as a stand-alone page or in an `iframe` tag). This is the recommended way.
* You can instantiate the Tracker class as shown in the example below, then you can generate the HTML required to display the map, and show it programmatically wherever you see fit. For issues with this approach, please refer to the `Notes` section at the end of this README.

## Example for Tracker class instantiation

```php
use GeoPal\Map\Config;
use GeoPal\Map\Tracker;

$config = Config::create('/path/to/config/file.php');
$tracker = Tracker::create($config);
 
// Render main map page
$tracker->renderMap();

// Get rendered HTML into a variable
$html = $tracker->getHTML();

// Print rendered page onto the screen
$tracker->dumpHTML();

// Do a REST-like call to get employee data from GeoPal (you should never have to do this manually)
$response = $tracker->getData('employees', false);
```

# Notes

In case you are not using the `index.php` file to display the page, please note that currently all async calls are made against the current URL (e.g. `?action=employees`). This means you will need to have very similar logic in place to those found in `index.php`, in order to get a working solution this way.
