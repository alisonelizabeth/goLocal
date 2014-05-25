define([
    'underscore',
    'backbone',
    'parse'
], function(_, Backbone, Parse) {
    'use strict';

    var PlaceClass = Parse.Object.extend('LocalClass');

    return PlaceClass;
});
