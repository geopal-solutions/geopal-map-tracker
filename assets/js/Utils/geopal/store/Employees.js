/**
 * @docauthor lukaszjajesnica@geopal-solutions.com
 *
 * Employees store keeps information about employees
 *
 **/

Ext.define('GeoPal.store.Employees', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.proxy.Rest',
        'GeoPal.model.Employee'
    ],

    /**
     * @var {bool} autoLoad
     */
    autoLoad: false,

    /**
     * @var {string} model
     */
    model: 'GeoPal.model.Employee',

    /**
     * @var {string} storeId
     */
    storeId: 'Employees',

    /**
     * @var {object} proxy
     */
    proxy: {
        type: 'rest',
        pageParam: false,
        startParam: false,
        limitParam: false,
        noCache: false,
        api: {
            read: '?action=employees'
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'totalCount'
        },
        sorters: {
            property: 'FullName',
            direction: 'ASC'
        }
    },

    remoteSort: true
});