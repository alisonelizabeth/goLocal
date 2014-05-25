define([
    'underscore',
    'backbone'
], function(_, Backbone) {
	var HomeView = Backbone.View.extend({
		homeTemplate: _.template($('#home-template').text()),

		className: 'home-view',

		initialize: function(){
			console.log('homeview');
			$('.full').append(this.el);
			this.render();
		},

		render: function(){
			this.$el.append(this.homeTemplate());
			console.log('homeview');
		}
	});

    return HomeView;
});
