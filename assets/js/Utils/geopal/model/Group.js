/**
 * @docauthor lukaszjajesnica@geopal-solutions.com
 *
 * Group model represents Group entity model
 *
 **/

Ext.define('GeoPal.model.Group', {

    /**
     * @cfg {string} extend
     */
    extend: 'Ext.data.Model',

    /**
     * @cfg {array} fields
     */
    fields: [{
        name: 'Id',
        type: 'int'
    }, {
        name: 'Name'
    }]
});