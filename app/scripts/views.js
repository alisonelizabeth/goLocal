// HomeView: Home page view
// this should be moved to router, just need template 
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
		this.$el.find('#search-button').attr('href', '#/places/search')
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
		// need to fix this... 
		$('#comment-header').append('<h2> Latest Comments </h2>')

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
		var description	= $('#description').val();
		var products 	= $('.select').val();

		console.log(fileUploadControl.files)
		if (fileUploadControl.files.length > 0) {
			var file = fileUploadControl.files[0];
			var name = 'photo.jpg';

			var parseFile = new Parse.File(name, file);
			console.log(parseFile)

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
				        var city = results[0].address_components[2].long_name
				        var address = (fullAddress.replace(', USA', ''))
				        place.set('address', address)
				        place.set('city', city)
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
		place.set('description', description);
		place.set('likes', undefined);
		place.set('products', products);

		collection = router.places;
		collection.add(place);
		console.log(collection);

		place.save(null, {
			success: function(results) {
				console.log(results);
				$('#name').val('');
				$('#description').val('');
				$('.select').val('').trigger('chosen:updated');
				$('#location').attr('checked', false);
				$('.file-input-textbox').val('No file selected');
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
	},
});