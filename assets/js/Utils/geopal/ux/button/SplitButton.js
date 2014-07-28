/**
 * @docauthor Gabor
 *
 * Split button with menu toggle on click
 *
 * # Example usage:
 *
 *     @example
 *
 *     // creating with configuration
 *     var splitButtonWithMenuToggle = Ext.create('GeoPal.ux.button.SplitButton', {
 *         menu: {Array},           // Mandatory, an error will be raised if missing
 *         text: {String}           // Optional, standard button config option
 *         handler: {Function}      // Optional, standard button config option
 *     });
 **/
Ext.define('GeoPal.ux.button.SplitButton', {
    extend: 'Ext.button.Split',
    alias: [
        'widget.geopalsplitbutton'
    ],

    /**
     * Menu items for this component
     *
     * @cfg {Array} menu
     */
    menu: null,

    /**
     * Button click handler callback, optional
     *
     * @cfg {Function} [handler]
     */
    handler: null,

    /**
     * Init component
     */
    initComponent: function() {
        var scope = this,
            userDefinedHandler;

        // Make sure that a menu is defined
        if (!scope.menu) {
            Ext.Error.raise('This component requires that a menu be configured for it before initialization.');
        }

        // Check if the user has defined a valid handler function for this button
        if (scope.handler && Ext.isFunction(scope.handler)) {
            userDefinedHandler = scope.handler;
        }

        // Override existing (or create new) handler
        scope.handler = function(button, event) {
            button.showMenu();

            if (userDefinedHandler) {
                userDefinedHandler(button, event);
            }

        };

        scope.callParent(arguments);
    }

});