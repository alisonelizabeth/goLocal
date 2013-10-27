AppRouter = Backbone.Router.extend({

	initialize: function(){
		console.log('new route created');
		this.places = new PlaceCollection();
		this.comments = new CommentCollection();
	},

	routes: {
		""					: "home",
		"places"			: "showPlaces",
		"places/:id"		: "showPlace",
		"addplace"			: "addPlace",
		"places/:id/edit"	: "editPlace",
	},

	home: function() {
		$('.container').empty();
		$('.full').empty();
		$('.footer').empty();
		console.log('i am home')
		new HomeView();

		$('.container').append('<h2 class="bottom-head"> Recent finds</h2>')
		query = new Parse.Query(PlaceClass);
		query.limit(3)

		query.find({
			success:function(results){
				for (var i=0; i<results.length; i++) {
					new BottomView({model: results[i]});
				}
				$('.footer').append('<footer> <div class="footer-container">&copy Alison Miller</div></footer>')
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
		new SearchView();

		this.places.fetch({
			success: function(places) {
				places.each(function(place){
					new FullView({model: place});
				});

				var container = $('.container')
				if(!container.hasClass('isotope')) {
					container.isotope({
						itemSelector: '.full-view',
				});

                } else {
                    container.isotope('destroy');
                    container.isotope({
                        itemSelector: '.full-view',
                    });
                }
			}
		});

	},

	showPlace: function(id){
		$('.container').empty();
		$('.full').empty();
		$('.footer').empty();

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
				        'marker-color': '#156B6C'
				    }
				}).addTo(map);

			var query = new Parse.Query(Comment);
			console.log(query);

			query.equalTo('parent', placeToShow);
			query.descending('createdAt');

			query.find({
				success: function(results) {
					console.log(results.length)
					$('#comment-header').append('<h2> Latest Comments </h2>')
					for (var i=0; i < results.length; i++) {
						$('#comments-box').append('<div id="individual-comment">' + '<p>' + results[i].attributes.content + '</p>' + '<img src="images/clock-2.png">' + '<span>' +  moment(results[i].createdAt, "ddd MMM DD YYYY HH:mm:ss").fromNow() + '</span>' + '</div>')
					}
				},
				error: function (results, error) {
					console.log(error.description);
				}
				});
			}
		});		
	},

	addPlace: function() {
		$('.container').empty();
		$('.full').empty();
		new AddView();
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

	editPlace: function(){
		$('.full').empty();
		$('.container').text('testing... Edit page')
	},
});

var router = new AppRouter();
Backbone.history.start();