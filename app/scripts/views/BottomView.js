define([
    'underscore',
    'backbone'
], function(_, Backbone) {
	var BottomView = Backbone.View.extend({
		bottomTemplate: _.template($('#bottom-template').text()),

		className: 'bottom-view',

		events: {
			'click #activate': 'activate'
		},

		initialize: function(){
			$('.container').append(this.el);
			this.render();
		},

		render: function(){
			this.$el.append(this.bottomTemplate({place: this.model}) );
		},

		activate: function(){
			this.$el.find('#activate').attr('href', "#/places/" + this.model.id);
		}
	});

    return BottomView;
});
