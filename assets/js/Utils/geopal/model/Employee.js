/**
 * @docauthor lukaszjajesnica@geopal-solutions.com
 *
 * Employee model represents employee entity model
 *
 **/

Ext.define('GeoPal.model.Employee', {

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
    },{
        name: 'Identifier'
    },{
        name: 'FirstName'
    },{
        name: 'LastName'
    },{
        name: 'Status'
    },{
    name: 'FullName',

        /**
         * returns
         * @param v
         * @param rec
         * @returns {string}
         */
        convert: function(v, rec) {
            return [rec.get('FirstName'), rec.get('LastName')].join(' ');
        }

    },{
        name: 'Teams'
    }]
});