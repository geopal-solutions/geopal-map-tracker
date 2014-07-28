/**
 * @docauthor gabor.zelei@geopal-solutions.com
 *
 * Represents a employee entry with location data
 * for displaying on a map
 *
 **/

Ext.define('GeoPal.model.map.EmployeeWithLocation', {

    /**
     * @cfg {string} extend
     */
    extend: 'Ext.data.Model',

    /**
     * @cfg {[]} fields
     */
    fields: [
        { name: 'Accuracy', type: 'string'},
        { name: 'AccuracyType', type: 'string'},
        { name: 'Address', type: 'string'},
        { name: 'BatteryLevelTxt', type: 'string'},
        { name: 'FirstName', type: 'string'},
        { name: 'Groups', type: 'string'},
        { name: 'Id', type: 'int'},
        { name: 'Lat', type: 'float'},
        { name: 'LastName', type: 'string'},
        { name: 'LastUpdated', type: 'string'},
        { name: 'Lng', type: 'float'},
        { name: 'Speed', type: 'string'},
        { name: 'StatusTxt', type: 'string'},
        { name: 'Teams', type: 'string'},
        { name: 'FullName', type: 'string', convert: function(v, rec) {
            return [rec.get('FirstName'), rec.get('LastName')].join(' ');
        }}
    ]
});