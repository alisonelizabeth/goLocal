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
});

// BottomView: Bottom view of the home page; shows recent finds 
BottomView = Backbone.View.extend({
	bottomTemplate: _.template($('#bottom-template').text()),

	className: 'bottom-view',

	events: {
		'click #activate': 'activate'
	},

	initialize: function(){
		$('.container').append(this.el);
		this.render();
	},

	render: function(){
		this.$el.append(this.bottomTemplate({place: this.model}) );
	},

	activate: function(){
		this.$el.find('#activate').attr('href', "#/places/" + this.model.id);
	}
});

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

// SearchView: Activates search toolbar on places route 
SearchView = Backbone.View.extend({
	searchTemplate: _.template($('#search-template').text()),

	className: 'search-view',

	events: {
		'click #search-button': "search", 
	},

	initialize: function() {
		$('.container').append(this.el);
		this.render();
	},

	render: function() {
		this.$el.append(this.searchTemplate() );
	},

	search: function(){
		var city = $('#city-name').val();
		if (city !== '') {
			this.$el.find('#search-button').attr('href', '#/places/results/' + city)
		} 
	}
});


// IndividualView: Shows individual local place 
IndividualView = Backbone.View.extend({
	singleTemplate: _.template($('#single-template').text()),

	className: 'single-view',

	events: {
		'click #like-button'	: 'likeIt', 
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

		if (validateForm($('#new-comment')))
			moreComments.save(null, {
				success: function(results){
					console.log(moreComments.createdAt);
					$('#new-comment').val('');
					$('#comments-box').append('<div id="individual-comment">' + '<p>' + moreComments.attributes.content + '</p>' + '<img src="images/clock-2.png">' + '<span>' +  moment(moreComments.createdAt, "ddd MMM DD YYYY HH:mm:ss").fromNow() + '</span>' +'</div>')
				},
				error: function(results, error){
					console.log(error.description)
				}
			});
	},
});

// AddView: Add place to Parse database 
var geocoder 
var geoLatitude
var geoLongitude
var geoCity
var geoAddress
AddView = Backbone.View.extend({
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
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			console.log('Geolocation is not supported by this browser.');
		}
		
		function showPosition(position) {
			geoLatitude = parseFloat(position.coords.latitude);
			geoLongitude = parseFloat(position.coords.longitude); 
			console.log(geoLatitude + ' and ' + geoLongitude);
				
		  	var latlng = new google.maps.LatLng(geoLatitude, geoLongitude);
		  	geocoder.geocode({'latLng': latlng}, function(results, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
			      if (results[0]) {
			      	console.log(results[0])
			        var fullAddress = results[0].formatted_address
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

			if (validateCompleteForm())
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
	  		place.set('address', geoAddress)
			place.set('city', geoCity)
		}

		place.set('products', products);
		place.set('likes', undefined);
		place.set('placeName', placeName);
		place.set('description', description);

		collection = router.places;
		collection.add(place);
		console.log(collection);

		if (validateCompleteForm()) {
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
		} else {
			console.log('error')
		}	
	},
});