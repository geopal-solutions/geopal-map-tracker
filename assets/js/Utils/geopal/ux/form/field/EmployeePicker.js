/**
 * @docauthor Gabor Zelei
 *
 * Employee Picker widget, based on employeeCombo
 *
 * # Example usage:
 *
 *     @example
 *     // simple initialization
 *     var employeePicker = Ext.create('GeoPal.ux.form.field.EmployeePicker');
 *
 *     // simple initialization with preselected value and label
 *     var employeePicker = Ext.create('GeoPal.ux.form.field.EmployeePicker', {
 *          label: {string},
 *          value: {int}
 *     });
 *
 *     // initialization with all exposed config params
 *     var employeePicker = Ext.create('GeoPal.ux.form.field.EmployeePicker', {
 *          emptyText: {string},
 *          label: {string},
 *          pageSize: {int},
 *          value: {int},
 *          width: {string|int}
 *     });
 *
 **/

Ext.define('GeoPal.ux.form.field.EmployeePicker', {
    extend:'Ext.panel.Panel',
    alias: ['widget.employeepicker'],

    requires: ['GeoPal.ux.form.field.EmployeeCombo', 'GeoPal.ux.grid.SimpleEmployeesGrid'],

    /**
     * @cfg {string} [emptyText]
     */
    emptyText: '',

    /**
     * @cfg {string} [label] - label above the live search box, and the title of the window if the grid is opened
     */
    label: '',

    /**
     * Paging size for live search and grid
     * @cfg {int} [pageSize]
     */
    pageSize: 10,

    /**
     * @cfg {string|int} [value] - the id of the employee
     */
    value: '',

    /**
     * Store to be used by this component
     * @cfg {{}} [store]
     */
    store: Ext.create('GeoPal.store.Employees'),

    /**
     * @cfg {string|int} [width]
     */
    width: 400,

    /**
     * @cfg
     */
    name: null,

    languageSettings: {
        Clear: L.trans('Global.Clear'),
        Close: L.trans('Global.Close'),
        Select: L.trans('Global.Select'),
        Find: L.trans('Global.Find'),
        NoEntriesSelected: L.trans('Global.ux.EmployeePicker.NoEntriesSelected')
    },

    // Reference properties
    buttonClear: null,
    buttonFind: null,
    employeesCombo: null,

    border: false,
    layout: 'hbox',
    minWidth: 400,

    initComponent: function() {
        var scope = this,
            items;

        // Cancel button
        scope.buttonClear = {
            xtype: 'button',
            iconCls: 'clearIcon',
            margin: '0 0 0 5',
            tooltip: scope.languageSettings.Clear,
            handler: function(button) {
                scope.down('employeecombo').clearValue();
                button.blur();
            }
        };

        // Find button
        scope.buttonFind = {
            xtype: 'button',
            iconCls: 'searchIcon',
            margin: '0 0 0 5',
            tooltip: scope.languageSettings.Find,
            handler: function(button) {

                // Function to get selected value from grid into the employee combo
                var getSelectedItem = function(component) {
                    var window = component.up('window'),
                        value = window.down('simpleemployeesgrid').getSelectionModel().getSelection()[0];

                    if (value && value.get) {
                        scope.setValueById(parseInt(value.get('Id')));
                        window.close();
                    } else {
                        Ext.Msg.alert(
                            scope.label || 'GeoPal',
                            scope.languageSettings.NoEntriesSelected
                        );
                    }
                };

                // Open window
                Ext.create('Ext.window.Window', {
                    autoDestroy: true,
                    autoShow: true,
                    height: 400,
                    layout: 'fit',
                    modal: true,
                    title: scope.label,
                    width: 775,
                    items: [{
                        xtype: 'simpleemployeesgrid',
                        store: scope.store,
                        listeners: {
                            beforerender: function(grid) {
                                var gridStore = grid.getStore();

                                // Make sure the grid is loaded
                                if (gridStore.getRange().length < 1) {
                                    gridStore.load();
                                }

                                // Make sure no filters are applied
                                Ext.iterate(grid.filterElements, function(filterName, filterObject) {
                                    filterObject.setValue('');
                                });
                            },
                            itemdblclick: getSelectedItem
                        }
                    }],
                    bbar: {
                        defaults: {
                            cls: 'x-btn-default-large',
                            scale: 'large'
                        },
                        layout: {
                            align: 'middle',
                            pack: 'center'
                        },
                        items: [{
                            // Select button
                            text: scope.languageSettings.Select,
                            handler: getSelectedItem
                        }, {
                            // Close button
                            text: scope.languageSettings.Close,
                            handler: function(button) {
                                button.up('window').close();
                            }
                        }]
                    },
                    listeners: {
                        close: function(window) {
                            // Clear store filters so that the combobox can show the full range of data
                            window.down('simpleemployeesgrid').getStore().clearFilter(true);
                        }
                    }
                });
            }
        };

        // Employee combo
        scope.employeesCombo = Ext.create('GeoPal.ux.form.field.EmployeeCombo', {
            editable: false,
            emptyText: scope.emptyText,
            flex: 1,
            hideTrigger: false,
            margin: '0 0 0 0',
            minWidth: 150,
            pageSize: 0,
            store: scope.store,
            value: scope.value || undefined,
            name: scope.name || undefined
        });

        // Items container
        items = Ext.create('Ext.container.Container', {
            layout: 'vbox',
            anchor: '100%',
            width: scope.width
        });

        // Label
        items.add({
            xtype: 'displayfield',
            bodyPadding: 0,
            margin: 0,
            value: scope.label,
            width: '100%'
        });

        // Controls
        items.add({
            xtype: 'container',
            layout: 'hbox',
            width: '100%',
            items: [
                scope.employeesCombo,
                scope.buttonClear,
                scope.buttonFind
            ]
        });

        this.callParent();

        // Render items
        scope.add(items);
    },

    /**
     * Gets value from employee combo
     *
     * @returns {int}
     */
    getValue: function() {
        return this.employeesCombo.getValue();
    },

    /**
     * Sets new value to the employee combo
     *
     * @param value
     */
    setValueById: function(value) {
        var scope = this;
        if (value && Ext.isNumeric(value)) {
            scope.employeesCombo.setValue(parseInt(value));
        } else{
            scope.employeesCombo.clearValue();
        }
    }

});
