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
    $('#image-preview').hide();
    $('#check').hide();
      function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#image-preview').attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#photo-upload").change(function(){
        $('#check').show();
        $('#image-preview').show();
        readURL(this);
    });
});