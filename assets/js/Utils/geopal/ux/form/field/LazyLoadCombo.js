/**
 * @docauthor Gabor Zelei
 *
 * Combo prototype with lazy loading
 *
 * # Example usage:
 *
 *     @example
 *
 *     Ext.create('GeoPal.ux.form.field.LazyLoadCombo', {
 *         store: myStore,
 *         displayField: 'Name',
 *         valueField: 'Id',
 *         renderTo: Ext.getBody()
 *     });
 *
 **/

Ext.define('GeoPal.ux.form.field.LazyLoadCombo', {
    extend:'Ext.form.ComboBox',
    alias: [
        'widget.lazycombo',
        'widget.lazycombobox',
        'widget.lazyloadcombo',
        'widget.lazyloadcombobox'
    ],

    displayField: 'Name',
    valueField: 'Id',

    /**
     * Used internally to indicate if at least one store load() call has already been completed
     * @var {boolean} storeIsLoaded
     */
    storeIsLoaded: false,

    initComponent: function(){
        var scope = this;

        scope.callParent();
        scope.getStore().on('load', function() {
            scope.storeIsLoaded = true;
        });
    },

    /**
     * @todo fix
     * @param value
     */
    setValue: function(value) {
        var scope = this,
            store = scope.getStore();

        if (Ext.isDefined(value) && (scope.storeIsLoaded === false)) {
            store.on('load', function() {
                scope.storeIsLoaded = true;
                scope.setValue(value);
            }, scope, { single: true });

            if (!store.isLoading()) {
                store.load();
            }

            return;
        }

        scope.callParent(arguments);
    },

    /**
     * Sets store value by force
     * @param {int} value
     * @param {Function} [callback]
     */
    setValueForceReload: function(value, callback) {
        var scope = this,
            store = scope.getStore();

        store.on('load', function() {
            scope.storeIsLoaded = true;
            scope.setValue(value);

            if (callback) {

                if (Ext.isFunction(callback)){
                    callback();
                } else {
                    Ext.Error.raise('Callback is not a function.')
                }

            }
        }, scope, { single: true });
        store.load();
    }

});