define([
    'jquery'
], function($) {

	var validateCompleteForm = function() {
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
	return validateCompleteForm;
});