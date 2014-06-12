define([
    'underscore',
    'backbone',
    'parse'
], function(_, Backbone, Parse) {
	
    var Comment = Parse.Object.extend('Comment');

    return Comment;
});