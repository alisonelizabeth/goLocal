define([
    'underscore',
    'jquery',
    'isotope'
], function(_, $, isotope) {

	var destroyIsotope = function() {
		var container = $('.container')
		
		if (container.hasClass('isotope')) {
			container.isotope('destroy');
		};	
	}
	
	return destroyIsotope;
});