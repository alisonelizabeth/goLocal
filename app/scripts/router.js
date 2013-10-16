AppRouter = Backbone.Router.extend({

	initialize: function(){
		console.log('new route created');
		this.places = new PlaceCollection();
		console.log(this.places)
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

	addPlace: function() {
		$('.container').empty();

		new AddView();

	},

	showPlaces: function() {

	}

});

var router = new AppRouter();
Backbone.history.start();