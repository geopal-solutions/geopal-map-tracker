/**
 * @docauthor gabor.zelei@geopal-solutions.com
 *
 * Widget to display a map with markers representing employees

 * # Example usage:
 *
 *     @example
 *     // simple initialization
 *     var employeeMap = Ext.create('GeoPal.ux.map.EmployeeMap');
 *
 *     // initialization with params
 *     var employeeMap = Ext.create('GeoPal.ux.map.EmployeeMap', {
 *         gMapType: {String},
 *         refreshInterval: {Integer},
 *         store: {GeoPal.store.Employees},
 *         zoom: {int}
 *     });
 *
 **/
Ext.define('GeoPal.ux.map.EmployeeMap', {
    extend: 'GeoPal.ux.map.GMapPanel',

    alias: ['widget.employeemap'],

    requires: [
        'GeoPal.store.map.EmployeesWithLocations',
        'GeoPal.ux.button.SplitButton'
    ],

    /**
     * @cfg {string} [gmapType]
     */
    gmapType: 'map',

    /**
     * @cfg {string} [iconsDir]
     */
    iconsDir: 'assets/css/images/',

    /**
     * Refresh interval in seconds. Set to 0 to disable refreshing.
     * Defaults to 1 minute
     *
     * @cfg {int} [refreshInterval]
     */
    refreshInterval: 60,

    /**
     * @cfg {int} [zoom]
     */
    zoom: 8,

    /**
     * @cfg {GeoPal.store.EmployeesWithLocations} [store]
     */
    store: null,

    /**
     * An array of strings to build the marker template from
     *
     * @cfg {[]} markerTemplate
     */
    markerTemplate: [
        '<div class="reset gmapTooltip">',
        '   <p>',
        '       <b class="title"><span class="icon status %STATUS_TEXT%"></span> %FULL_NAME%</b>',
        '       <b><p><i>%LABEL_LAST_UPDATED%</i></b>%LAST_UPDATED%</p>',
        '       <b><p><i>%LABEL_ADDRESS%:</i></b>%ADDRESS%</p>',
        '       <ul class="list">',
//        '           <li><i class="icon battery"></i>%BATTERY_LEVEL%</li>',
//        '           <li class="sep">|</li>',
//        '           <li><i class="icon speed"></i>%SPEED%</li>',
//        '           <li class="sep">|</li>',
//        '           <li><i class="icon status %STATUS_TEXT%"></i>%STATUS%</li>',
//        '           <li class="sep">|</li>',
//        '           <li><i class="icon accuracy"></i>%ACCURACY%</li>',
        '       </ul>',
        '       <div class="clear"></div>',
        '   </p>',
        '</div>'
    ],

    /**
     * @cfg {object} [languageSettings]
     */
    languageSettings: {
        Address: L.trans('MapsEmployees.Address'),
        All: L.trans('MapsEmployees.All'),
        Days: L.trans('Global.Days'),
        Hours: L.trans('Global.Hours'),
        Hybrid: L.trans('MapsEmployees.Hybrid'),
        Kmph: L.trans('MapsEmployees.kmph'),
        LastUpdated: L.trans('MapsEmployees.LastUpdated'),
        Lat: L.trans('Global.Lat'),
        Lng: L.trans('Global.Lng'),
        MapType: L.trans('MapsEmployees.MapType'),
        Minutes: L.trans('Global.Mins'),
        Offline: L.trans('MapsEmployees.Offline'),
        Online: L.trans('MapsEmployees.Online'),
        Overview: L.trans('MapsEmployees.Overview'),
        RoadMap: L.trans('MapsEmployees.Roadmap'),
        Satellite: L.trans('MapsEmployees.Satellite'),
        Status: L.trans('Global.Status'),
        Terrain: L.trans('MapsEmployees.Terrain'),
        Type: L.trans('Global.Type'),
        Unavailable: L.trans('MapsEmployees.Unavailable'),
        Weeks: L.trans('Global.Weeks')
    },

    // Standard configuration
    minHeight: 200,
    border: false,
    layout: 'fit',

    /**
     * @var {google.maps.LatLng} defaultMapCenter
     */
    defaultMapCenter: null,

    /**
     * Shortcut for nicer access to google maps api
     *
     * @var {google.maps} googleMaps
     */
    googleMaps: google.maps,

    /**
     * An array of marker references for easy cleanup
     *
     * @var {[]} markers
     */
    markers: [],

    /**
     * Task to periodically refresh map
     */
    refreshMapTask: null,

    /**
     * Init component
     */
    initComponent: function(){
        var scope = this;

        // Make sure we have a valid store to work with
        this.store = this.store || Ext.create('GeoPal.store.map.EmployeesWithLocations');

        // Trigger populating the map
        this.on('mapready', this.onMapReady, this, { single: true });

        // Add custom events
        this.addEvents('mapfilterchanged');

        // Create toolbar
        this.tbar = {
            items: [{
                xtype: 'radiogroup',
                itemId: 'statusTxtSelector',
                defaults: {
                    width: 80
                },
                listeners: {
                    change: this.onStatusTxtChange,
                    scope: this
                },
                items: [{
                    boxLabel: this.languageSettings.Online,
                    cls: 'radioGreen',
                    inputValue: 'green',
                    itemId: 'radioGreen',
                    name: 'StatusTxt'
                }, {
                    boxLabel: this.languageSettings.Unavailable,
                    cls: 'radioYellow',
                    inputValue: 'yellow',
                    itemId: 'radioYellow',
                    name: 'StatusTxt',
                    width: 105
                }, {
                    boxLabel: this.languageSettings.Offline,
                    cls: 'radioRed',
                    inputValue: 'red',
                    itemId: 'radioRed',
                    name: 'StatusTxt'
                }, {
                    boxLabel: this.languageSettings.All,
                    checked: true,
                    inputValue: 'all',
                    itemId: 'radioAll',
                    name: 'StatusTxt'
                }]
            }, '->', {
                xtype: 'button',
                action: 'mapReset',
                iconCls: 'refreshIcon',
                itemId: 'mapReset',
                text: this.languageSettings.Overview,
                listeners: {
                    click: function(button) {
                        this.refreshMap();
                        button.blur();
                    },
                    scope: this
                }
            }, '-', {
                xtype: 'geopalsplitbutton',
                itemId: 'mapTypeButton',
                iconCls: 'mapIcon',
                text: this.languageSettings.MapType,
                menu: [{
                    name:'SATELLITE',
                    text: this.languageSettings.Satellite,
                    handler: this.setMapType,
                    scope: this
                }, {
                    name:'ROADMAP',
                    text: this.languageSettings.RoadMap,
                    handler: this.setMapType,
                    scope: this
                }, {
                    name:'HYBRID',
                    text: this.languageSettings.Hybrid,
                    handler: this.setMapType,
                    scope: this
                }, {
                    name:'TERRAIN',
                    text: this.languageSettings.Terrain,
                    handler: this.setMapType,
                    scope: this
                }]
            }]
        };

        this.callParent(arguments);
    },

    /**
     * Creates markers for valid items found in the store
     */
    createMarkers: function() {
        var bounds = new this.googleMaps.LatLngBounds();

        this.store.each(function(record) {

            if (record.get('Lat') && record.get('Lng')) {
                bounds.extend(this.generateMarker(record));
            }

        }, this);

        if (this.markers.length > 0) {
            this.gmap.fitBounds(bounds);
        } else {
            this.gmap.setCenter(this.defaultMapCenter);
            this.gmap.setZoom(this.zoom);
        }
    },

    /**
     * Clears existing map markers
     */
    clearMarkers: function() {

        // Remove any existing marker icons from the map
        if (Ext.isArray(this.markers) && (this.markers.length > 0)) {
            Ext.each(this.markers, function(marker) {
                marker.setMap(null);
            });
        }

        // Clear marker object references
        this.markers = [];
    },

    /**
     * Generates a marker and binds marker events
     *
     * @param {GeoPal.model.EmployeeWithLocation} employeeRecord
     * @return {google.maps.LatLng}
     */
    generateMarker: function(employeeRecord){
        var gmap = this.gmap,
            latLng = new this.googleMaps.LatLng(employeeRecord.get('Lat'), employeeRecord.get('Lng')),
            markerHtml = this.getMarkerHTML(employeeRecord),

            markerIconColor = employeeRecord.get('StatusTxt') || 'red',

            marker = new this.googleMaps.Marker({
                draggable: false,
                icon: [this.iconsDir, markerIconColor, '-marker.png'].join(''),
                map: gmap,
                position: latLng,
                title: ['employee', employeeRecord.get('Id')].join('_')
            });

        // Close or reset infoWindow
        if (gmap.infowindow) {
            gmap.infowindow.close();
        } else {
            gmap.infowindow = new this.googleMaps.InfoWindow({ content: "" });
        }

        // Rig marker click event
        this.googleMaps.event.addListener(marker, 'click', function() {
            gmap.infowindow.setContent(markerHtml);
            gmap.infowindow.open(gmap, marker);
        });

        // Store reference to marker
        this.markers.push(marker);

        // Return point lat and long
        return latLng;
    },

    /**
     * Generates HTML snippet to display employeeRecord data
     *
     * @param {GeoPal.model.EmployeeWithLocation} employeeRecord
     * @returns {string}
     */
    getMarkerHTML: function(employeeRecord) {
        var accuracyType = '',
            lastUpdatedText = '',
            statusText = this.languageSettings.Offline;

        // Format last updated text
        lastUpdatedText = employeeRecord.get('LastUpdated')
            .replace('w', this.languageSettings.Weeks + ' ')
            .replace('d', this.languageSettings.Days + ' ')
            .replace('h', this.languageSettings.Hours + ' ')
            .replace('m', this.languageSettings.Minutes + ' ');

        // Get human readable status
        switch (employeeRecord.get('StatusTxt')) {
            case 'yellow':
                statusText = this.languageSettings.Unavailable;
                break;
            case 'green':
                statusText = this.languageSettings.Online;
                break;
            case 'red':
            default:
                statusText = this.languageSettings.Offline;
                break;
        }

        // Get accuracy type as formatted string (helps fixing the display bug occurring when this data is unavailable)
        accuracyType = employeeRecord.get('AccuracyType');
        accuracyType = accuracyType ? [' ', accuracyType].join('') : '';

        return this.markerTemplate.join('')
            .replace('%FULL_NAME%', employeeRecord.get('FullName'))
            .replace('%LABEL_LAST_UPDATED%', this.languageSettings.LastUpdated)
            .replace('%LAST_UPDATED%', lastUpdatedText)
            .replace('%LABEL_ADDRESS%', this.languageSettings.Address)
            .replace('%ADDRESS%', employeeRecord.get('Address'))
            .replace('%BATTERY_LEVEL%', employeeRecord.get('BatteryLevelTxt') + '%')
            .replace('%SPEED%', employeeRecord.get('Speed') + this.languageSettings.Kmph)
            .replace('%STATUS_TEXT%', employeeRecord.get('StatusTxt'))
            .replace('%STATUS%', statusText)
            .replace('%ACCURACY%', [employeeRecord.get('Accuracy'), accuracyType].join('m'));
    },

    /**
     * Handler method for the "mapready" event
     */
    onMapReady: function() {
        var scope = this,
            store = this.store,
            runner = new Ext.util.TaskRunner(),

            reloadStore = function() {
                if (store && !store.isLoading()) {
                    store.clearCustomFilters();
                    store.reload();
                }
            };

        // Store default map center
        this.defaultMapCenter = this.gmap.getCenter();

        // Make sure the map gets refreshed along with the store
        this.store.on('load', function() {
            var radioGroup = this.down('#statusTxtSelector');
            this.onStatusTxtChange(radioGroup, radioGroup.getValue());
            this.refreshMap();
        }, this);

        // Load initial data
        reloadStore();

        // Create scheduled task to periodically update map (if this.refreshInterval is greater than 0)
        this.refreshInterval = Ext.isNumeric(this.refreshInterval) ? parseInt(this.refreshInterval) : 0;

        if (this.refreshInterval > 0) {
            this.refreshMapTask = runner.newTask({ run: reloadStore, interval: this.refreshInterval * 1000 });
            this.refreshMapTask.start();
        }
    },

    /**
     * Handler for changes made to the StatusTxt radio group
     *
     * @param {Ext.form.RadioGroup} group
     * @param {String} newValue
     */
    onStatusTxtChange: function(group, newValue) {
        var statusTxt = newValue.StatusTxt;

        this.store.applyFilter('StatusTxt', null);

        if (Ext.Array.contains(['red', 'yellow', 'green'], statusTxt)) {
            this.store.applyFilter('StatusTxt', statusTxt);
        }

        this.fireEvent('mapfilterchanged', this, newValue);
        this.refreshMap();
    },

    /**
     * Handler method for the store "load" event
     * Recreates icons on the map
     */
    refreshMap: function() {
        this.clearMarkers();
        this.createMarkers();
    },

    /**
     * Finds a marker based on employeeId
     * and triggers a click event on it
     *
     * @param {int} employeeId
     * @return {Boolean}
     */
    selectEmployeeMarker: function(employeeId) {
        var googleMaps = this.googleMaps,
            findTitle = ['employee', employeeId].join('_');

        Ext.each(this.markers, function(marker) {
            if (marker.getTitle() == findTitle) {
                googleMaps.event.trigger(marker, 'click');
                return true;
            } else {
                return false;
            }
        });

        return false;
    },

    /**
     * Sets map type depending on selected option from the drop down menu in the toolbar
     *
     * @param mapTypeElement
     */
    setMapType: function(mapTypeElement){
        if(mapTypeElement.name) {
            this.gmap.setMapTypeId(this.googleMaps.MapTypeId[mapTypeElement.name]);
        }
    }
});
