// utility functions 
// fixes isotope image rendering issue 
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

// removes isotope from views not using it 
function destroyIsotope() {
  var container = $('.container')
  if (container.hasClass('isotope')) {
      container.isotope('destroy');
    };
}

// simple validation function for comments 
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

// validation for AddView 
function validateCompleteForm() {
  var valid = true;

  var name        = $('input#name')
  var description = $('textarea#description')  
  var checkbox    = $('#location')
  var address     = $('#address-location')
  var photo       = $('#photo-upload')

  name.removeClass('red-warning')
  description.removeClass('red-warning')

  if ((photo.val() === '') || (name.val() === '') || ( (!checkbox.is(':checked')) && (address.val() === '') ) || (description.val() === ' ' )) {
    console.log('its false')
    valid = false 
    $('.modal-error').addClass('modal-active-error');
        $('.close-button-error').click(function() {
          $('.modal-error').removeClass('modal-active-error');
    });
    if (name.val() === '') {
      name.addClass('red-warning')
    }
    if (description.val() === ' ') {
      description.addClass('red-warning')
    }
  }
  return valid 
}

// make sure user is only allowed to add one address type on AddView
function clickLocation() {  
  $('#location').click(function(){
    var location = $('#location')
    var address = $('#address-location')

    if ($('#location').is(':checked')) {
      console.log('yes, lets geolocate')
      address.attr('disabled', true);
      address.css('background', 'rgb(0, 89, 97)');
      address.val('');
      
    } else {
      address.attr('disabled', false)
      address.css('background', 'white')
    }
  });
}

// check if geoLocation is working on AddView
function checkGeoLocation() {
  var valid = true; 
  var address = $('#address-location').val();

  if (((geoLatitude === undefined) || (geoLongitude === undefined)) && address === '' ) {
    console.log('no geolocation')
    valid = false
    $('.modal-error-geo').addClass('modal-active-error-geo');
        $('.close-button-error-geo').click(function() {
          $('.modal-error-geo').removeClass('modal-active-error-geo');
    });
  } 
  return valid 
}