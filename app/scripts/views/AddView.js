define([
    'underscore',
    'backbone',
    // 'chosen',
    'models/PlaceModel',
    'collections/PlaceCollection',
    'routers/AppRouter',
    'async!http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false'
], function(_, Backbone, PlaceClass, PlaceCollection, AppRouter) {

	var AddView = Backbone.View.extend({
		addTemplate: _.template($('#add-template').text()),

		className: 'add-view',

		events: {
			'click #location'	:'getLocation',
			'click #save'		:'save',
		},

		initialize: function() {
			$('.container').append(this.el);
			this.render();
			geocoder = new google.maps.Geocoder();
			this.places = new PlaceCollection();
		},

		render: function() {
			this.$el.append(this.addTemplate());
		},

		getLocation: function() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition, error)
			} else {
				alert('Geolocation is not supported by this browser.');
			}
			
			function showPosition(position) {
				geoLatitude = parseFloat(position.coords.latitude);
				geoLongitude = parseFloat(position.coords.longitude);
			  	var latlng = new google.maps.LatLng(geoLatitude, geoLongitude);

			  	geocoder.geocode({'latLng': latlng}, function(results, status) {
				    if (status == google.maps.GeocoderStatus.OK) {
				      if (results[0]) {
				        fullAddress = results[0].formatted_address
				        geoCity = results[0].address_components[2].long_name.toLowerCase();
				        geoAddress = (fullAddress.replace(', USA', ''))
				        console.log(geoAddress)
				      } else {
				        alert('No results found');
				      }
				    } else {
				      alert('Geocoder failed due to: ' + status);
				    }
			  	});
			}

			function error(error) {
		        alert(error.code);
	    	}
		},

		save: function() {
			var place = new PlaceClass();
			var fileUploadControl = $('#photo-upload')[0];
			var placeName = $('#name').val();
			var description	= $('#description').val();
			var products = $('.select').val();
			var _this = this;

			if (fileUploadControl.files.length > 0) {
				var file = fileUploadControl.files[0];
				var name = 'photo.jpg';
				var parseFile = new Parse.File(name, file);

				if (_this.validateCompleteForm() && _this.checkGeoLocation())
					parseFile.save().then(function(){
						place.set('placePhoto', parseFile);
						place.save();
					}); 
			}

			if ($('#address-location').val() !== '') {
				var geo = new google.maps.Geocoder;
				var address = $('#address-location').val();
				place.set('address', address)

				geo.geocode({'address':address},function(results, status){
				    if (status == google.maps.GeocoderStatus.OK) {
				    	var city = results[0].address_components[2].long_name.toLowerCase();          
				        var latitude = results[0].geometry.location.ob;
				        var longitude = results[0].geometry.location.pb;
				        place.set('latitude', latitude);
				        place.set('longitude', longitude);
				        place.set('city', city);
				    } else {
				        alert("Geocode was not successful for the following reason: " + status);
				    }
				});
			}

			if (($('#location').is(':checked'))) {
				place.set('latitude', geoLatitude);
		  		place.set('longitude', geoLongitude);
		  		place.set('address', geoAddress)
				place.set('city', geoCity)
			}

			place.set('products', products);
			place.set('likes', undefined);
			place.set('placeName', placeName);
			place.set('description', description);

			this.places.add(place);

			if (_this.validateCompleteForm() && _this.checkGeoLocation()) { 
				place.save(null, {
					success: function(results) {
						$('#name, #description').val('');
						// $('.select').val('').trigger('chosen:updated');
						$('#location').attr('checked', false);
						$('.modal').addClass('modal-active');
						$('.close-button').click(function() {
							$('.modal').removeClass('modal-active');
							Backbone.history.navigate('#',{trigger:true});
						});
					},
					error: function(results, error) {
						console.log(error.description);
					}
				});
			}
		},
		checkGeoLocation: function() {
		  var valid = true; 
		  var address = $('#address-location').val();

		  if (((geoLatitude === undefined) || (geoLongitude === undefined)) && address === '' ) {
		    valid = false
		    $('.modal-error-geo').addClass('modal-active-error-geo');
		    $('.close-button-error-geo').click(function() {
		        $('.modal-error-geo').removeClass('modal-active-error-geo');
		    });
		  }
		  return valid
		},
		validateCompleteForm: function() {
		  var valid = true;
		  var name = $('input#name');
		  var description = $('textarea#description');
		  var checkbox = $('#location');
		  var address = $('#address-location');
		  var photo = $('#photo-upload');

		  name.removeClass('red-warning');
		  description.removeClass('red-warning');

		  if ((photo.val() === '') || (name.val() === '') || ( (!checkbox.is(':checked')) && (address.val() === '') ) || (description.val() === '' )) {
		    valid = false;
		    $('.modal-error').addClass('modal-active-error');
		    $('.close-button-error').click(function() {
		        $('.modal-error').removeClass('modal-active-error');
		    });
		    if (name.val() === '') {
		      name.addClass('red-warning')
		    }
		    if (description.val() === '') {
		      description.addClass('red-warning')
		    }
		  }
		  return valid
		}
	});
    return AddView;
});
