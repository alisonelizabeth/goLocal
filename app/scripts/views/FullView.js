define([
    'underscore',
    'backbone'
], function(_, Backbone) {
	var FullView = Backbone.View.extend({
		gridTemplate: _.template($('#grid-template').text()),

		className: 'full-view',

		events: {
			'click #activate': 'activate'
		},

		initialize: function() {
			$('.container').append(this.el);
			this.render();
		},

		render: function() {
			this.$el.append(this.gridTemplate({place: this.model}) );
		},

		activate: function(){
			this.$el.find('#activate').attr('href', "#/places/" + this.model.id);
		}
	});

    return FullView;
});
