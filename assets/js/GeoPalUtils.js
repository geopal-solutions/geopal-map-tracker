var GeoPalUtils = function () {
    return {
        Settings: {
            assetExportPath: '/assetmanagement/exportassets',
            assetKMLExportPath: '/assetmanagement/exportassetskml',
            assetJobsExportPath: '/assetmanagement/exportjobs',
            jobViewPath: '/jobs/progress/',
            mapIconsPath: '/assets/images/icons/mapiconscollection-markers/',
            s3viewPath: '/s3files/view/',
            assets: {
                companyFieldsEditLimit: 50,
                companyFieldsLimit: 200,
                companyTriggers: 20,
                fileActions: ['picture', 'signature', 'drawing', 'uploadedfile']
            },
            pagination: {
                pageSize: 25,
                start: 0,
                limit: 25
            },
            routes: {
                //'/assets/js/ext-js/buid/GeoPal/build/production/Configuration/index.html': 'Configuration',
                'maps/crm': 'MapsCrm',
                'maps/employee': 'MapsEmployees'
            }
        },
        TranslateComponent: function () {
            return {
                allCustomWords: {},
                customWords: (typeof initData != 'undefined') ? initData.customStrings : {},
                init: function (lang) {

                },

                /**
                 *
                 * @param sentence
                 * @returns {*}
                 */
                customStrings: function (sentence) {
                    var output = sentence;

                    Ext.Object.each(this.customWords, function (key, val) {
                        if (key && val) {
                            if(val && sentence){
                                //sentence = Ext.util.Format.lowercase(sentence);
                                var pattern = new RegExp(key, 'mgi');
                                var pattern_plural = new RegExp(Ext.util.Inflector.pluralize(key), 'mgi')

                                if(!Ext.isEmpty(sentence.match(pattern)) || !Ext.isEmpty(sentence.match(pattern_plural))){
                                //if(sentence.indexOf(key)>-1 || sentence.indexOf(Ext.util.Inflector.pluralize(key))>-1){
                                    //var pattern = new RegExp(key, 'mgi');
                                    if(Ext.util.Inflector.pluralize(sentence) == sentence){
                                        val = Ext.util.Inflector.pluralize(val);
                                        pattern = new RegExp(Ext.util.Inflector.pluralize(key), 'gi');
                                        pattern = new RegExp(key, 'gi');
                                    }

                                    output = sentence.replace(pattern, val);

                                }
                            }
                        }
                    });

                    return /*Ext.util.Format.capitalize*/(output);
                },

                trans: function (key, doNotOverride) {
                    var doNotOverride = doNotOverride || false;
                    if(doNotOverride) {
                        return langData[key];
                    } else {
                        if(langData[key]){
                            return this.customStrings(langData[key])
                        }
                        else {
                            return langData[key];
                        }
                    }
                    return langData[key]
                }
            }
        },
        Routes: function (routes) {
            var routes = routes || {},
                windowPathName = window.location.pathname;
            return {
                /**
                 * returns controller class name
                 * @returns {*}
                 */
                dispatch: function () {
                    return routes[windowPathName];
                },

                getViewport: function () {
                    return (routes[windowPathName] + 'init').toLowerCase();
                }
            }
        },
        Utils: {
            parseBool: function (value) {
                return typeof value === "undefined" ? false : value.replace(/^\s+|\s+$/g, "").toLowerCase() === "true";
            },
            addTimestamp: function () {
                return Math.random(0, Math.pow(10, 16)) * Math.pow(10, 17);
            }
        },
        GET: function () {
            var parts = window.location.search.substr(1).split('&');
            var getArray = {};

            for (var i = 0; i < parts.length; i++) {
                var temp = parts[i].split('=');
                getArray[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
            }
            return getArray;
        }};
}();

L = GeoPalUtils.TranslateComponent();
L.init('en');

