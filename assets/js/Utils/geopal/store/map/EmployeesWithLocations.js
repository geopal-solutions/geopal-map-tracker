/**
 * @docauthor gabor.zelei@geopal-solutions.com
 *
 * Contains employee record with location data
 *
 **/

Ext.define('GeoPal.store.map.EmployeesWithLocations', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.proxy.Rest',
        'GeoPal.model.map.EmployeeWithLocation'
    ],

    /**
     * @var {bool} autoLoad
     */
    autoLoad: false,

    /**
     * @var {string} model
     */
    model: 'GeoPal.model.map.EmployeeWithLocation',

    /**
     * @var {string} storeId
     */
    storeId: 'EmployeesWithLocations',

    /**
     * @var {{}} customFilters
     */
    customFilters: {},

    /**
     * @var {object} proxy
     */
    proxy: {
        type: 'ajax',
        url: '?action=employeePositions',
        reader: {
            type: 'json',
            root: 'data'
        },
        sorters: {
            property: 'FullName',
            direction: 'ASC'
        }
    },

    remoteFilter: false,
    remoteSort: false,

    /**
     * Applies a filter to the store or changes
     * an existing filter's value
     *
     * @param {String} filterName
     * @param {String} value,
     * @param {Boolean} [exactMatchOnly]
     */
    applyFilter: function(filterName, value, exactMatchOnly) {
        this.clearFilter(true);

        // Set new value or delete filter
        if (value) {
            this.customFilters[filterName] = value;
        } else {

            if (this.customFilters[filterName]) {
                delete this.customFilters[filterName];
            }
        }

        var customFiltersToApply = [];

        // Gather all filters to (re-)apply
        Ext.iterate(this.customFilters, function(property, value) {

            if (exactMatchOnly) {

                // Filter to get exact matches
                customFiltersToApply.push({ filterFn: function(record) { return (record.get(property) === value); } });

            } else if (Ext.Array.contains(['Teams', 'Groups'], property)) {

                // Teams and sites are stored as comma separated lists, hence the special treatment
                value = Ext.isString(value) ? value : value.toString();

                customFiltersToApply.push({
                    filterFn: function(record) {
                        var propertyValues = record.get(property).split(',');
                        return Ext.Array.contains(propertyValues, value);
                    }
                });

            } else {

                // Standard filter
                customFiltersToApply.push({ property: property, value: value });

            }

        });

        // (Re-)Apply all filters
        if (customFiltersToApply.length > 0) {
            this.filter(customFiltersToApply);
        }
    },

    /**
     * Removes all filters from the store, custom or otherwise
     */
    clearCustomFilters: function () {
        this.clearFilter();
        this.customFilters = {};
    }
});