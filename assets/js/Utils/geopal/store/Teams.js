/**
 * @docauthor lukaszjajesnica@geopal-solutions.com
 *
 * Teams store keeps information about teams
 *
 **/

Ext.define('GeoPal.store.Teams', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.proxy.Rest',
        'GeoPal.model.Team'
    ],

    /**
     * @var {bool} autoLoad
     * @todo refactor to default to false
     */
    autoLoad: true,

    /**
     * @var {string} model
     */
    model: 'GeoPal.model.Team',

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
            read: '?rest=teams'
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