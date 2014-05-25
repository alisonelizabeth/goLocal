define([
    'jquery'
], function($) {

	var clickLocation = function() {  
		$('#location').click(function(){
			var location = $('#location');
			var address = $('#address-location');

			if ($('#location').is(':checked')) {
	    		address.attr('disabled', true);
	    		address.css('background', 'rgb(0, 89, 97)');
	    		address.val('');
	      
			} else {
	    		address.attr('disabled', false)
	    		address.css('background', 'white')
			}
	  	});
	}
	
	return clickLocation;
});