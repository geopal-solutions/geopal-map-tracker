<?php

return array(

    /**
     * Mandatory
     *
     * Default center point for the map
     */
    'defaultMapCenter' => '53.409869,-8.238308',

    /**
     * Mandatory
     *
     * Default zoom level for the map
     */
    'defaultMapZoom' => 6,

    /**
     * Mandatory
     *
     * A valid GeoPal employee id (not identifier!) to query GeoPal for data
     * This value must be passed as an integer
     */
    'geoPalEmployeeId' => null,

    /**
     * Mandatory
     *
     * A valid GeoPal API key to query GeoPal for data
     */
    'geoPalAPIKey' => '',

    /**
     * Mandatory
     *
     * A Google API key to remove limitations on the free version of Google Maps.
     * To use the free version of google maps, pass an empty string
     */
    'googleMapsAPIKey' => '',

    /**
     * Optional
     *
     * A file to log errors to. The file must be writable.
     * Leave empty for default ("./error.log")
     */
    'logFilePath' => '',

    /**
     * Optional
     *
     * A custom title for the map page.
     * Will be rendered as "My Custom Title - GeoPal"
     */
    'mapPageTitle' => ''
);
