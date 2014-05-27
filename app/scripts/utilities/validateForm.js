define([
    'jquery'
], function($) {

	var validateForm = function(input) {
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
	return validateForm;
});