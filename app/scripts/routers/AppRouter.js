define([
    'jquery',
    'backbone',
    'parse',
    'isotope',
    'mapbox',
    'moment',
    'models/PlaceModel',
    'models/CommentModel',
    'collections/PlaceCollection',
    'collections/CommentCollection',
    'views/HomeView',
    'views/BottomView',
    'views/SearchView',
    'views/FullView',
    'views/IndividualView',
    'views/AddView',
    'utilities/isotopeFix',
    'utilities/destroyIsotope',
    'utilities/clickLocation',
    'utilities/emptyContainers'
], function($, Backbone, Parse, isotope, mapbox, moment, PlaceClass, Comment, PlaceCollection, CommentCollection, HomeView, BottomView, SearchView, FullView, IndividualView, AddView, isotopeFix, destroyIsotope, clickLocation, emptyContainers) {

    AppRouter = Backbone.Router.extend({

		initialize: function(){
			this.places = new PlaceCollection();
		},

		routes: {
			""						: "home",
			"places"				: "showPlaces",		
			"addplace"				: "addPlace",
			"places/results/:city"	: "searchCity",
			"places/:id"			: "showPlace"
		},

		home: function() {
			var footerTemplate = _.template($('#footer-template').text());
			var query = new Parse.Query(PlaceClass);

			emptyContainers();
			destroyIsotope();
			new HomeView();
			$('.container').append('<h2 class="bottom-head"> Recent finds</h2>')
			
			query.limit(3);
			query.descending('createdAt');
			query.find({
				success:function(results){
					for (var i=0; i<results.length; i++) {
						new BottomView({model: results[i]});
					}
					$('.footer').append(footerTemplate());
			},
				error: function(results, error){
					console.log(error.description)
				}
			});

		},

		showPlaces: function() {
			var headerTemplate = _.template($('#header-template').text());
			var footerTemplate = _.template($('#footer-template').text());

			emptyContainers();
			$('.full').append(headerTemplate());
			new SearchView();

			this.places.fetch({
				success: function(places) {
					places.each(function(place) {
						new FullView({model: place});
					});
					isotopeFix();
					$('.footer').append(footerTemplate())
				}
			});
		},

		showPlace: function(id){
			var headerTemplate = _.template($('#header-template').text());
			var footerTemplate = _.template($('#footer-template').text());
			var that = this;
			emptyContainers();
			destroyIsotope();
			$('.full').append(headerTemplate());

			this.places.fetch({
				success: function(){
					placeToShow = that.places.get(id);

					new IndividualView({model: placeToShow});
					$('.container').append('<div id="map"> </div>');

					var latitude = placeToShow.get('latitude');
					var longitude = placeToShow.get('longitude');
					var map = L.mapbox.map('map', 'alisonelizabeth.map-s8zjw3c1').setView([latitude, longitude], 15);

					L.mapbox.markerLayer({
					    type: 'Feature',
					    geometry: {
					        type: 'Point',
					        coordinates: [longitude , latitude]
					    },
					    properties: {
					        title: placeToShow.get('placeName'),
					        description: placeToShow.get('address'),
					        'marker-size': 'medium',
					        'marker-color': '#1E6A8B'
					    }
					}).addTo(map);

				var query = new Parse.Query(Comment);
				query.equalTo('parent', placeToShow);
				query.descending('createdAt');

				query.find({
					success: function(results) {
						$('#comment-header').append('<h2> Latest Comments </h2>');

						for (var i=0; i < results.length; i++) {
							$('#comments-box').append('<div id="individual-comment">' + '<p>' + results[i].attributes.content + '</p>' + '<img src="images/clock-2.png">' + '<span>' +  moment(results[i].createdAt, "ddd MMM DD YYYY HH:mm:ss").fromNow() + '</span>' + '</div>')
						}
					},
					error: function (results, error) {
						console.log(error.description);
					}
					});
				$('.footer').append(footerTemplate());
				}
			});	
		},

		addPlace: function() {
			var headerTemplate = _.template($('#header-template').text());
			var footerTemplate = _.template($('#footer-template').text());

			emptyContainers();
			destroyIsotope();
			new AddView();
			$('.full').append(headerTemplate());
			$('.footer').append(footerTemplate());
			clickLocation();
	        // $('.select').chosen({max_selected_options: 9});
	        $('#image-placeholder').show();
	        $('#image-preview, #check').hide();

		      function readURL(input) {
		        if (input.files && input.files[0]) {
		            var reader = new FileReader();

		            reader.onload = function(e) {
		                $('#image-preview').attr('src', e.target.result);
		            }
		            reader.readAsDataURL(input.files[0]);
		        }
		    }
		    $("#photo-upload").change(function(){
		    	$('#image-placeholder').hide();
		        $('#check, #image-preview').show();
		        readURL(this);
		    });
		},

		searchCity: function(city){
			var city = $('#city-name').val().toLowerCase();
			var cityURL = window.location.hash.split(/\//)[3];

			if (city !== '' && cityURL !== '') {
				var query = new Parse.Query(PlaceClass);
				
				query.equalTo('city', city);
				query.find({
					success: function(results){
						$('.container').empty();
						new SearchView();
						if (results.length > 0 ) {
							for (var i=0; i<results.length; i++) {
								new FullView({model: results[i]});
							}
							isotopeFix();

			            } else {
			            	$('.container').append('<div id="no-results"> <p>Sorry, there are no results for that city.</p> <a href="#/places"> Go back </div></a> ');
			            }
					},

					error: function(results, error){
						console.log(error.description);
					}
				});
			} else if (cityURL !== '') {
				var query = new Parse.Query(PlaceClass);
				query.equalTo('city', cityURL)

				query.find({
					success: function(results){
						$('.container').empty();
						new SearchView();
						if (results.length > 0 ) {
							for (var i=0; i<results.length; i++) {
								new FullView({model: results[i]});
							}
							isotopeFix();

			            } else {
			            	$('.container').append('<div id="no-results"> <p>Sorry, there are no results for that city.</p> <a href="#/places"> Go back </div></a> ');
			            }
					},
					error: function(results, error){
						console.log(error.description);
					}
				});
			} 
		} 
	});

    return AppRouter;
});