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
					new FullView({model: place});
					if (place.get('placePhoto')) {
                		$('.container').append('<img src="'+place.get('placePhoto').url()+'" />');
					}
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
				new IndividualView({model: placeToShow})
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