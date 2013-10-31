Parse.initialize("odceeKZIPEFi25d3RsOWBQqKz6QWTqJ1cckCkTnd", "PwniGhD9YaeJgeBJQBdPTgPcTUfHdR5zANaNyfOE");

var PlaceClass = Parse.Object.extend('LocalClass');

var Comment = Parse.Object.extend('Comment');

var PlaceCollection = Parse.Collection.extend({
	model: PlaceClass
});

var CommentCollection = Parse.Collection.extend({
	model: Comment
});
