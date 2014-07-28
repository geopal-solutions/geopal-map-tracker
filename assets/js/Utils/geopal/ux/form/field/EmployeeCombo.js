/**
 * @docauthor GeoPal
 *
 * A simpleemployeescombo with support for autocomplete, remote loading, and many other features
 * gives support for displaying multiple employees (Name and Identifier) with their statuses.

 * # Example usage:
 *
 *     @example
 *     var employees = Ext.create('GeoPal.ux.form.field.SimpleEmployeeCombo', {
 *     });
 *
 *     // creating with specific store
 *     var employees = Ext.create('GeoPal.ux.form.field.SimpleEmployeeCombo', {
           store: EmployeeStore
 *     });
 **/

Ext.define('GeoPal.ux.form.field.EmployeeCombo', {
    extend:'GeoPal.ux.form.field.LazyLoadCombo',
    alias: ['widget.employeecombo'],

    requires: ['GeoPal.model.Employee', 'GeoPal.store.Employees'],


    /**
     * @cfg {String} [displayField=""]
     *
     */
    displayField: 'FullName',

    /**
     * @cfg {String} [valueField=""]
     *
     */
    valueField: 'Id',


    /**
     * @cfg {String} [store=""]
     *
     */
    store: Ext.create('GeoPal.store.Employees'),

    /**
     *
     */
    initComponent: function() {
        this.callParent();
    }

});
