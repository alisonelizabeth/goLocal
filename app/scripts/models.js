Parse.initialize("odceeKZIPEFi25d3RsOWBQqKz6QWTqJ1cckCkTnd", "PwniGhD9YaeJgeBJQBdPTgPcTUfHdR5zANaNyfOE");

var PlaceClass = Parse.Object.extend('LocalClass');

var PlaceCollection = Parse.Collection.extend({
	model: PlaceClass
});