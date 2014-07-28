Ext.define('GeoPal.view.mapsemployees.Init', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mapsemployeesinit',
    layout: 'fit',
    border: false,
    itemId: 'initPanel',
    items: [{
        xtype: 'employeemapwithlist',
        border: false,
        height: '100%',
    }]
});