define([
    'jquery'
], function($) {

	var checkGeoLocation = function() {
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
	return checkGeoLocation;
});