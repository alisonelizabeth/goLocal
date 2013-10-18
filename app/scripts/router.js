AppRouter = Backbone.Router.extend({

	initialize: function(){
		console.log('new route created');
		this.places = new PlaceCollection();
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

				if (placeToShow.get('placePhoto')) {
                		$('.container').append('<div class="main-image"><img src="'+placeToShow.get('placePhoto').url()+'" /></div>');
					}

				new IndividualView({model: placeToShow})
				console.log('view')

				var latitude = placeToShow.get('latitude')
				var longitude = placeToShow.get('longitude')
				var map = L.mapbox.map('map', 'alisonelizabeth.map-s8zjw3c1').setView([latitude, longitude], 15);    			

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