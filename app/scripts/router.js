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

		// this is temporary 
		$('.container').text('Home page')
	},

	showPlaces: function() {
		$('.container').empty();

		this.places.fetch({
			success: function(places) {
				places.each(function(place){
					if (place.get('placePhoto')) {
                		$('.container').append('<div class="thumbnail"><img src="'+place.get('placePhoto').url()+'" /></div>');
					} else {
						$('.container').append('<div class="thumbnail"><img src="images/placeholder.jpg"/></div>')
					}
					new FullView({model: place});
					console.log('full view');
				});
			}
		});
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
					} else {
						console.log('else')
						$('.container').append('<div class="main-image"><img src="images/placeholder.jpg"/></div>')
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

			var query = new Parse.Query(Comment);
			console.log(query);

			query.equalTo('parent', placeToShow);
			// maybe limit comments and add option to view more comments? 
			// query.limit(10); 
			query.ascending('createdAt');

			query.find({
				success: function(results) {
					console.log(results.length + 1)
					$('#comment-header').append('<h2>' + (results.length + 1) + ' Comments' + '</h2>')
					for (var i=0; i < results.length; i++) {
						$('#comments-box').append('<div id="individual-comment">' + '<p>' + results[i].attributes.content + '</p>' + '<span>' +  moment(results[i].createdAt, "ddd MMM DD YYYY HH:mm:ss").fromNow() + '</span>' + '</div>')
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
		new AddView();
	},

	editPlace: function(){
		$('.container').text('testing... Edit page')
	},
});

var router = new AppRouter();
Backbone.history.start();