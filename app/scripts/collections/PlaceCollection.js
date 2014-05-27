define([
    'underscore',
    'backbone',
    'parse',
    'models/PlaceModel'
], function(_, Backbone, Parse, PlaceClass) {
	
    var PlaceCollection = Parse.Collection.extend({
        model: PlaceClass
    });

    return PlaceCollection;
});