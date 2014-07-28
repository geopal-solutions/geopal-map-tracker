/**
 * @docauthor lukaszjajesnica@geopal-solutions.com
 *
 * GeoPal.view.Viewport renders main viewport for current application
 *
 * @expample
 *
 * var viewport = Ext.create('GeoPal.view.Viewport', {
 *      autoScroll: false //parameter is optional
 *      mainWidget: 'mywidget' //parameter is MANDATORY - defines which widget is loaded in center region of grid layout
 * })
 *
 **/

Ext.define('GeoPal.view.Viewport', {
    requires: [
        'GeoPal.ux.viewport.MainViewport'
    ],
    extend: 'GeoPal.ux.viewport.MainViewport',
    mainWidget: 'mapsemployeesinit',
    autoScroll: false
});
