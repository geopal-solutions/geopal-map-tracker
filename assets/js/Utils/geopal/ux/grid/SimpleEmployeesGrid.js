/**
 * @docauthor GeoPal
 *
 * A simpleemployeesgrid is component which displays employees in grid array, it gives also quick search options for
 * employees identifier, fullName and teamName.

 * # Example usage:
 *
 *     @example
 *     var employeesGrid= Ext.create('GeoPal.ux.grid.SimpleEmployeesGrid', {
 *     });
 *
 *     // creating with configuration
 *     var employeesGrid = Ext.create('GeoPal.ux.grid.SimpleEmployeesGrid', {
           store: 'EmployeeStore',
           height: 200,
           autoScroll: false,
           border: false
 *     });
 **/

Ext.define('GeoPal.ux.grid.SimpleEmployeesGrid', {
    extend:'Ext.grid.Panel',
    alias: ['widget.simpleemployeesgrid'],

    requires: [
        'GeoPal.model.Employee',
        'GeoPal.store.Employees',
        'GeoPal.model.Team',
        'GeoPal.store.Teams'
    ],

    plugins: [Ext.create('Ext.ux.FilterRow')],

    title: L.trans('SimpleEmployeesGrid.Grid.EmployeesGridTitle'),
    border: true,
    autoScroll: true,
    autoHeight: true,
    layout: 'fit',
    store: 'Employees',

    multiSelect: true,

    viewConfig: {
        emptyText: '<div class="emptyGridInformation">'+L.trans('SimpleEmployeesGrid.Grid.NoRecords')+'</div>'
    },

    selModel: function(){
        if(this.multiSelect){
            return Ext.create('Ext.selection.CheckboxModel')
        }
    },

    initComponent: function() {
        var scope = this;

        // Grid filters
        scope.filterElements = {
            identifier: Ext.create('Ext.form.TextField', {
                name: 'simpleemployeesgrid.filterByIdentifier',
                emptyText: L.trans('SimpleEmployeesGrid.Grid.FilterByIdentifier'),
                listeners: {
                    change: function(textfield){
                        var textFieldValue = textfield.getValue(),
                            gridStore = scope.getStore();
                        gridStore.clearFilter('simpleemployeesgrid.filterByIdentifier');
                        gridStore.filter({id: 'simpleemployeesgrid.filterByIdentifier', property: 'Identifier', value: textFieldValue});

                    }
                }
            }),
                fullName: Ext.create('Ext.form.TextField', {
                name: 'simpleemployeesgrid.filterByFullName',
                emptyText: L.trans('SimpleEmployeesGrid.Grid.filterByFullName'),
                listeners: {
                    change: function(textfield){
                        var textFieldValue = textfield.getValue(),
                            gridStore = scope.getStore();
                        gridStore.clearFilter('simpleemployeesgrid.filterByFullName');
                        gridStore.filter({id: 'simpleemployeesgrid.filterByFullName', property: 'FullName', value: textFieldValue});

                    }
                }
            }),
                teams: Ext.create('Ext.form.TextField', {
                name: 'simpleemployeesgrid.filterByTeamName',
                emptyText: L.trans('SimpleEmployeesGrid.Grid.filterByTeamName'),
                listeners: {
                    change: function(textfield){
                        var textFieldValue = textfield.getValue(),
                            gridStore = scope.getStore();
                        gridStore.clearFilter('simpleemployeesgrid.filterByTeamName');
                        gridStore.filter({
                            id: 'simpleemployeesgrid.filterByTeamName',
                            property: 'Teams',
                            value: textFieldValue,
                            anyMatch: true,
                            caseSensitive: false
                        });

                    }
                }
            })
        };

        scope.columns = [{
            dataIndex: 'Identifier',
            text: L.trans('AddAJob.EmployeeGrid.Identifier'),
            flex: 1,
            filterElement: scope.filterElements.identifier

        },{
            dataIndex: 'FullName',
            text: L.trans('AddAJob.EmployeeGrid.FullName'),
            flex: 2,
            filterElement: scope.filterElements.fullName
        },{
            dataIndex: 'Teams',
            text: L.trans('AddAJob.EmployeeGrid.TeamName'),
            flex: 1,
            filterElement: scope.filterElements.teams
        },{
            dataIndex: 'Status',
            text: L.trans('AddAJob.EmployeeGrid.Status'),
            flex: 1,
            renderer: function(v){
                var className = 'green';
                if(!v){
                    className = 'green'
                }
                else if(v==1){
                    className = 'yellow';
                }
                else if(v==2){
                    className = 'red';
                }
                return '<span class="grid-iconStatus '+className+'"></span>';
            }
        }];

        scope.callParent(arguments);
    },

    /**
     * Clears filters on the grid and the underlying store
     */
    clearFilters: function() {
        this.suspendEvents();

        Ext.iterate(this.filterElements, function(filterName, filterElement) {
            filterElement.reset();
        });

        this.resumeEvents();
        this.getStore().clearFilter();
    }
});
