google.maps.event.addDomListener(window, 'load', initMap);
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: zoom_level
  });    

  var marker = new google.maps.Marker({
    icon: user_icon,
    map: map
  });
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      marker.setPosition(pos);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    map.setCenter({lat:"-7.238985",lng:"144.924088"})
    handleLocationError(false, map.getCenter());
  }
  google.maps.event.addListener(map, 'idle', function(){
      // do something only the first time the map is loaded
      debugger
  });
}

function handleLocationError(browserHasGeolocation, pos) {
  var infoWindow = new google.maps.InfoWindow({map: map});
  infoWindow.setPosition(pos);
  if (browserHasGeolocation) {
    errorContent = 'Error: The Geolocation service failed.' ;
  } else {
    errorContent = 'Error: Your browser doesn\'t support geolocation.';
  }
  infoWindow.setContent();
}