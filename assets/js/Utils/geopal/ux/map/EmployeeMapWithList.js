/**
 * @docauthor gabor.zelei@geopal-solutions.com
 *
 * Widget to display a map with markers representing employees,
 * along with a list of employees on the left

 * # Example usage:
 *
 *     @example
 *     var employeeMap = Ext.create('GeoPal.ux.map.EmployeeMap');
 *
 **/
Ext.define('GeoPal.ux.map.EmployeeMapWithList', {
    extend: 'Ext.container.Container',

    alias: ['widget.employeemapwithlist'],

    requires: [
        'Ext.button.Button',
        'Ext.form.FieldContainer',
        'GeoPal.store.map.EmployeesWithLocations',
        'GeoPal.ux.form.field.EmployeePicker',
        'GeoPal.ux.form.field.LazyLoadCombo',
        'GeoPal.ux.map.EmployeeMap'
    ],

    /**
     * @cfg {object} [languageSettings]
     */
    languageSettings: {
        Employee: L.trans('Global.Employee'),
        Reset: L.trans('Global.Reset'),
        Site: L.trans('Global.Group'),
        Team: L.trans('Global.Team'),
        Title: L.trans('MapsEmployees.Title')
    },

    // Standard configuration
    border: false,
    height: '100%',
    minHeight: 200,
    layout: 'hbox',

    /**
     * @var {GeoPal.ux.form.field.employeePicker} employeePicker
     */
    employeePicker: null,

    /**
     * @var {Ext.form.FieldContainer} employeeListContainer
     */
    employeeListContainer: null,
    
    /**
     * @var {GeoPal.ux.map.EmployeeMap} employeeMapPanel
     */
    employeeMapPanel: null,

    /**
     * @var {Ext.button.Button} resetButton
     */
    resetButton: null,

    /**
     * @var {GeoPal.ux.form.field.LazyLoadCombo} siteFilterCombo
     */
    siteFilterCombo: null,

    /**
     * @var {GeoPal.store.map.EmployeesWithLocations} store
     */
    store: null,

    /**
     * @var {GeoPal.ux.form.field.LazyLoadCombo} teamFilterCombo
     */
    teamFilterCombo: null,

    /**
     * Init component
     */
    initComponent: function(){
        // Create common store
        this.store = Ext.create('GeoPal.store.map.EmployeesWithLocations');

        // Make sure the employees list gets refreshed along with the store
        this.store.on('load', this.refreshEmployeesList, this);

        // Create employee combo
        this.employeePicker = Ext.create('GeoPal.ux.form.field.EmployeePicker', {
            emptyText: this.languageSettings.Employee,
            width: '100%'
        });

        // Create field container for employee list
        this.employeeListContainer = Ext.create('Ext.form.FieldContainer', {
            autoScroll: true,
            flex: 1,
            labelWidth: 0,
            layout: 'vbox',
            padding: '3 0 3 0',
            width: '100%'
        });

        // Create map panel
        this.employeeMapPanel = Ext.create('GeoPal.ux.map.EmployeeMap', {
            border: false,
            height: '100%',
            flex: 1,
            store: this.store
        });

        // Create reset button for filters
        this.resetButton = Ext.create('Ext.button.Button', {
            iconCls: 'clearIcon',
            text: this.languageSettings.Reset,
            width: 70,
            listeners: {
                click: function(button) {
                    this.resetFilters();
                    button.blur();
                },
                scope: this
            }
        });

        // Create site filter combo
//        this.siteFilterCombo = Ext.create('GeoPal.ux.form.field.LazyLoadCombo', {
//            displayField: 'Name',
//            emptyText: this.languageSettings.Site,
//            flex: 1,
//            store: Ext.create('GeoPal.store.Groups', { autoLoad: false }),
//            valueField: 'Id'
//        });
        
        // Create team filter combo
//        this.teamFilterCombo = Ext.create('GeoPal.ux.form.field.LazyLoadCombo', {
//            displayField: 'Name',
//            emptyText: this.languageSettings.Team,
//            flex: 1,
//            store: Ext.create('GeoPal.store.Teams', { autoLoad: false }),
//            valueField: 'Id'
//        });


        // Create layout
        this.items = [
            {
                xtype: 'panel',
                border: false,
                collapsible: true,
                collapseDirection: 'left',
                height: '100%',
                itemId: 'leftPanel',
                layout: 'vbox',
                title: this.languageSettings.Title,
                width: 440,
                listeners: {
                    collapse: this.employeeMapPanel.refreshMap,
                    expand: this.employeeMapPanel.refreshMap,
                    scope: this.employeeMapPanel
                },
                items: [
//                    {
//                        xtype: 'container',
//                        layout: 'hbox',
//                        margin: 10,
//                        width: '100%',
//                        defaults: {
//                            margin: 5
//                        },
//                        items: [
//                            this.teamFilterCombo,
//                            this.siteFilterCombo,
//                            this.resetButton
//                        ]
//                    },
                      {
                        xtype: 'container',
                        cls: 'searchWrapper',
                        layout: 'fit',
                        width: '100%',
                        defaults: {
                            margin: '15 5 15 5'
                        },
                        items: [
                            this.employeePicker
                        ]
                    },
                    this.employeeListContainer
                ]
            }, {
                xtype: 'splitter',
                style: 'border-left: #ddd 1px solid;border-right:#ddd 1px solid;background:#eee'
            },
            this.employeeMapPanel
        ];

        this.bindListeners();
        this.setLoading(true);
        this.callParent(arguments);
    },

    /**
     * Bind listeners for all components
     */
    bindListeners: function() {
        // Employees filter
        this.employeePicker.employeesCombo.on('change', function() {
            this.store.applyFilter('Id', this.employeePicker.getValue(), true);
            this.employeeMapPanel.refreshMap();
        }, this);

        // Teams filter
//        this.teamFilterCombo.on('change', function() {
//            this.store.applyFilter('Teams', this.teamFilterCombo.getValue());
//            this.employeeMapPanel.refreshMap();
//        }, this);

        // Sites (groups) filter
//        this.siteFilterCombo.on('change', function() {
//            this.store.applyFilter('Groups', this.siteFilterCombo.getValue());
//            this.employeeMapPanel.refreshMap();
//        }, this);

        // Store events
        this.store.on('beforeload', function() {
            this.setLoading(true);
            this.resetFilters();
        }, this);

        this.store.on('load', this.onStoreLoad, this);
        
        // Employee map panel online filter changes
        this.employeeMapPanel.on('mapfilterchanged', function() {
            this.resetFilters();
            this.employeePicker.store.load();
            this.onStoreLoad();
            this.refreshEmployeesList();
        }, this);
    },

    /**
     * (Re-)populates the list of employees on the left
     */
    refreshEmployeesList: function() {
        var scope = this,
            employeeMapPanel = this.employeeMapPanel,
            employeeEntries = [];

        this.employeeListContainer.removeAll();

        this.store.each(function(record) {
            employeeEntries.push({
                xtype: 'panel',
                bodyPadding: 10,
                border: true,
                html: employeeMapPanel.getMarkerHTML(record),
                margin: '2 5 2 5',
                minHeight: 40,
                overCls: 'x-selectable-panel',
                width: '100%',
                listeners: {
                    render: function(panel) {
                        panel.body.on('click', function() {
                            scope.onEmployeeSelect(record.get('Id'), scope);
                        });
                    }
                }
            });
        });

        this.employeeListContainer.add(employeeEntries);
    },

    /**
     * Callback function to select a marker for an employee id
     *
     * @param {int} employeeId
     * @param {GeoPal.ux.map.EmployeeMapWithList} scope
     */
    onEmployeeSelect: function(employeeId, scope) {
        scope.store.applyFilter('Id', employeeId, true);
        scope.employeePicker.employeesCombo.setValue(employeeId);
        scope.employeeMapPanel.refreshMap();
        scope.employeeMapPanel.selectEmployeeMarker(employeeId);
    },

    /**
     * Event handler for store "load" events
     */
    onStoreLoad: function() {
        // Make sure we can only select employees that we can select on the map
        var employeePickerStore = this.employeePicker.store,
            searchableEmployeeIds = [],
            statusTxt = this.employeeMapPanel.down('#statusTxtSelector').getValue().StatusTxt,

            employeePickerStoreLoadCallback = function() {
                employeePickerStore.filterBy(function(record) {
                    return Ext.Array.contains(searchableEmployeeIds, record.get('Id'));
                });
            };

        // Filter listed employees by status
        if (statusTxt != 'all') {
            this.store.applyFilter('StatusTxt', statusTxt);
        }

        // Get the list of selectable employees
        this.store.each(function(record) {
            searchableEmployeeIds.push(record.get('Id'));
        });

        // Apply the list to lazy loading combo (rebind to store load event)
        employeePickerStore.clearFilter();
        employeePickerStore.un('load', employeePickerStoreLoadCallback);
        employeePickerStore.on('load', employeePickerStoreLoadCallback);

        // Remove loading mask if any
        this.setLoading(false);
    },

    /**
     * Resets team and site filters
     */
    resetFilters: function() {
        this.employeePicker.setValueById(null);
//        this.teamFilterCombo.setValue(null);
//        this.siteFilterCombo.setValue(null);

        this.employeePicker.employeesCombo.fireEvent('change', this);
//        this.teamFilterCombo.fireEvent('change', this);
//        this.siteFilterCombo.fireEvent('change', this);
    }
});
