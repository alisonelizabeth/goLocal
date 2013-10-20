AppRouter = Backbone.Router.extend({

	initialize: function(){
		console.log('new route created');
		this.places = new PlaceCollection();
		this.comments = new CommentCollection();
	},

	routes: {
		""				: "home",
		"places"		: "showPlaces",
		"places/:id"	: "showPlace",
		"addplace"		: "addPlace"
	},

	home: function() {
		$('.container').empty();

		$('.container').text('Home page')
	},

	showPlaces: function() {
		$('.container').empty();

		this.places.fetch({
			success: function(places) {
				places.each(function(place){
					if (place.get('placePhoto')) {
                		$('.container').append('<div class="thumbnail"><img src="'+place.get('placePhoto').url()+'" /></div>');
					}
					new FullView({model: place});
					console.log('full view')
				});
			}
		})
	},

	showPlace: function(id){
		$('.container').empty();

		var that = this
		this.places.fetch({
			success: function(){
				placeToShow = that.places.get(id);
				console.log(placeToShow.id)

				if (placeToShow.get('placePhoto')) {
                		$('.container').append('<div class="main-image"><img src="'+placeToShow.get('placePhoto').url()+'" /></div>');
					}

				new IndividualView({model: placeToShow})
				console.log('view')

				$('.container').append('<div id="map"> </div>')
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
				        title: 'A Single Marker',
				        description: 'Just one of me',
				        // one can customize markers by adding simplestyle properties
				        // http://mapbox.com/developers/simplestyle/
				        'marker-size': 'large',
				        'marker-color': '#f0a'
				    }
				}).addTo(map);
			
			$('#test').click(function(){
				var moreComments = new Comment();
				var newComment = $('#new-comment').val();
				moreComments.set('content', newComment);
				moreComments.set('parent', placeToShow);

				that.comments.add(moreComments)

				moreComments.save();
				
				});

			var query = new Parse.Query(Comment);
			console.log(query)

			query.equalTo('parent', placeToShow)

			query.find({
				success: function(results) {
					for (var i=0; i < results.length; i++) {
						console.log(results[i].attributes.content)
					}
				},
				error: function (results, error) {
					console.log(error.description)
				}
			});

			}

		});

		
		



		
	},

	addPlace: function() {
		$('.container').empty();
		new AddView();
	},
});

var router = new AppRouter();
Backbone.history.start();