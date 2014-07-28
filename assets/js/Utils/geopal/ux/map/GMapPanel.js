/**
 * @author Shea Frederick
 *
 * Modified by gabor.zelei@geopal-solutions.com
 */
Ext.define('GeoPal.ux.map.GMapPanel', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.gmappanel',

    requires: ['Ext.window.MessageBox'],

    initComponent : function(){
        Ext.applyIf(this,{
            plain: true,
            gmapType: 'map',
            border: false
        });

        this.callParent();
    },

    afterFirstLayout : function(){
        this.callParent();
        this.getMap();
    },

    getMap: function() {
        var map = this.gmap;
        var scope = this;

        Ext.Ajax.request({
            url: '?action=mapCenter',
            success: function(response) {
                var data = JSON.parse(response.responseText);
                if (data.success) {
                    var center = new google.maps.LatLng(data.latitude, data.longitude);
                    scope.createMap(center, false, parseInt(data.zoom));

                } else {
                    scope.noCenterFallBack();
                }

            },
            failure: function () {
                scope.noCenterFallBack();
            }
        });
    },

    noCenterFallBack: function () {
        // Default to Dublin
        var center = new google.maps.LatLng('53.409869', '-8.238308');
        this.createMap(center, false, 6);
    },

    createMap: function(center, marker, zoom) {
        var options = Ext.apply({}, this.mapOptions);

        options = Ext.applyIf(options, {
            zoom: zoom || 10,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false
        });
        this.gmap = new google.maps.Map(this.body.dom, options);
        if (marker) {
            this.addMarker(Ext.applyIf(marker, {
                position: center
            }));
        }

        Ext.each(this.markers, this.addMarker, this);
        this.fireEvent('mapready', this, this.gmap);
    },

    addMarker: function(marker) {
        marker = Ext.apply({
            map: this.gmap
        }, marker);

        if (!marker.position) {
            marker.position = new google.maps.LatLng(marker.lat, marker.lng);
        }
        var o =  new google.maps.Marker(marker);
        Ext.Object.each(marker.listeners, function(name, fn){
            google.maps.event.addListener(o, name, fn);
        });
        return o;
    },

    lookupCode : function(addr, marker) {
        this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode({
            address: addr
        }, Ext.Function.bind(this.onLookupComplete, this, [marker], true));
    },
    /*
     onLookupComplete: function(data, response, marker){
     if (response != 'OK') {
     Ext.MessageBox.alert('Error', 'An error occured: "' + response + '"');
     return;
     }
     this.createMap(data[0].geometry.location, marker);
     },
     */
    afterComponentLayout : function(w, h){
        this.callParent(arguments);
        this.redraw();
    },

    redraw: function(){
        var map = this.gmap;
        if (map) {
            google.maps.event.trigger(map, 'resize');
        }
    }

});
