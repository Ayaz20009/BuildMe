$(document).ready(function(){

  var geocoder = new google.maps.Geocoder();


  $("a.map").click(function(){


      var jobID = $(this).attr('id').split('_')[1];
      var address = $('#addr_' + jobID).val();

      //find lat,long,if find ,draw mpa
	geocoder.geocode( { 'address': address}, function(results, status) {

	  if (status == google.maps.GeocoderStatus.OK) {

		    var latitude = results[0].geometry.location.lat();
		    var longitude = results[0].geometry.location.lng();
		    $('#map_' + jobID).html(latitude + "," + longitude);
		      drawMap(latitude,longitude, 'map_' + jobID);
	  } 
	  else
	  	    $('#map_' + jobID).html(
	  		    '<i class="fa fa-exclamation-triangle"></i>Can not find the location.'
	  		 );

      });

}); 
	function drawMap(lat,long,selector) {

	  var mapCanvas = document.getElementById(selector);
	  var mapOptions = {
	    center: new google.maps.LatLng(lat, long), 
	    zoom: 14
	  }
	  var map = new google.maps.Map(mapCanvas, mapOptions);
	};



});