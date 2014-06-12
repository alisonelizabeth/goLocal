require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        parse: {
            deps: ['jquery', 'underscore'],
            exports: 'Parse'
        },
        isotope: {
            deps: ['jquery']
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        parse: 'http://www.parsecdn.com/js/parse-1.2.16.min',
        moment: '../bower_components/moment/moment',
        isotope: '../bower_components/isotope/jquery.isotope',
        mapbox: '//api.tiles.mapbox.com/mapbox.js/v1.3.1/mapbox',
        googleMaps: '//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false',
        chosen: 'utilities/chosen.jquery',
        'async': '../bower_components/requirejs-plugins/src/async'
    }
});

require(['parse'], function(Parse) {
    Parse.initialize('odceeKZIPEFi25d3RsOWBQqKz6QWTqJ1cckCkTnd', 'PwniGhD9YaeJgeBJQBdPTgPcTUfHdR5zANaNyfOE');
});

require([
    'backbone',
    'routers/AppRouter'
], function(Backbone, AppRouter) {
    var router = new AppRouter();
    Backbone.history.start();
});

