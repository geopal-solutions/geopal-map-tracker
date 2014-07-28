Ext.onReady( function() {

    Ext.application({
        requires: [
            'GeoPal.view.mapsemployees.Init',
            'GeoPal.controller.MapsEmployees'
        ],

        name: 'GeoPal',
        appFolder: 'assets/js/GeoPal/app',
        autoCreateViewport: true,
        controllers: [
            'MapsEmployees'
        ]
    });
});

setTimeout(function(){
    delete Ext.tip.Tip.prototype.minWidth;
}, 2000);



