define([
    'underscore',
    'backbone',
    'parse',
    'models/CommentModel'
], function(_, Backbone, Parse, Comment) {

    var CommentCollection = Parse.Collection.extend({
		model: Comment
	});

    return CommentCollection;
});