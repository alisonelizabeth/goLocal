Parse.initialize("odceeKZIPEFi25d3RsOWBQqKz6QWTqJ1cckCkTnd", "PwniGhD9YaeJgeBJQBdPTgPcTUfHdR5zANaNyfOE");

var PlaceClass = Parse.Object.extend('LocalClass');

var Comment = Parse.Object.extend('Comment');

var PlaceCollection = Parse.Collection.extend({
	model: PlaceClass
});

var CommentCollection = Parse.Collection.extend({
	model: Comment
});


$(document).ready(function() {
  $('#photo-upload').change(function(){

        var fileInputVal = $(this).val();
        fileInputVal = fileInputVal.replace("C:\\fakepath\\", "");
        $(this).parent().prev().val(fileInputVal);

    });
});