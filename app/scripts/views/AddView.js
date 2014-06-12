define([
    'underscore',
    'backbone',
    'models/PlaceModel',
    'utilities/checkGeoLocation',
    'utilities/validateCompleteForm',
    'async!http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false'
], function(_, Backbone, PlaceClass, checkGeoLocation, validateCompleteForm) {
	
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
			console.log('new addView');
			geocoder = new google.maps.Geocoder();
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
				console.log('user approved geolocation')
				geoLatitude = parseFloat(position.coords.latitude);
				geoLongitude = parseFloat(position.coords.longitude); 
				console.log(geoLatitude + ' and ' + geoLongitude);
				if (geoLatitude === undefined) {
					console.log('undefined')
				}
					
			  	var latlng = new google.maps.LatLng(geoLatitude, geoLongitude);
			  	geocoder.geocode({'latLng': latlng}, function(results, status) {
				    if (status == google.maps.GeocoderStatus.OK) {
				      if (results[0]) {
				      	console.log(results[0])
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
				console.log('user denied geolocation')
		        alert(error.code);
		        if (error.code == 1) {
		            console.log('user said no')
		        }
	    	}
		},

		save: function() {
			var place = new PlaceClass();

			var fileUploadControl = $('#photo-upload')[0];

			var placeName 	= $('#name').val();
			var description	= $('#description').val();
			var products 	= $('.select').val();

			console.log(fileUploadControl.files)

			if (fileUploadControl.files.length > 0) {
				var file = fileUploadControl.files[0];
				var name = 'photo.jpg';

				var parseFile = new Parse.File(name, file);
				console.log(parseFile)

				if (validateCompleteForm() && checkGeoLocation())
				parseFile.save().then(function(){
					console.log(parseFile.url());
					place.set('placePhoto', parseFile);
					place.save();
				}); 
			}	else {
				console.log('Error occured.');
			}

			if ($('#address-location').val() !== '' ) {
				var geo = new google.maps.Geocoder;
				var address = $('#address-location').val();
				place.set('address', address)

				geo.geocode({'address':address},function(results, status){
				    if (status == google.maps.GeocoderStatus.OK) {
				    	console.log(results[0])  
				    	var city = results[0].address_components[2].long_name.toLowerCase();          
				        var latitude = results[0].geometry.location.ob;
				        var longitude = results[0].geometry.location.pb;
				        console.log(latitude, longitude);
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
		  		console.log(geoLatitude)
		  		place.set('address', geoAddress)
				place.set('city', geoCity)
			} else {
				console.log('error')
			}

			place.set('products', products);
			place.set('likes', undefined);
			place.set('placeName', placeName);
			place.set('description', description);

			collection = router.places;
			collection.add(place);
			console.log(collection);

			if (checkGeoLocation() && validateCompleteForm()) { 
				place.save(null, {
					success: function(results) {
						console.log('it saved');
						$('#name').val('');
						$('#description').val('');
						$('.select').val('').trigger('chosen:updated');
						$('#location').attr('checked', false);
						$('.modal').addClass('modal-active');
						$('.close-button').click(function() {
							$('.modal').removeClass('modal-active');
							router.navigate("#", {trigger:true});
						});
					},

					error: function(results, error) {
						console.log(error.description);
					}
				});
			}
		}
	});
    return AddView;
});
