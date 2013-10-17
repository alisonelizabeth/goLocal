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
				});

			}
		})

	},

	addPlace: function() {
		$('.container').empty();

		new AddView();

	},


});

var router = new AppRouter();
Backbone.history.start();