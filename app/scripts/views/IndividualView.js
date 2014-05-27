define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var IndividualView = Backbone.View.extend({
		singleTemplate: _.template($('#single-template').text()),

		className: 'single-view',

		events: {
			'click #like-button'	: 'likeIt', 
			'click #submit-comment'	: 'addComment',
		},

		initialize: function(){
			$('.container').append(this.el);
			this.render();
		},

		render: function(){
			this.$el.append(this.singleTemplate({place: this.model}) );
		},

		likeIt: function(){
			this.model.increment('likes');
			this.model.save();
		},

		addComment: function(){
			var moreComments = new Comment();
			var newComment = $('#new-comment').val();
			moreComments.set('content', newComment);
			moreComments.set('parent', this.model);

			router.comments.add(moreComments);

			if (validateForm($('#new-comment')))
				moreComments.save(null, {
					success: function(results){
						$('#new-comment').val('');
						$('#comments-box').append('<div id="individual-comment">' + '<p>' + moreComments.attributes.content + '</p>' + '<img src="images/clock-2.png">' + '<span>' +  moment(moreComments.createdAt, "ddd MMM DD YYYY HH:mm:ss").fromNow() + '</span>' +'</div>')
					},
					error: function(results, error){
						console.log(error.description)
					}
				});
		},
	});
    return IndividualView;
});