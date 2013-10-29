AppRouter = Backbone.Router.extend({

	initialize: function(){
		console.log('new route created');
		this.places = new PlaceCollection();
		this.comments = new CommentCollection();
	},

	routes: {
		""					: "home",
		"places"			: "showPlaces",		
		"addplace"			: "addPlace",
		"places/search"		: "searchCity",
		"places/:id"		: "showPlace",
	},

	home: function() {
		var container = $('.container')
		container.empty();
		
		if (container.hasClass('isotope')) {
			container.isotope('destroy');
		};

		$('.full').empty();
		$('.footer').empty();
		console.log('i am home');
		new HomeView();

		container.append('<h2 class="bottom-head"> Recent finds</h2>')
		query = new Parse.Query(PlaceClass);
		query.limit(3)

		query.find({
			success:function(results){
				for (var i=0; i<results.length; i++) {
					new BottomView({model: results[i]});
				}
				$('.footer').append('<footer> <div class="footer-container">&copy 2013 goLocal. All Rights Reserved.</div></footer>')
			},

			error: function(results, error){
				console.log(error.description)
			}
		});

	},

	showPlaces: function() {
		$('.container').empty();
		$('.full').empty();
		$('.footer').empty();

		var headerTemplate = _.template($('#header-template').text());
		$('.full').append(headerTemplate());

		new SearchView();

		this.places.fetch({
			success: function(places) {
				places.each(function(place){
					new FullView({model: place});
				});

				isotopeFix();

           	$('.footer').append('<footer> <div class="footer-container">&copy 2013 goLocal. All Rights Reserved.</div></footer>')
			}
		});
	},

	showPlace: function(id){
		var container = $('.container')
		$('.full').empty();
		$('.footer').empty();
		container.empty();
		
		if (container.hasClass('isotope')) {
			container.isotope('destroy');
		};

		var headerTemplate = _.template($('#header-template').text());
		$('.full').append(headerTemplate());

		var that = this
		this.places.fetch({
			success: function(){
				placeToShow = that.places.get(id);
				console.log(placeToShow.id)

				new IndividualView({model: placeToShow});
				console.log('view');

				$('.container').append('<div id="map"> </div>');
				var latitude = placeToShow.get('latitude')
				var longitude = placeToShow.get('longitude')
				var map = L.mapbox.map('map', 'alisonelizabeth.map-s8zjw3c1')
				.setView([latitude, longitude], 15);    			

				L.mapbox.markerLayer({
				    type: 'Feature',
				    geometry: {
				        type: 'Point',
				        coordinates: [longitude , latitude]
				    },
				    properties: {
				        title: placeToShow.get('placeName'),
				        description: placeToShow.get('address'),
				        'marker-size': 'medium',
				        'marker-color': '#1E6A8B'
				    }
				}).addTo(map);

			var query = new Parse.Query(Comment);
			console.log(query);

			query.equalTo('parent', placeToShow);
			query.descending('createdAt');
			console.log(placeToShow.get('products'))

			query.find({
				success: function(results) {
					console.log(results.length)
					if (results.length > 0) {
						$('#comment-header').append('<h2> Latest Comments </h2>')
					}
					for (var i=0; i < results.length; i++) {
						$('#comments-box').append('<div id="individual-comment">' + '<p>' + results[i].attributes.content + '</p>' + '<img src="images/clock-2.png">' + '<span>' +  moment(results[i].createdAt, "ddd MMM DD YYYY HH:mm:ss").fromNow() + '</span>' + '</div>')
					}
				},
				error: function (results, error) {
					console.log(error.description);
				}
				});
			$('.footer').append('<footer> <div class="footer-container">&copy 2013 goLocal. All Rights Reserved.</div></footer>')
			}
		});	
	},

	addPlace: function() {
		var container = $('.container')
		container.empty();
		
		if (container.hasClass('isotope')) {
			container.isotope('destroy');
		};

		$('.full').empty();
		$('.footer').empty();
		new AddView();
		var headerTemplate = _.template($('#header-template').text());
		$('.full').append(headerTemplate());
		$('.footer').append('<footer> <div class="footer-container">&copy 2013 goLocal. All Rights Reserved.</div></footer>')

        $('.select').chosen({max_selected_options: 9});

        $('#image-preview').hide();
	    $('#check').hide();
	      function readURL(input) {
	        if (input.files && input.files[0]) {
	            var reader = new FileReader();
	            
	            reader.onload = function (e) {
	                $('#image-preview').attr('src', e.target.result);
	            }
	            reader.readAsDataURL(input.files[0]);
	        }
	    }
	    $("#photo-upload").change(function(){
	        $('#check').show();
	        $('#image-preview').show();
	        readURL(this);
	    });
	},

	searchCity: function(){
		console.log('searching...')

		var city = $('#city-name').val();

		var query = new Parse.Query(PlaceClass);

		query.equalTo('city', city)

		query.find({
			success: function(results){
				console.log(results);
				$('.container').empty();
				new SearchView();

				if (results.length > 0 ) {
					for (var i=0; i<results.length; i++) {
						new FullView({model: results[i]});
					}
					isotopeFix();

	            } else {
	            	$('.container').append('<p id="no-results"> Sorry, there are no results for that city.</p>')
	            }
			},

			error: function(results, error){
				console.log(error.description);
			}
		});
	}
});

var router = new AppRouter();
Backbone.history.start();