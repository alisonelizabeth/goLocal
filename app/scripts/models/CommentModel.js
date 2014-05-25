define([
    'underscore',
    'backbone',
    'parse'
], function(_, Backbone, Parse) {
    'use strict';

    var Comment = Parse.Object.extend('Comment');

    return Comment;
});
