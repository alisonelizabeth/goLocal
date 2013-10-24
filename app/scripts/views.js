// HomeView: Home page view
HomeView = Backbone.View.extend({
	homeTemplate: _.template($('#home-template').text()),

	className: 'home-view',

	initialize: function(){
		$('.full').append(this.el);
		this.render();
	},

	render: function(){
		this.$el.append(this.homeTemplate());
	}
})

// FullView: Shows complete listing of local spots 
FullView = Backbone.View.extend({
	gridTemplate: _.template($('#grid-template').text()),

	className: 'full-view',

	events: {
		'click #activate': 'activate'
	},

	initialize: function() {
		$('.container').append(this.el);
		this.render();
	},

	render: function() {
		this.$el.append(this.gridTemplate({place: this.model}) );
	},

	activate: function(){
		this.$el.find('#activate').attr('href', "#/places/" + this.model.id);
	}
});

// IndividualView: Shows individual local place 
IndividualView = Backbone.View.extend({
	singleTemplate: _.template($('#single-template').text()),

	className: 'single-view',

	events: {
		'click #likes'			: 'likeIt', 
		'click #submit-comment'	: 'addComment',
	},

	initialize: function(){
		$('.container').append(this.el);
		this.render();
	},

	render: function(){
		this.$el.append(this.singleTemplate({place: this.model}) );
	},

	likeIt: function(){
		this.model.increment('likes');
        console.log(this.model);
		this.model.save();
	},

	addComment: function(){
		var moreComments = new Comment();
		var newComment = $('#new-comment').val();
		moreComments.set('content', newComment);
		moreComments.set('parent', this.model);

		router.comments.add(moreComments);
		console.log(moreComments);
		if (this.validateForm($('#new-comment')))
			moreComments.save(null, {
				success: function(results){
					console.log(moreComments.createdAt);
					$('#new-comment').val('');
					$('#comments-box').append('<div id="individual-comment">' + '<p>' + moreComments.attributes.content + '</p>' + '<span>' +  moment(moreComments.createdAt, "ddd MMM DD YYYY HH:mm:ss").fromNow() + '</span>' +'</div>')
				},
				error: function(results, error){
					console.log(error.description)
				}
			});
	},

	validateForm: function(input) {
		var valid = true;
		input.removeClass('warning');
		$('#message').removeClass('popup-message')

		if (input.val() === '') {
			input.addClass('warning');
			$('#message').addClass('popup-message').html('<span>Oops, please fill out the form.</span>')
			valid = false;
		}
		return valid
	},
});

// AddView: Add place to Parse database 
var geocoder 
AddView = Backbone.View.extend({
	addTemplate: _.template($('#add-template').text()),

	className: 'add-view',

	events: {
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

	save: function() {
		var place = new PlaceClass();

		var fileUploadControl = $('#photo-upload')[0];

		var type 		= $('#type').val();
		var placeName 	= $('#name').val();
		var comments	= $('#comments').val();
		var products 	= $('.select').val();

		if (fileUploadControl.files.length > 0) {
			var file = fileUploadControl.files[0];
			var name = 'photo.jpg';

			var parseFile = new Parse.File(name, file);

			parseFile.save().then(function(){
				console.log(parseFile.url());
				place.set('placePhoto', parseFile);
				place.save();
			}); 
		}	else {
			console.log('Error occured.');
		}

		if ($('#location').is(':checked')) {
			console.log('its checked')

			if (navigator.geolocation) {
    			navigator.geolocation.getCurrentPosition(showPosition);
    		} else {
    			console.log('Geolocation is not supported by this browser.');
    		}
  		
			function showPosition(position) {
	  			var latitude = parseFloat(position.coords.latitude);
	  			var longitude = parseFloat(position.coords.longitude); 
	  			console.log(latitude + ' and ' + longitude);
	  			
	  			place.set('latitude', latitude);
	  			place.set('longitude', longitude);

			  	var latlng = new google.maps.LatLng(latitude, longitude);
			  	geocoder.geocode({'latLng': latlng}, function(results, status) {
				    if (status == google.maps.GeocoderStatus.OK) {
				      if (results[0]) {
				        var fullAddress = results[0].formatted_address
				        var address = (fullAddress.replace(', USA', ''))
				        place.set('address', address)
				      } else {
				        alert('No results found');
				      }
				    } else {
				      alert('Geocoder failed due to: ' + status);
				    }
			  	});
	  		}
		}

		if ($('#address-location').val() !== '' ) {
			var geo = new google.maps.Geocoder;
			var address = $('#address-location').val();
			place.set('address', address)

			geo.geocode({'address':address},function(results, status){
			    if (status == google.maps.GeocoderStatus.OK) {              
			        var latitude = results[0].geometry.location.lb;
			        var longitude = results[0].geometry.location.mb;
			        console.log(latitude, longitude);
			        place.set('latitude', latitude);
			        place.set('longitude', longitude);

			    } else {
			        alert("Geocode was not successful for the following reason: " + status);
			    }
			});
		}

		place.set('placeType', type);
		place.set('placeName', placeName);
		place.set('comments', comments);
		place.set('likes', undefined);
		place.set('products', products);

		collection = router.places;
		collection.add(place);
		console.log(collection);

		place.save(null, {
			success: function(results) {
				console.log(results);
				$('#name').val('');
				$('#comments').val('');
				$('.select').val('').trigger('chosen:updated');
				$('#location').attr('checked', false);
				$('.file-input-textbox').val('No file selected');
			},

			error: function(results, error) {
				console.log(error.description);
			}
		});
	},
});