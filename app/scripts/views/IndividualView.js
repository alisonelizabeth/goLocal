define([
    'underscore',
    'backbone',
    'collections/CommentCollection',
    'models/CommentModel'
], function(_, Backbone, CommentCollection, Comment) {
    var IndividualView = Backbone.View.extend({
		
		singleTemplate: _.template($('#single-template').text()),

		className: 'single-view',

		events: {
			'click #like-button'	: 'likeIt', 
			'click #submit-comment'	: 'addComment',
		},

		initialize: function(){
			$('.container').append(this.el);
			this.comments = new CommentCollection();
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
			var _this = this;

			moreComments.set('content', newComment);
			moreComments.set('parent', this.model);
			this.comments.add(moreComments);

			if (_this.validateForm($('#new-comment')))
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
		validateForm: function(input) {
		  var valid = true;
		  input.removeClass('warning');
		  $('#message').removeClass('popup-message').html('');

		  if (input.val() === '') {
		    input.addClass('warning');
		    $('#message').addClass('popup-message').html('<span>Oops, please fill out the form.</span>')
		    valid = false;
		  }
		  return valid
		}
	});
    return IndividualView;
});