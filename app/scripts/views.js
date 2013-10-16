// FullView: Shows complete listing of local spots 
FullView = Backbone.View.extend({
	gridTemplate: _.template($('#grid-template').text()),

	className: 'full-view',

	initialize: function() {
		$('.container').append(this.el);
	},

	render: function() {

	}

})


// AddView: Add place to Parse database 
AddView = Backbone.View.extend({
	addTemplate: _.template($('#add-template').text()),

	className: 'add-view',

	events: {
		'click #save'	:'save' 
	},

	initialize: function() {
		$('.container').append(this.el);
		this.render();
		console.log('new view')
	},

	render: function() {
		this.$el.append(this.addTemplate());
	},

	save: function() {
		var fileUploadControl = $('#photo-upload')[0];
		if (fileUploadControl.files.length > 0) {
			var file = fileUploadControl.files[0];
			var name = 'photo.jpg';

			var parseFile = new Parse.File(name, file);
		}

		parseFile.save().then(function(){
			console.log('it saved')
		}, function(error) {
			console.log('error occured')
		});

		var place = new PlaceClass();

		var type 		= $('#type').val();
		var placeName 	= $('#name').val();
		var comments	= $('#comments').val();

		place.set('placeType', type);
		place.set('placeName', placeName);
		place.set('comments', comments);
		place.set('placePhoto', file);

		collection = router.places
		collection.add(place)
		console.log(collection)

		place.save(null, {
			success: function(results) {
				console.log(results);
				$('input').val('');
				$('textarea').val('');
				$('select').val('');
				// temporary 
			},

			error: function(results, error) {
				console.log(error.description);
			}
		});
	}
});


