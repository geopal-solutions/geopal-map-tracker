/**
 * @docauthor lukaszjajesnica@geopal-solutions.com
 *
 * Team model represents Team entity model
 *
 **/

Ext.define('GeoPal.model.Team', {

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
    },{
        name: 'JobTemplateId'
    },{
        name: 'Description'
    }]
});