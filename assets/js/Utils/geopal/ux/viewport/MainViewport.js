/**
 * @docauthor lukasz.jajesnica@geopal-solutions.com
 *
 * A mainviewport widget is used for displaying extjs pages in border layout

 * # Example usage:
 *
 *     @example
 *     // simple initialization
 *     var viewport = Ext.create('GeoPal.ux.viewport.MainViewport', {
 *     });
 *
 **/

Ext.define('GeoPal.ux.viewport.MainViewport', {
    extend: 'Ext.container.Viewport',

    alias: ['widget.mainviewport'],

    requires: [
        'Ext.layout.container.Border',
        'Ext.container.Viewport'
    ],

    /**
     * @cfg {String} mainWidget
     */
    mainWidget: null,

    /**
     * @cfg {Boolean} autoScroll
     */
    autoScroll: true,

    /**
     * @cfg {String} layout
     */
    layout:'border',

    /**
     * @cfg {Object} defaults
     */
    defaults: {
        collapsible: false,
        split: false,
        border: false
    },

    initComponent: function(){

        this.items = [{
            region:'center',
            style: 'background: #f9f9f9;',
            autoScroll: this.autoScroll,
            xtype: this.mainWidget
        },{
            region:'south',
            height: 35
        }];

        this.callParent(arguments);
    }
});

