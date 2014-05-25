define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var SearchView = Backbone.View.extend({
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
			var city = $('#city-name').val().toLowerCase();
			if (city !== '') {
				this.$el.find('#search-button').attr('href', '#/places/results/' + city)
			} 
		}
	});

    return SearchView;
});
