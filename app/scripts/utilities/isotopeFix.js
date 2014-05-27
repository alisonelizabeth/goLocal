define([
    'underscore',
    'jquery',
    'isotope'
], function(_, $, isotope) {
	var isotopeFix = function(){
	  var container = $('.container')
	  var images = $('img');

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

	return isotopeFix;
});