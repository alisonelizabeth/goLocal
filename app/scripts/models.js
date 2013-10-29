Parse.initialize("odceeKZIPEFi25d3RsOWBQqKz6QWTqJ1cckCkTnd", "PwniGhD9YaeJgeBJQBdPTgPcTUfHdR5zANaNyfOE");

var PlaceClass = Parse.Object.extend('LocalClass');

var Comment = Parse.Object.extend('Comment');

var PlaceCollection = Parse.Collection.extend({
	model: PlaceClass
});

var CommentCollection = Parse.Collection.extend({
	model: Comment
});


// utility functions 
function isotopeFix(){
  var container = $('.container')
  var images = $("img");

  if(!container.hasClass('isotope')) {
    container.imagesLoaded(function () {
      container.isotope({
        itemSelector: '.full-view'
      });
        images.load(function () {
          container.isotope('reLayout');
      }); 
    });
  } else {
    container.isotope('destroy');
    container.imagesLoaded(function () {
      container.isotope({
          itemSelector: '.full-view'
      });
      images.load(function () {
          container.isotope('reLayout');
      }); 
    });
  }
}

function validateForm(input) {
  var valid = true;
  input.removeClass('warning');
  $('#message').removeClass('popup-message').html('')

  if (input.val() === '') {
    input.addClass('warning');
    $('#message').addClass('popup-message').html('<span>Oops, please fill out the form.</span>')
    valid = false;
  }
  return valid
}

