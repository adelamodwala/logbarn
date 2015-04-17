//Listings Map

var locationMap = function(args) {
	var $ = jQuery;
	var mapCenter, map, allAddrLen;
	var allMarkers = [];
	var allAddr = [];
	var addrList = args.addrList;
	// var imageURL = args.pointer;
	var canvasID = args.canvasID;

	addrList.each(function() {
		allAddr.push({
			address: $(this).html()
		});
	});
	// console.log(allAddr);


	function enable() {
		initialize();
	}

	function scrollToResults() {
		if($('#result-listings').length > 0 && $(".post").hasClass('search-results')) {
			var newTop = $('#result-listings').offset().top - $('.site-header').height();
			console.log(newTop);
			TweenLite.to($(window), 0.65, {scrollTo:newTop});
		}
	}

	function addInfoWindow(marker, message, permalink) {
		var infoWindow = new google.maps.InfoWindow({
			content: '<div class="scroll-fix">' + message + '</div>'
		});

		google.maps.event.addListener(marker, 'mouseover', function() {
			infoWindow.open(map, marker);
			$(".gm-style-iw").next("div").hide();
		});

		google.maps.event.addListener(marker, 'mouseout', function() {
			infoWindow.close();
		});

		google.maps.event.addListener(marker, 'click', function() {
			console.log(permalink);
			if(permalink) window.location.href = permalink;
			
		});
	}

	function initialize() {
		var map_canvas, allLatLng, map_options;

		map_canvas = document.getElementById(canvasID);
		var myLatlng;

		map_options = {
			zoom: 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			title: 'Search Results'
		}
		map = new google.maps.Map(map_canvas, map_options);
		geocoder = new google.maps.Geocoder();

		var avgLatLng = {lat: 0, lng: 0}
		// console.log('len really is: ' + allAddr.length);
		allAddrLen = allAddr.length;

		for(var iter = 0; iter < allAddrLen; iter++) {
			var myLatlng;
			var latLng = allAddr[iter];
			// console.log(latLng);
			
			(function(i) {
				
	      geocoder.geocode(
	        latLng,
	        function(results, status) {
	        	// console.log('my i: hmm');
	        	latLng = allAddr[i];
	        	// console.log(allAddr[i]);
	          myLatLng = results[0].geometry.location;		
	          var elem = $(addrList[i]);
	          elem.attr({
	          	'data-lat': myLatLng.lat(),
	          	'data-lng': myLatLng.lng()
	          });
	          elem.click(function() {
							var movePoint = new google.maps.LatLng($(this).attr('data-lat'), $(this).attr('data-lng'));
							console.log(movePoint);
							map.panTo(movePoint);
							
							$(this).closest('.details').find('h1, h2').removeClass('showing');
							$(this).addClass('showing');
	          });

						var contentString = '<div id="info-window-content'+i+'">'+
							'<div id="siteNotice'+i+'">'+
							'</div>'+
							'<div id="firstHeading'+i+'" class="firstHeading">'+latLng.address+'</div>'+
							'</div>';

						var marker = new google.maps.Marker({
							position: myLatLng,
							map: map,
							title: latLng.address
						});
						addInfoWindow(marker, contentString, latLng.permalink);

						avgLatLng.lat += parseFloat(myLatLng.lat());
						avgLatLng.lng += parseFloat(myLatLng.lng());
						
						if(i === 0) {
							console.log('all len: ' + allAddrLen);
							avgLatLng.lat = avgLatLng.lat;
							avgLatLng.lng = avgLatLng.lng;
							var centerPoint = new google.maps.LatLng(avgLatLng.lat, avgLatLng.lng);
							console.log(avgLatLng);
							mapCenter = centerPoint;
							map.panTo(centerPoint);
							elem.addClass('showing');
						} //end if

	        }
	      );
			})(iter);
		}
	}

	return {
		enable: enable
	}
}