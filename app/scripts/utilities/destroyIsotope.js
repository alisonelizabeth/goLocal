define([
    'underscore',
    'jquery',
    'isotope'
], function(_, $, Isotope) {

	var destroyIsotope = function() {
		var container = $('.container')
		
		if (container.hasClass('isotope')) {
			container.isotope('destroy');
		};	
	}
	
	return destroyIsotope;
});