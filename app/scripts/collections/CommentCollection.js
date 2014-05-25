define([
    'underscore',
    'backbone',
    'parse',
    'models/CommentModel'
], function(_, Backbone, Parse, Comment) {
    'use strict';

    var CommentCollection = Parse.Collection.extend({
		model: Comment
	});

    return CommentCollection;
});