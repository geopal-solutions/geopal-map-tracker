/**
 * @docauthor lukaszjajesnica@geopal-solutions.com
 *
 * Groups store keeps information about groups
 *
 **/

Ext.define('GeoPal.store.Groups', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.proxy.Rest',
        'GeoPal.model.Group'
    ],

    /**
     * @var {bool} autoLoad
     * @todo refactor to default to false
     */
    autoLoad: true,

    /**
     * @var {string} model
     */
    model: 'GeoPal.model.Group',

    /**
     * @var {string} storeId
     */
    storeId: 'Teams',

    /**
     * @var {object} proxy
     */
    proxy: {
        type: 'rest',
        api: {
            read: '?rest=groups'
        },
        limitParam: 'false',
        noCache: false,
        pageParam: 'false',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'totalCount'
        }
    },

    /**
     * @var {object} sorters
     */
    sorters: {
        property: 'Name',
        direction: 'ASC'
    }
});